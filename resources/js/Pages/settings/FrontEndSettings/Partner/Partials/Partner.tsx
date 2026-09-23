import { ConfirmDialog } from '@/components/ConfirmDialog';
import Table from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/can';
import { router, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Index({ partners }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [preview, setPreview] = useState(null);
    const [partner, setPartner] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const canCreate = useCan('Create');
    const canEdit = useCan('Edit');
    const canDelete = useCan('Delete');

    const { data, post, setData, reset, errors, processing } = useForm({
        name: '',
        logo: null,
        url: '',
        active: true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            post(route('partners.update', editing.id), {
                onSuccess: () => {
                    reset();
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            post(route('partners.store'), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                },
                onError: (err) => console.log(err),
            });
        }
    };

    const handleConfirm = () => {
        router.delete(route('partners.destroy', partner.id), {
            preserveScroll: true,
            onSuccess: () => setShowConfirm(false),
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    const handleEdit: FormEventHandler = (item) => {
        setEditing(item);
        setShowForm(true);
        setData((prev) => ({
            ...prev,
            name: item.name,
            logo: null, // keep current logo path
            url: item.url,
            active: item.active,
        }));
    };

    const handleDelete: FormEventHandler = (item) => {
        setPartner(item);
        setShowConfirm(true);
    };

    const columns = [
        { key: '#', label: '#', render: (item) => item.id },
        {
            key: 'logo',
            className: 'flex justify-center text-center',
            label: 'Logo',
            render: (item) => item.logo && <img src={`/storage/${item.logo}`} alt={item.name} className="h-10" />,
        },
        { key: 'name', label: 'Name' },
        {
            key: 'url',
            label: 'URL',
            render: (item) =>
                item.url ? (
                    <a href={item.url} target="_blank" className="text-blue-600 underline">
                        {item.url}
                    </a>
                ) : (
                    '-'
                ),
        },
        { key: 'active', className: 'text-center', label: 'Active', render: (item) => (item.active ? '✅' : '❌') },
    ];

    return (
        <Card className="mt-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Manage Partners</CardTitle>
                {canCreate && (
                    <Button
                        onClick={() => {
                            reset();
                            setEditing(null);
                            setShowForm(!showForm);
                        }}
                    >
                        <Plus className="mr-1 h-4 w-4" /> Add Partner
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                {showForm && (
                    <form role="form" onSubmit={handleSubmit} className="mb-6 space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="logo">Logo</Label>
                            <Input id="logo" type="file" onChange={handleFileChange} />
                            {/* Show selected new logo preview */}
                            {preview && (
                                <div className="mb-2">
                                    <img src={preview} alt="New Logo" className="h-12" />
                                </div>
                            )}

                            {/* If no new preview, but editing has a logo → show current logo */}
                            {!preview && editing && editing.logo && (
                                <div className="mb-2">
                                    <img src={`/storage/${editing.logo}`} alt="Current Logo" className="h-12" />
                                </div>
                            )}
                            {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                        </div>

                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input id="url" value={data.url} onChange={(e) => setData('url', e.target.value)} />
                            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <Input className="w-6" type="checkbox" checked={data.active} onChange={(e) => setData('active', e.target.checked)} />
                            <span>Active</span>
                        </div>

                        <div className="mt-4 flex justify-start gap-2">
                            <Button type="button" onClick={() => setShowForm(!showForm)} className="w-fit" disabled={processing}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {editing ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </form>
                )}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <Table
                        items={partners}
                        columns={columns}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        actionHeadClass="border p-4 w-24 text-center"
                        emptyMessage="No FAQ found."
                    />
                </div>
            </CardContent>
            <ConfirmDialog
                title="Delete Partner"
                message="Are you sure you want to delete this Partner?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isOpen={showConfirm}
            />
        </Card>
    );
}

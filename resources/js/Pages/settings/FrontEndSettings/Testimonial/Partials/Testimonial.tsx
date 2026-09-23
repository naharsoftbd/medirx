import { ConfirmDialog } from '@/components/ConfirmDialog';
import Table from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCan } from '@/lib/can';
import { router, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Testimonial({ testimonials }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [preview, setPreview] = useState(null);
    const [testimonial, setTestimonial] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const canCreate = useCan('Create');
    const canEdit = useCan('Edit');
    const canDelete = useCan('Delete');

    const { data, post, setData, reset, processing } = useForm({
        name: '',
        designation: '',
        message: '',
        avatar: null,
        active: true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editing) {
            post(route('testimonials.update', editing.id), {
                forceFormData: true, // Needed if file uploads exist
                onSuccess: () => {
                    reset();
                    setEditing(null);
                    setPreview(null);
                    setShowForm(false);
                },
            });
        } else {
            post(route('testimonials.store'), {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    setPreview(null);
                    setShowForm(false);
                },
            });
        }
    };

    const handleConfirm = () => {
        router.delete(route('testimonials.destroy', testimonial.id), {
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
            designation: item.designation,
            message: item.message,
            avatar: null, // keep current logo path
            active: item.active,
        }));
    };

    const handleDelete: FormEventHandler = (item) => {
        setTestimonial(item);
        setShowConfirm(true);
    };

    const columns = [
        { key: '#', label: '#', render: (item) => item.id },
        { key: 'name', label: 'Name' },
        { key: 'designation', label: 'Designation' },
        { key: 'message', label: 'Message' },
        {
            key: 'avatar',
            className: 'text-center',
            label: 'Avatar',
            render: (item) => item.avatar && <img src={`/storage/${item.avatar}`} className="h-10 w-10 rounded-full" />,
        },
        { key: 'active', className: 'text-center', label: 'Active', render: (item) => (item.active ? '✅' : '❌') },
    ];

    return (
        <Card className="mt-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Manage Testimonials</CardTitle>
                {canCreate && (
                    <Button
                        onClick={() => {
                            reset();
                            setEditing(null);
                            setPreview(null);
                            setShowForm(!showForm);
                        }}
                    >
                        <Plus className="mr-1 h-4 w-4" /> Add Testimonial
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                {showForm && (
                    <form role="form" onSubmit={handleSubmit} className="mb-6 space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        </div>

                        <div>
                            <Label htmlFor="designation">Designation</Label>
                            <Input id="designation" value={data.designation} onChange={(e) => setData('designation', e.target.value)} />
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" value={data.message} onChange={(e) => setData('message', e.target.value)} />
                        </div>

                        <div>
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input id="avatar" type="file" onChange={handleFileChange} />
                            {/* Show selected new logo preview */}
                            {preview && (
                                <div className="mb-2">
                                    <img src={preview} alt="New avatar" className="h-12" />
                                </div>
                            )}

                            {/* If no new preview, but editing has a avatar → show current avatar */}
                            {!preview && editing && editing.avatar && (
                                <div className="mb-2">
                                    <img src={`/storage/${editing.avatar}`} alt="Current avatar" className="h-12" />
                                </div>
                            )}
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
                        items={testimonials}
                        columns={columns}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        actionHeadClass="border p-4 w-24 text-center"
                        emptyMessage="No Testimonial found."
                    />
                </div>
            </CardContent>
            <ConfirmDialog
                title="Delete Testimonial"
                message="Are you sure you want to delete this Testimonial?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isOpen={showConfirm}
            />
        </Card>
    );
}

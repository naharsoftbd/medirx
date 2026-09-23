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

export default function Index({ faqs }) {
    const [showForm, setShowForm] = useState(false);
    const [faq, setFaq] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const canCreate = useCan('Create');
    const canEdit = useCan('Edit');
    const canDelete = useCan('Delete');

    const { data, setData, post, put, reset, processing } = useForm({
        question: '',
        answer: '',
        active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (faq) {
            put(route('faqs.update', faq.id), {
                onSuccess: () => {
                    reset();
                    setFaq(null);
                    setShowForm(false);
                },
            });
        } else {
            post(route('faqs.store'), {
                onSuccess: () => {
                    reset();
                    setFaq(null);
                    setShowForm(false);
                },
            });
        }
    };

    const handleConfirm = () => {
        router.delete(route('faqs.destroy', faq.id), {
            preserveScroll: true,
            onSuccess: () => setShowConfirm(false),
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    const handleEdit: FormEventHandler = (item) => {
        setShowForm(true);
        const editfaq = faqs.find((faq) => faq.id === item.id);
        setFaq(editfaq);
        setData((prev) => ({
            ...prev,
            question: editfaq.question, // File object
            answer: editfaq.answer,
            active: editfaq.active,
        }));
    };

    const handleDelete: FormEventHandler = (item) => {
        setFaq(item);
        setShowConfirm(true);
    };

    const columns = [
        { key: '#', label: '#', render: (item) => item.id },
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'active', className: 'text-center', label: 'Active', render: (item) => (item.active ? '✅' : '❌') },
    ];

    return (
        <Card className="mt-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Manage FAQs</CardTitle>
                {canCreate && (
                    <Button onClick={() => setShowForm(!showForm)}>
                        <Plus className="mr-1 h-4 w-4" /> Add FAQ
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                {showForm && (
                    <form role="form" onSubmit={handleSubmit} className="mb-6 space-y-4">
                        <div>
                            <Label htmlFor="question" className="mb-1 block">
                                Question
                            </Label>
                            <Input
                                id="question"
                                type="text"
                                className="w-full rounded border p-2"
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="answer" className="mb-1 block">
                                Answer
                            </Label>
                            <Textarea
                                id="answer"
                                className="w-full rounded border p-2"
                                rows="3"
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-start gap-2">
                            <Input className="w-6" type="checkbox" checked={data.active} onChange={(e) => setData('active', e.target.checked)} />
                            <span>Active</span>
                        </div>
                        <div className="mt-4 flex justify-start gap-2">
                            <Button type="button" onClick={() => setShowForm(!showForm)} className="w-fit" disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Save FAQ
                            </Button>
                        </div>
                    </form>
                )}

                {/* FAQ List */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <Table
                        items={faqs}
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
                title="Delete FAQ"
                message="Are you sure you want to delete this FAQ?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isOpen={showConfirm}
            />
        </Card>
    );
}

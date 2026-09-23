import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // shadcn switch
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department Settings',
        href: '/settings/frontend/depertment',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
}

export default function Edit({ settings, flash }: Props) {
    const [showDepartment, setShowDepartment] = useState(settings?.homepage_show_departments);
    const { data, setData, post, processing } = useForm({
        department_heading: settings?.department_heading || '',
        department_subheading: settings?.department_subheading || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.department.update'));
    }

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const onCancel = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('settings.frontend.index'));
    };

    const toggleDepartment = (checked) => {
        setShowDepartment(checked);
        router.post(
            route('settings.frontend.department.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="flex items-center space-x-2 p-4">
                    <Label htmlFor="homepage-banner-toggle">Show on Homepage</Label>
                    <Switch
                        className="data-[state=checked]:bg-[var(--btn-base-color)]"
                        id="homepage-feature-toggle"
                        checked={showDepartment}
                        onCheckedChange={toggleDepartment}
                    />
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Site Title */}
                        <div>
                            <Label htmlFor="department_heading">Heading</Label>
                            <Input
                                id="department_heading"
                                value={data.department_heading}
                                onChange={(e) => setData('department_heading', e.target.value)}
                            />
                        </div>

                        {/* Currency */}
                        <div>
                            <Label htmlFor="department_subheading">Subheading</Label>
                            <Input
                                id="department_subheading"
                                value={data.department_subheading}
                                onChange={(e) => setData('department_subheading', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={(e) => {
                                onCancel(e);
                            }}
                            className="mr-1"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

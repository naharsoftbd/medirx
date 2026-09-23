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
        title: 'Doctor Settings',
        href: '/settings/frontend/doctor',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
}

export default function Edit({ settings, flash }: Props) {
    const [showDoctors, setShowDoctors] = useState(settings?.homepage_show_doctors);
    const { data, setData, post, processing } = useForm({
        doctor_heading: settings?.doctor_heading || '',
        doctor_subheading: settings?.doctor_subheading || '',
        home_doctor_item: settings?.home_doctor_item || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.doctor.update'));
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

    const toggleDoctors = (checked) => {
        setShowDoctors(checked);
        router.post(
            route('settings.frontend.doctor.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Doctor Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="flex items-center space-x-2 p-4">
                    <Label htmlFor="homepage-banner-toggle">Show on Homepage</Label>
                    <Switch
                        className="data-[state=checked]:bg-[var(--btn-base-color)]"
                        id="homepage-doctor-toggle"
                        checked={showDoctors}
                        onCheckedChange={toggleDoctors}
                    />
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Heading */}
                        <div>
                            <Label htmlFor="doctor_heading">Heading</Label>
                            <Input id="doctor_heading" value={data.doctor_heading} onChange={(e) => setData('doctor_heading', e.target.value)} />
                        </div>

                        {/* Subheading */}
                        <div>
                            <Label htmlFor="doctor_subheading">Subheading</Label>
                            <Input
                                id="doctor_subheading"
                                value={data.doctor_subheading}
                                onChange={(e) => setData('doctor_subheading', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <Label htmlFor="home_doctor_item">Home Doctors</Label>
                                <Input
                                    id="home_doctor_item"
                                    type="number"
                                    value={data.home_doctor_item}
                                    onChange={(e) => setData('home_doctor_item', e.target.value)}
                                />
                            </div>
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

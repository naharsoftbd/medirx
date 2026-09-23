import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // shadcn switch
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feature Doctor Settings',
        href: '/settings/frontend/doctor',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
}

export default function Edit({ settings, flash }: Props) {
    const [showFeature, setShowFeature] = useState(settings?.homepage_show_features);
    const { data, setData, post, processing } = useForm({
        featured_doctor_heading: settings?.featured_doctor_heading || '',
        featured_doctor_subheading: settings?.featured_doctor_subheading || '',
        home_feature_doctor_item: settings?.home_feature_doctor_item || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.featureddoctor.update'));
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

    const toggleFeature = (checked) => {
        setShowFeature(checked);
        router.post(
            route('settings.frontend.feature.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Featured Doctor Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="flex items-center space-x-2 p-4">
                    <Label htmlFor="homepage-feature-toggle">Show on Homepage</Label>
                    <Switch
                        className="data-[state=checked]:bg-[var(--btn-base-color)]"
                        id="homepage-feature-toggle"
                        checked={showFeature}
                        onCheckedChange={toggleFeature}
                    />
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Heading */}
                        <div>
                            <Label htmlFor="featured_doctor_heading">Heading</Label>
                            <Input
                                id="featured_doctor_heading"
                                value={data.featured_doctor_heading}
                                onChange={(e) => setData('featured_doctor_heading', e.target.value)}
                            />
                        </div>

                        {/* Subheading */}
                        <div>
                            <Label htmlFor="featured_doctor_subheading">Subheading</Label>
                            <Input
                                id="featured_doctor_subheading"
                                value={data.featured_doctor_subheading}
                                onChange={(e) => setData('featured_doctor_subheading', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <Label htmlFor="home_feature_doctor_item">Home Feature Doctors</Label>
                                <Input
                                    id="home_feature_doctor_item"
                                    type="number"
                                    value={data.home_feature_doctor_item}
                                    onChange={(e) => setData('home_feature_doctor_item', e.target.value)}
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
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

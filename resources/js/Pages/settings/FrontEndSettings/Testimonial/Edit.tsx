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
import Testimonial from './Partials/Testimonial';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonial Settings',
        href: '/settings/frontend/testimonial',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
    testimonials: [];
}

export default function Edit({ settings, flash, testimonials }: Props) {
    const [showTestimonial, setShowTestimonial] = useState(settings?.homepage_show_testimonials);
    const { data, setData, post, processing } = useForm({
        testimonial_heading: settings?.testimonial_heading || '',
        testimonial_subheading: settings?.testimonial_subheading || '',
        home_testimonial_item: settings?.home_testimonial_item || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.testimonial.update'));
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

    const toggleTestimonial = (checked) => {
        setShowTestimonial(checked);
        router.post(
            route('settings.frontend.testimonial.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonial Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="mb-4 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* ✅ Toggle switch */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="homepage-testimonial-toggle">Show on Homepage</Label>
                            <Switch
                                className="data-[state=checked]:bg-[var(--btn-base-color)]"
                                id="homepage-testimonial-toggle"
                                checked={showTestimonial}
                                onCheckedChange={toggleTestimonial}
                            />
                        </div>
                    </div>
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/*  Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Heading */}
                        <div>
                            <Label htmlFor="testimonial_heading">Heading</Label>
                            <Input
                                id="testimonial_heading"
                                value={data.testimonial_heading}
                                onChange={(e) => setData('testimonial_heading', e.target.value)}
                            />
                        </div>

                        {/* Subheading */}
                        <div>
                            <Label htmlFor="testimonial_subheading">Subheading</Label>
                            <Input
                                id="testimonial_subheading"
                                value={data.testimonial_subheading}
                                onChange={(e) => setData('testimonial_subheading', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <Label htmlFor="home_testimonial_item">Home Testimonials</Label>
                                <Input
                                    id="home_testimonial_item"
                                    type="number"
                                    value={data.home_testimonial_item}
                                    onChange={(e) => setData('home_testimonial_item', e.target.value)}
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
                <Testimonial testimonials={testimonials.data} />
            </div>
        </AppLayout>
    );
}

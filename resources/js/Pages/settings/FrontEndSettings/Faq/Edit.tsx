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
import Faq from './Partials/Faq';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQ Settings',
        href: '/settings/frontend/faq',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
    faqs: [];
}

export default function Edit({ settings, flash, faqs }: Props) {
    const [showFaq, setShowFaq] = useState(settings?.homepage_show_faq);
    const { data, setData, post, processing } = useForm({
        faq_heading: settings?.faq_heading || '',
        faq_subheading: settings?.faq_subheading || '',
        home_faq_item: settings?.home_faq_item || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.faq.update'));
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

    const toggleFaq = (checked) => {
        setShowFaq(checked);
        router.post(
            route('settings.frontend.faq.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQ Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="mb-4 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* ✅ Toggle switch */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="homepage-faq-toggle">Show on Homepage</Label>
                            <Switch
                                className="data-[state=checked]:bg-[var(--btn-base-color)]"
                                id="homepage-faq-toggle"
                                checked={showFaq}
                                onCheckedChange={toggleFaq}
                            />
                        </div>
                    </div>
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Heading */}
                        <div>
                            <Label htmlFor="faq_heading">Heading</Label>
                            <Input id="faq_heading" value={data.faq_heading} onChange={(e) => setData('faq_heading', e.target.value)} />
                        </div>

                        {/* Subheading */}
                        <div>
                            <Label htmlFor="faq_subheading">Subheading</Label>
                            <Input id="faq_subheading" value={data.faq_subheading} onChange={(e) => setData('faq_subheading', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <Label htmlFor="home_faq_item">Home Faqs</Label>
                            <Input
                                id="home_faq_item"
                                type="number"
                                value={data.home_faq_item}
                                onChange={(e) => setData('home_faq_item', e.target.value)}
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
                <Faq faqs={faqs} />
            </div>
        </AppLayout>
    );
}

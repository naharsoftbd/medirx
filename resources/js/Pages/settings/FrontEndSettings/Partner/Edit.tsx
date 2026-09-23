import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // shadcn switch
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Partner from './Partials/Partner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Partner Settings',
        href: '/settings/frontend/partner',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
    partners: [];
}

export default function Edit({ settings, flash, partners }: Props) {
    const [showPartner, setShowPartner] = useState(settings?.homepage_show_partners);
    const { data, setData, post, processing } = useForm({
        partner_heading: settings?.partner_heading || '',
        partner_subheading: settings?.partner_subheading || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.partner.update'));
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

    const togglePartner = (checked) => {
        setShowPartner(checked);
        router.post(
            route('settings.frontend.partner.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partner Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="mb-4 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* ✅ Toggle switch */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="homepage-partner-toggle">Show on Homepage</Label>
                            <Switch
                                className="data-[state=checked]:bg-[var(--btn-base-color)]"
                                id="homepage-partner-toggle"
                                checked={showPartner}
                                onCheckedChange={togglePartner}
                            />
                        </div>
                    </div>
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/* 4 Column Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Site Title */}
                        <div>
                            <Label htmlFor="partner_heading">Heading</Label>
                            <Input id="partner_heading" value={data.partner_heading} onChange={(e) => setData('partner_heading', e.target.value)} />
                        </div>

                        {/* Currency */}
                        <div>
                            <Label htmlFor="partner_subheading">Subheading</Label>
                            <Input
                                id="partner_subheading"
                                value={data.partner_subheading}
                                onChange={(e) => setData('partner_subheading', e.target.value)}
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
                            Save Settings
                        </Button>
                    </div>
                </form>
                <Partner partners={partners} />
            </div>
        </AppLayout>
    );
}

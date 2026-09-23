import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import BannerForm from './Partials/BannerForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Banners',
        href: '/banners',
    },
];

export default function Index({ flash }) {
    const { banners, bannerSetting } = usePage<SharedData>().props;
    const [editingBanner, setEditingBanner] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showBanner, setShowBanner] = useState(bannerSetting);

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const toggleBanner = (checked) => {
        setShowBanner(checked);
        router.post(
            route('settings.frontend.banner.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Frontend" />
            <ToastContainer />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="hidden text-xl font-bold sm:flex">Manage Banners</h1>
                    <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                        {/* ✅ Toggle switch */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="homepage-banner-toggle">Show on Homepage</Label>
                            <Switch
                                className="data-[state=checked]:bg-[var(--btn-base-color)]"
                                id="homepage-banner-toggle"
                                checked={showBanner}
                                onCheckedChange={toggleBanner}
                            />
                        </div>

                        {/* Add button */}
                        <Button
                            onClick={() => {
                                setEditingBanner(null);
                                setShowForm(true);
                            }}
                            className="w-full rounded-lg px-4 py-2 text-white sm:w-auto"
                        >
                            + Add Banner
                        </Button>
                    </div>
                </div>

                {/* Banner List */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {banners.map((banner) => (
                        <div key={banner.id} className="rounded-lg border p-3 shadow">
                            {banner.image && (
                                <img src={`${banner.banner_image_url}`} alt={banner.title} className="h-40 w-full rounded object-cover" />
                            )}
                            <h2 className="mt-2 font-semibold">{banner.title}</h2>
                            <p className="text-sm text-gray-600">{banner.subtitle}</p>
                            <div className="mt-3 flex justify-between">
                                <button
                                    onClick={() => {
                                        setEditingBanner(banner);
                                        setShowForm(true);
                                    }}
                                    className="mt-1 mr-1 flex cursor-pointer text-sm text-blue-600"
                                >
                                    <Edit className="mt-1 mr-1" size={14}></Edit>
                                    Edit
                                </button>
                                <Link
                                    href={route('banners.destroy', banner.id)}
                                    method="delete"
                                    as="button"
                                    className="flex cursor-pointer text-sm text-red-600"
                                >
                                    <X className="mt-1 mr-1" size={14} />
                                    Delete
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {showForm && <BannerForm banner={editingBanner} onClose={() => setShowForm(false)} />}
            </div>
        </AppLayout>
    );
}

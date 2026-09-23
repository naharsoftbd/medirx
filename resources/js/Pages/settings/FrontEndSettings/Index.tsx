import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Globe, HelpCircle, Image, Layout, Monitor, User, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Frontend',
        href: '/settings/frontend',
    },
];

export default function Index() {
    const settingsMenu = [
        {
            title: 'Banner Settings',
            icon: Image, // ✅ Image icon is fine
            href: route('banners.index'),
        },
        {
            title: 'Departments Settings',
            icon: Layout, // 🏢 Layout or Columns icon for sections/departments
            href: route('settings.frontend.department'),
        },
        {
            title: 'Doctors Settings',
            icon: User, // 👨‍⚕️ Single user icon for doctors
            href: route('settings.frontend.doctor'),
        },
        {
            title: 'Feature Doctors Settings',
            icon: Users, // 👥 Multiple users icon for featured doctors
            href: route('settings.frontend.featureddoctor'),
        },
        {
            title: 'FAQ Settings',
            icon: HelpCircle, // ❓ Help / FAQ icon
            href: route('settings.frontend.faq'),
        },
        {
            title: 'Partners Settings',
            icon: Globe, // 🌐 Globe is good for partners/SEO
            href: route('settings.frontend.partner'),
        },
        {
            title: 'Testimonial Settings',
            icon: Monitor, // 🖥 Monitor is OK but you could also use MessageCircle
            href: route('settings.frontend.testimonial'),
        },
        {
            title: 'Blog Settings',
            icon: Monitor, // 🖥 Monitor is OK but you could also use MessageCircle
            href: route('settings.frontend.blog'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Frontend" />
            <div className="ml-auto p-4">
                <Button onClick={() => window.history.back()} className="text-white">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {settingsMenu.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Link key={index} href={item.href}>
                            <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center gap-3">
                                    <Icon className="h-6 w-6 text-[var(--base-color)]" />
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500">Configure {item.title.toLowerCase()} here.</p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </AppLayout>
    );
}

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
        title: 'Blogs Settings',
        href: '/settings/frontend/blog',
    },
];

interface Props {
    settings: Record<string, string>;
    flash: Record<string, string>;
}

export default function Edit({ settings, flash }: Props) {
    const [showBlog, setShowBlog] = useState(settings?.homepage_show_blogs);
    const { data, setData, post, processing } = useForm({
        blog_heading: settings?.blog_heading || '',
        blog_subheading: settings?.blog_subheading || '',
        home_blog_item: settings?.home_blog_item || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.frontend.blog.update'));
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

    const toggleBlog = (checked) => {
        setShowBlog(checked);
        router.post(
            route('settings.frontend.blog.toggle'),
            { value: checked },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Settings" />
            <ToastContainer />
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                <div className="mb-4 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        {/* ✅ Toggle switch */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="homepage-blog-toggle">Show on Homepage</Label>
                            <Switch
                                className="data-[state=checked]:bg-[var(--btn-base-color)]"
                                id="homepage-blog-toggle"
                                checked={showBlog}
                                onCheckedChange={toggleBlog}
                            />
                        </div>
                    </div>
                </div>
                <form role="form" onSubmit={submit} className="mx-auto w-full space-y-4 p-4">
                    {/*  Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Heading */}
                        <div>
                            <Label htmlFor="blog_heading">Heading</Label>
                            <Input id="blog_heading" value={data.blog_heading} onChange={(e) => setData('blog_heading', e.target.value)} />
                        </div>

                        {/* Subheading */}
                        <div>
                            <Label htmlFor="blog_subheading">Subheading</Label>
                            <Input id="blog_subheading" value={data.blog_subheading} onChange={(e) => setData('blog_subheading', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <Label htmlFor="home_blog_item">Home Blogs</Label>
                                <Input
                                    id="home_blog_item"
                                    type="number"
                                    value={data.home_blog_item}
                                    onChange={(e) => setData('home_blog_item', e.target.value)}
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

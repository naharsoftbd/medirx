import AnimatedHeading from '@/components/AnimatedHeading';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function BlogList({ blogs: initialBlogs }) {
    const { appSettings } = usePage().props as { appSettings: Record<string, string> };

    // State for blogs and pagination
    const [blogs, setBlogs] = useState(initialBlogs.data || []);
    const [nextPageUrl, setNextPageUrl] = useState(initialBlogs.next_page_url || null);
    const [loading, setLoading] = useState(false);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(() => {
        if (!nextPageUrl || loading) return;

        setLoading(true);

        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true, // <-- Add this line
                replace: true, // optional: prevents adding a new history entry
                onSuccess: (page) => {
                    setBlogs((prev) => [...prev, ...(page.props.blogs.data || [])]);
                    setNextPageUrl(page.props.blogs.next_page_url || null);
                },
                onFinish: () => setLoading(false),
            },
        );
    }, [nextPageUrl, loading]);

    // Infinite scroll setup
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }, // start loading slightly before reaching the bottom
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div className="container mx-auto bg-gray-50 py-10">
            <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.blog_heading}</AnimatedHeading>
            <p className="mb-10 text-center text-gray-500">{appSettings?.blog_subheading}</p>

            {loading && (
                <div role="status" className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[var(--base-color)] border-t-transparent"></div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <motion.div key={blog.id} whileHover={{ y: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Card className="relative overflow-hidden pt-0 pb-6">
                            <div className="relative h-48 w-full">
                                {blog.image_url ? (
                                    <img src={blog.image_url} alt={blog.title} className="h-full w-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">No Image</div>
                                )}
                                {blog.category && (
                                    <span className="absolute top-2 left-2 rounded bg-[var(--base-color)] px-2 py-1 text-xs font-semibold text-white">
                                        {blog.category.name}
                                    </span>
                                )}
                            </div>

                            <CardContent className="flex h-full flex-col justify-between px-4">
                                <div>
                                    <h2 className="mb-2 line-clamp-2 text-xl font-semibold">
                                        <Link href={route('blogs.show', { slug: blog.slug })} className="transition-colors hover:text-blue-600">
                                            {blog.title}
                                        </Link>
                                    </h2>
                                    <p className="line-clamp-3 text-sm text-gray-600">{blog.excerpt || blog.content.replace(/<[^>]+>/g, '')}</p>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-500">
                                    {blog.author && <span>By {blog.author.name}</span>}
                                    {blog.published_at && <span>{format(new Date(blog.published_at), 'dd MMM yyyy HH:mm')}</span>}
                                </div>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {blog.tags.map((tag) => (
                                            <span key={tag.id} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href={route('blogs.show', { slug: blog.slug })}
                                    className="mt-4 text-[var(--base-color)] transition-colors hover:text-blue-600"
                                >
                                    {'Continue Reading >>'}
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Invisible div at the bottom for intersection observer */}
            {nextPageUrl && <div ref={observerRef} className="h-10 w-full" />}
        </div>
    );
}

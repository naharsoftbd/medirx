import BlogList from '@/components/Blocks/BlogList';
import { router } from '@inertiajs/react';
import { act, render, screen } from '@testing-library/react';

// --- Mock inertia router ---
jest.mock('@inertiajs/react', () => ({
    Link: (props) => <a {...props} />,
    usePage: () => ({
        props: { appSettings: { blog_heading: 'Blogs', blog_subheading: 'Latest' } },
    }),
    router: {
        get: jest.fn(),
    },
}));

// --- Mock IntersectionObserver ---
class MockIntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {
        this.callback([{ isIntersecting: true }]);
    }
    disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

describe('BlogList Infinite Scroll', () => {
    const blogsData = {
        data: [
            { id: 1, title: 'Blog 1', slug: 'blog-1', content: '', image_url: null, tags: [] },
            { id: 2, title: 'Blog 2', slug: 'blog-2', content: '', image_url: null, tags: [] },
        ],
        next_page_url: '/blogs?page=2',
    };

    test('renders blogs', () => {
        render(<BlogList blogs={blogsData} />);
        expect(screen.getByText(/Blog 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Blog 2/i)).toBeInTheDocument();
    });

    it('loads more blogs when intersecting', async () => {
        router.get.mockImplementation((url, data, options) => {
            options.onSuccess({
                props: {
                    blogs: {
                        data: [{ id: 3, title: 'Blog 3', slug: 'blog-3', content: '', tags: [] }],
                        next_page_url: null,
                    },
                },
            });
        });

        await act(async () => {
            render(<BlogList blogs={blogsData} />);
        });

        expect(router.get).toHaveBeenCalledWith('/blogs?page=2', {}, expect.objectContaining({ preserveScroll: true }));

        expect(await screen.findByText('Blog 3')).toBeInTheDocument();
    });

    it('shows spinner while loading', () => {
        render(<BlogList blogs={blogsData} loading={true} />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});

<?php

namespace App\Services\Blogs;

use App\Interfaces\Blogs\BlogRepositoryInterface;
use App\Models\Blogs\Blog;
use App\Models\PageBlock;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BlogService
{
    protected $blogs;

    public function __construct(BlogRepositoryInterface $blogs)
    {
        $this->blogs = $blogs;
    }

    public function list($filters): LengthAwarePaginator
    {
        return $this->blogs->all($filters);
    }

    public function store(array $data): Blog
    {
        $slug = Blog::generateUniqueSlug($data['title']);

        $data['slug'] = $slug;
        $data['author_id'] = auth()->id();

        $blog = $this->blogs->create($data);
        if (! empty($data['category_ids']) && is_array($data['category_ids'])) {
            $blog->categories()->sync($data['category_ids']);
        }

        return $blog->refresh();
    }

    public function find($id): ?Blog
    {
        return $this->blogs->find($id);
    }

    public function update(int $id, array $data): bool
    {
        $slug = Blog::generateUniqueSlug($data['title'], $id);

        $data['slug'] = $slug;

        $result = $this->blogs->update($id, $data);
        $blog = $this->blogs->find($id);
        if (! empty($data['category_ids']) && is_array($data['category_ids'])) {
            $blog->categories()->sync($data['category_ids']);
        }

        return $result;
    }

    public function destroy(int $id): bool
    {
        return $this->blogs->delete($id);
    }

    public function getPopularBlogs($limit = 5)
    {
        return $this->blogs->getPopularBlogs($limit);
    }

    /**
     * Match the first blog-list block on any page (including nested in columns) for category listing UX.
     *
     * @return array{blogCount: int, pagination: string, layoutWidth: string, twClass: string, className: string}
     */
    public function getBlogListBlockDefaults(): array
    {
        $defaults = [
            'blogCount'   => 9,
            'pagination'  => 'none',
            'layoutWidth' => 'boxed',
            'twClass'     => '',
            'className'   => '',
        ];

        $topLevel = PageBlock::query()
            ->where('type', 'blog-list')
            ->orderBy('position')
            ->first();

        if ($topLevel && is_array($topLevel->content)) {
            return $this->mergeBlogListSettings($defaults, $topLevel->content);
        }

        foreach (PageBlock::query()->where('type', 'columns-layout')->cursor() as $block) {
            $nested = $this->findBlogListInColumnsContent(is_array($block->content) ? $block->content : []);
            if ($nested !== null) {
                return $this->mergeBlogListSettings($defaults, $nested);
            }
        }

        return $defaults;
    }

    /**
     * @param  array<string, mixed>  $defaults
     * @param  array<string, mixed>  $content
     * @return array{blogCount: int, pagination: string, layoutWidth: string, twClass: string, className: string}
     */
    protected function mergeBlogListSettings(array $defaults, array $content): array
    {
        $blogCount = isset($content['blogCount']) && (int) $content['blogCount'] > 0
            ? (int) $content['blogCount']
            : $defaults['blogCount'];

        $pagination = $content['pagination'] ?? $defaults['pagination'];
        if (! in_array($pagination, ['none', 'paginate', 'load-more'], true)) {
            $pagination = $defaults['pagination'];
        }

        $layoutWidth = ($content['layoutWidth'] ?? $defaults['layoutWidth']) === 'full' ? 'full' : 'boxed';

        $twClass = isset($content['twClass']) && is_string($content['twClass'])
            ? trim($content['twClass'])
            : $defaults['twClass'];

        $className = isset($content['className']) && is_string($content['className'])
            ? trim($content['className'])
            : $defaults['className'];

        return [
            'blogCount'   => $blogCount,
            'pagination'  => $pagination,
            'layoutWidth' => $layoutWidth,
            'twClass'     => $twClass,
            'className'   => $className,
        ];
    }

    /**
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>|null
     */
    protected function findBlogListInColumnsContent(array $content): ?array
    {
        $children = $content['children'] ?? null;
        if (! is_array($children)) {
            return null;
        }

        foreach ($children as $column) {
            if (! is_array($column)) {
                continue;
            }
            foreach ($column as $child) {
                if (! is_array($child)) {
                    continue;
                }
                $type = $child['type'] ?? '';
                if ($type === 'blog-list') {
                    $raw = $child['content'] ?? [];

                    return is_array($raw) ? $raw : [];
                }
                if ($type === 'columns-layout') {
                    $nested = $this->findBlogListInColumnsContent(is_array($child['content'] ?? null) ? $child['content'] : []);
                    if ($nested !== null) {
                        return $nested;
                    }
                }
            }
        }

        return null;
    }
}

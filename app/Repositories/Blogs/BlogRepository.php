<?php

namespace App\Repositories\Blogs;

use App\Interfaces\Blogs\BlogRepositoryInterface;
use App\Models\Blogs\Blog;
use App\Models\Setting;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogRepository implements BlogRepositoryInterface
{
    public function all($filters): LengthAwarePaginator
    {
        $recordsPerPage = Setting::getValue('records_per_page', 10);

        $perPage = $filters['per_page'] ?? $recordsPerPage;

        $blogs = Blog::query();

        if (! empty($filters['search'])) {
            $blogs->where('title', 'like', '%'.$filters['search'].'%');
            $blogs->orWhere('content', 'like', '%'.$filters['search'].'%');
            $blogs->orWhere('excerpt', 'like', '%'.$filters['search'].'%');
        }

        $blogs->where('author_id', Auth::user()->id);

        return $blogs->with('categories', 'tags')->latest()->paginate($perPage)->withQueryString();
    }

    public function find(int $id): ?Blog
    {
        return Blog::with('image', 'categories', 'tags')->find($id);
    }

    public function create(array $data): Blog
    {
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $blog_image = $data['image'] ?? null;
        unset($data['image']);
        $selectedImagePath = $data['image_path'] ?? null;
        unset($data['image_path']);

        $blog = Blog::create($data);

        if ($blog_image) {
            $directory = 'uploads/'.now()->format('Y/m/d');
            $ImagePath = $blog_image->store($directory, 'public');
            $blog->image()->create([
                'path' => $ImagePath,
            ]);
        } elseif ($selectedImagePath) {
            $blog->image()->create([
                'path' => $selectedImagePath,
            ]);
        }

        $blog->tags()->sync($tags ?? []);

        return $blog;
    }

    public function update(int $id, array $data): bool
    {
        $blog = $this->find($id);
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $blog_image = $data['image'] ?? null;
        unset($data['image']);
        $selectedImagePath = $data['image_path'] ?? null;
        unset($data['image_path']);

        $updated = $blog->update($data);

        if ($updated) {
            $blog->tags()->sync($tags ?? []);
            if ($blog_image || $selectedImagePath) {
                $previousPath = $blog->image?->path;

                // Delete old image if exists
                if ($blog->image) {
                    $blog->image()->delete();
                }

                if ($blog_image) {
                    $directory = 'uploads/'.now()->format('Y/m/d');
                    $ImagePath = $blog_image->store($directory, 'public');
                    $blog->image()->create([
                        'path' => $ImagePath,
                    ]);

                    if ($previousPath && Str::startsWith($previousPath, 'uploads/')) {
                        Storage::disk('public')->delete($previousPath);
                    }
                } elseif ($selectedImagePath) {
                    $blog->image()->create([
                        'path' => $selectedImagePath,
                    ]);
                }
            }
        }

        return $blog ? $updated : false;
    }

    public function delete(int $id): bool
    {
        $blog = $this->find($id);

        return $blog ? $blog->delete() : false;
    }

    public function getPopularBlogs($limit = 5)
    {
        return Blog::withCount('reviews')
            ->orderByDesc('views_count')
            ->orderByDesc('reviews_count')
            ->take($limit)
            ->get(['id', 'title', 'slug', 'views_count', 'reviews_count', 'published_at']);
    }
}

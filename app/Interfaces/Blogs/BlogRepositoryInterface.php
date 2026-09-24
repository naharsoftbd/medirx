<?php

namespace App\Interfaces\Blogs;

use App\Models\Blogs\Blog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BlogRepositoryInterface
{
    public function all($filters): LengthAwarePaginator;

    public function find(int $id): ?Blog;

    public function create(array $data): Blog;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function getPopularBlogs($limit = 5);
}

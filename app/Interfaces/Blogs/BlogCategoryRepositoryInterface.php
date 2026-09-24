<?php

namespace App\Interfaces\Blogs;

use App\Models\Category;

interface BlogCategoryRepositoryInterface
{
    public function all($filters);

    public function find(int $id): ?Category;

    public function create(array $data): Category;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}

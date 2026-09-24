<?php

namespace App\Interfaces\Blogs;

use App\Models\Blogs\Tag;

interface TagRepositoryInterface
{
    public function all($filters);

    public function find(int $id): ?Tag;

    public function create(array $data): Tag;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}

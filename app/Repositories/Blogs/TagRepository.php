<?php

namespace App\Repositories\Blogs;

use App\Interfaces\Blogs\TagRepositoryInterface;
use App\Models\Blogs\Tag;
use App\Models\Setting;

class TagRepository implements TagRepositoryInterface
{
    public function all($filters)
    {
        $recordsPerPage = Setting::getValue('records_per_page', 10);

        $perPage = $filters['per_page'] ?? $recordsPerPage;

        $query = Tag::query();

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(int $id): ?Tag
    {
        return Tag::find($id);
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $category = $this->find($id);

        return $category ? $category->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $category = $this->find($id);

        return $category ? $category->delete() : false;
    }
}

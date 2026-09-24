<?php

namespace App\Repositories\Blogs;

use App\Interfaces\Blogs\BlogCategoryRepositoryInterface;
use App\Models\Category;
use App\Models\Setting;

class BlogCategoryRepository implements BlogCategoryRepositoryInterface
{
    public function all($filters)
    {
        $recordsPerPage = Setting::getValue('records_per_page', 10);

        $perPage = $filters['per_page'] ?? $recordsPerPage;

        $query = Category::query();

        if (! empty($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
            $query->where('description', 'like', '%'.$filters['search'].'%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(int $id): ?Category
    {
        return Category::find($id);
    }

    public function create(array $data): Category
    {
        return Category::create($data);
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

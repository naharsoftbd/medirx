<?php

namespace App\Services\EmailTemplate;

use App\Interfaces\EmailTemplate\EmailTemplateRepositoryInterface;
use App\Models\EmailTemplate;
use Illuminate\Support\Collection;

class EmailTemplateService
{
    public function __construct(
        protected EmailTemplateRepositoryInterface $repository
    ) {}

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function getBySlug(string $slug): ?EmailTemplate
    {
        return $this->repository->findBySlug($slug);
    }

    public function store(array $data): EmailTemplate
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}

<?php

namespace App\Interfaces\EmailTemplate;

use App\Models\EmailTemplate;
use Illuminate\Support\Collection;

interface EmailTemplateRepositoryInterface
{
    public function all(): Collection;

    public function findById(int $id): ?EmailTemplate;

    public function findBySlug(string $slug): ?EmailTemplate;

    public function create(array $data): EmailTemplate;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}

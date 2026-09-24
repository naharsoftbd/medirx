<?php

namespace App\Repositories\EmailTemplate;

use App\Interfaces\EmailTemplate\EmailTemplateRepositoryInterface;
use App\Models\EmailTemplate;
use Illuminate\Support\Collection;

class EmailTemplateRepository implements EmailTemplateRepositoryInterface
{
    public function all(): Collection
    {
        return EmailTemplate::all();
    }

    public function findById(int $id): ?EmailTemplate
    {
        return EmailTemplate::find($id);
    }

    public function findBySlug(string $slug): ?EmailTemplate
    {
        return EmailTemplate::where('slug', $slug)->first();
    }

    public function create(array $data): EmailTemplate
    {
        return EmailTemplate::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $template = $this->findById($id);

        return $template ? $template->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $template = $this->findById($id);

        return $template ? $template->delete() : false;
    }
}

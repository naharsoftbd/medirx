<?php

namespace App\Repositories\FAQ;

use App\Interfaces\FAQ\FAQInterface;
use App\Models\Faq;
use Illuminate\Support\Collection;

class FAQRepository implements FAQInterface
{
    protected Faq $model;

    public function __construct(Faq $faq)
    {
        $this->model = $faq;
    }

    public function all(): Collection
    {
        return $this->model->latest()->get();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $faq = $this->find($id);
        $faq->update($data);

        return $faq;
    }

    public function delete(int $id)
    {
        $faq = $this->find($id);

        return $faq->delete();
    }
}

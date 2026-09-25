<?php

namespace App\Services\Settings;

use App\Interfaces\FAQ\FAQInterface;
use Illuminate\Support\Collection;

class FaqService
{
    protected $faqRepo;

    /**
     * Create a new class instance.
     */
    public function __construct(FAQInterface $faqRepo)
    {
        $this->faqRepo = $faqRepo;
    }

    public function all(): Collection
    {
        return $this->faqRepo->all();
    }

    public function find(int $id)
    {
        return $this->faqRepo->find($id);
    }

    public function create(array $data)
    {
        return $this->faqRepo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->faqRepo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->faqRepo->delete($id);
    }
}

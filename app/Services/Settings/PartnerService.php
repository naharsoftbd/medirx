<?php

namespace App\Services\Settings;

use App\Interfaces\Partner\PartnerInterface;
use Illuminate\Support\Collection;

class PartnerService
{
    protected $partnerRepo;

    /**
     * Create a new class instance.
     */
    public function __construct(PartnerInterface $partnerRepo)
    {
        $this->partnerRepo = $partnerRepo;
    }

    public function all(): Collection
    {
        return $this->partnerRepo->all();
    }

    public function find(int $id)
    {
        return $this->partnerRepo->find($id);
    }

    public function create(array $data)
    {
        return $this->partnerRepo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->partnerRepo->update($id, $data);
    }

    public function delete(int $id)
    {
        return $this->partnerRepo->delete($id);
    }
}

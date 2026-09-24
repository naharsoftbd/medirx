<?php

namespace App\Repositories\Partner;

use App\Interfaces\Partner\PartnerInterface;
use App\Models\Partner;
use Illuminate\Support\Collection;

class PartnerRepository implements PartnerInterface
{
    protected Partner $model;

    public function __construct(Partner $partner)
    {
        $this->model = $partner;
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
        $partner = $this->find($id);
        $partner->update($data);

        return $partner;
    }

    public function delete(int $id)
    {
        $partner = $this->find($id);

        return $partner->delete();
    }
}

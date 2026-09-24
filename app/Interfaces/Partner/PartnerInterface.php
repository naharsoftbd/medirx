<?php

namespace App\Interfaces\Partner;

use Illuminate\Support\Collection;

interface PartnerInterface
{
    public function all(): Collection;

    public function find(int $id);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}

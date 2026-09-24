<?php

namespace App\Interfaces\Auth;

use Spatie\Permission\Models\Role;

interface RoleRepositoryInterface
{
    public function all($search, $perPage);

    public function create(array $data): ?Role;

    public function update(array $data, int $id): int;

    public function delete(int $id): bool;

    public function find(int $id): ?Role;
}

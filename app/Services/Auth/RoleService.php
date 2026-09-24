<?php

namespace App\Services\Auth;

use App\Interfaces\Auth\RoleRepositoryInterface;
use Spatie\Permission\Models\Role;

class RoleService
{
    protected $roleRepository;

    /**
     * Create a new class instance.
     */
    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function all($search, $perPage)
    {
        return $this->roleRepository->all($search, $perPage);
    }

    public function create(array $data): ?Role
    {
        return $this->roleRepository->create($data);
    }

    public function update(array $data, int $id): int
    {
        return $this->roleRepository->update($data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->roleRepository->delete($id);
    }

    public function find(int $id): ?Role
    {
        return $this->roleRepository->find($id);
    }
}

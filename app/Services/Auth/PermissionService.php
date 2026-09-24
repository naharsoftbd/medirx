<?php

namespace App\Services\Auth;

use App\Interfaces\Auth\PermissionRepositoryInterface;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    protected $permissionRepository;

    /**
     * Create a new class instance.
     */
    public function __construct(PermissionRepositoryInterface $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    public function create(array $data): ?Permission
    {
        return $this->permissionRepository->create($data);
    }

    public function update(array $data, int $id): int
    {
        return $this->permissionRepository->update($data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->permissionRepository->delete($id);
    }

    public function all($search, $perPage)
    {
        return $this->permissionRepository->all($search, $perPage);
    }

    public function find(int $id): ?Permission
    {
        return $this->permissionRepository->find($id);
    }
}

<?php

namespace App\Interfaces;

interface MenuRepositoryInterface
{
    public function getAllParentMenus();

    public function getAllRoles();

    public function create(array $data);

    public function find($id);

    public function update($id, array $data);

    public function delete($id);

    public function updateOrder(array $menus);
}

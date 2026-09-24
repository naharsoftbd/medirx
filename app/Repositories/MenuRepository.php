<?php

namespace App\Repositories;

use App\Interfaces\MenuRepositoryInterface;
use App\Models\Menu;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class MenuRepository implements MenuRepositoryInterface
{
    public function getAllParentMenus()
    {
        return Menu::whereNull('parent_id')->orderBy('order_by', 'ASC')->get();
    }

    public function getAllRoles()
    {
        return Role::all();
    }

    public function create(array $data)
    {
        return Menu::create($data);
    }

    public function find($id)
    {
        return Menu::findOrFail($id);
    }

    public function update($id, array $data)
    {
        $menu = $this->find($id);
        $menu->update($data);

        return $menu;
    }

    public function delete($id)
    {
        return Menu::findOrFail($id)->delete();
    }

    public function updateOrder(array $menus)
    {
        DB::transaction(function () use ($menus) {
            $this->saveMenuOrder($menus);
        });
    }

    private function saveMenuOrder($menus, $parentId = null)
    {
        foreach ($menus as $index => $menu) {
            Menu::where('id', $menu['id'])->update(['order_by' => $index]);

            if (isset($menu['submenu']) && ! empty($menu['submenu'])) {
                $this->saveMenuOrder($menu['submenu'], $menu['id']);
            }
        }
    }
}

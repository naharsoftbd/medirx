<?php

namespace App\Interfaces\Install;

interface InstallRepositoryInterface
{
    public function systemCheck();

    public function install(array $data);

    public function createAdmin(array $data);
}

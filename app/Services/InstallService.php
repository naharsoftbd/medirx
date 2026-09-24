<?php

namespace App\Services;

use App\Interfaces\Install\InstallRepositoryInterface;

class InstallService
{
    protected $installrepo;

    /**
     * Create a new class instance.
     */
    public function __construct(InstallRepositoryInterface $installrepo)
    {
        $this->installrepo = $installrepo;
    }

    public function systemCheck()
    {
        return $this->installrepo->systemCheck();
    }

    public function install(array $data)
    {
        return $this->installrepo->install($data);
    }

    public function createAdmin(array $data)
    {
        return $this->installrepo->createAdmin($data);
    }
}

<?php

namespace App\Interfaces;

interface DashboardRepositoryInterface
{
    public function getToken();

    // Eprescription
    public function ePrescriptionDashboardInfo();
}

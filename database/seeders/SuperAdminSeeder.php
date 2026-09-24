<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::updateOrCreate(
            ['email' => 'jafar@nsbd.net'],
            [
                'id'                => 1,
                'uuid'              => (string) Str::uuid(),
                'name'              => 'Abu Jafar',
                'first_name'        => 'Abu',
                'last_name'         => 'Jafar',
                'email'             => 'jafar@nsbd.net',
                'password'          => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );

        $superAdmin->assignRole('Admin');
    }
}

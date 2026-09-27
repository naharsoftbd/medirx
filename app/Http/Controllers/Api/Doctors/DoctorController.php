<?php

namespace App\Http\Controllers\Api\Doctors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\DoctorResource;
use App\Http\Requests\Doctor\CreateDoctorRequest;
use App\Http\Requests\Doctor\UpdateDoctorRequest;
use App\Services\Doctors\DoctorService;
use App\Services\ApiResponseService;

class DoctorController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService
    ) {
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDoctorRequest $request)
    {
        $data = $request->validated();

        $doctor = $this->doctorService->create($data);

        $doctorData = new DoctorResource($doctor);

        return ApiResponseService::success($doctorData, 'Login successful!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDoctorRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

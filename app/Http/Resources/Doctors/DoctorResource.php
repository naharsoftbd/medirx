<?php

namespace App\Http\Resources\Doctors;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'uuid'              => $this->uuid,
            'name'              => $this->name,
            'FirstName'         => $this->first_name,
            'LastName'          => $this->last_name,
            'email'             => $this->email,
            'status'            => $this->status,
            'mobile'            => $this->mobile,
            'isActive'          => $this->isActive,
            'isInactive'        => $this->isInactive,
            'registration_no'   => $this->registration_no,
            'gender'            => $this->gender,
            'dob'               => $this->dob,
            'specialization'    => $this->specialization,
            'working_institute' => $this->working_institute,
            'designation'       => $this->designation,
            'qualification'     => $this->qualification,
            'experience_years'  => $this->experience_years,
            'bio'               => $this->bio,
            'social'            => $this->social,
            'featured'          => $this->featured,
            'educations'          => $this->educations,
            'experiences'          => $this->experiences,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
            'profile_image'     => $this->profileImage ? $this->profileImage->path : null,
        ];
    }
}

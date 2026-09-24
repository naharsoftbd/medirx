<?php

namespace App\Interfaces\Testimonial;

use App\Models\Testimonial;

interface TestimonialRepositoryInterface
{
    public function all();

    public function find($id): ?Testimonial;

    public function create(array $data): Testimonial;

    public function update(Testimonial $testimonial, array $data): bool;

    public function delete(Testimonial $testimonial): bool;
}

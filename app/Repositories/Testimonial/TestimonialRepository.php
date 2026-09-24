<?php

namespace App\Repositories\Testimonial;

use App\Interfaces\Testimonial\TestimonialRepositoryInterface;
use App\Models\Testimonial;

class TestimonialRepository implements TestimonialRepositoryInterface
{
    public function all()
    {
        return Testimonial::latest()->paginate(10);
    }

    public function find($id): ?Testimonial
    {
        return Testimonial::find($id);
    }

    public function create(array $data): Testimonial
    {
        return Testimonial::create($data);
    }

    public function update(Testimonial $testimonial, array $data): bool
    {
        return $testimonial->update($data);
    }

    public function delete(Testimonial $testimonial): bool
    {
        return $testimonial->delete();
    }
}

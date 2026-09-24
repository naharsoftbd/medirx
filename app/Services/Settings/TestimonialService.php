<?php

namespace App\Services\Settings;

use App\Interfaces\Testimonial\TestimonialRepositoryInterface;
use App\Models\Testimonial;

class TestimonialService
{
    protected $testimonialRepo;

    /**
     * Create a new class instance.
     */
    public function __construct(TestimonialRepositoryInterface $testimonialRepo)
    {
        return $this->testimonialRepo = $testimonialRepo;
    }

    public function all()
    {
        return $this->testimonialRepo->all();
    }

    public function find($id): ?Testimonial
    {
        return $this->testimonialRepo->find($id);
    }

    public function create(array $data): Testimonial
    {
        return $this->testimonialRepo->create($data);
    }

    public function update(Testimonial $testimonial, array $data): bool
    {
        return $this->testimonialRepo->update($testimonial, $data);
    }

    public function delete(Testimonial $testimonial): bool
    {
        return $this->testimonialRepo->delete($testimonial);
    }
}

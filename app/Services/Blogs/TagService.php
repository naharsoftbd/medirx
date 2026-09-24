<?php

namespace App\Services\Blogs;

use App\Interfaces\Blogs\TagRepositoryInterface;

class TagService
{
    protected $repository;

    public function __construct(TagRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function list($filters)
    {
        return $this->repository->all($filters);
    }

    public function find($id)
    {
        return $this->repository->find($id);
    }

    public function store(array $data)
    {
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}

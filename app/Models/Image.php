<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['path'];

    protected $appends = ['image_url'];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getImageUrlAttribute()
    {
        return $this->path ? asset('storage/'.$this->path) : null;
    }
}

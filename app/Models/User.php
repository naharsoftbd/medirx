<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens;

    use HasFactory;
    use HasRoles;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'status',
        'google_id',
    ];

    protected $guard_name = 'web';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $appends = ['profile_image_url', 'avatar'];

    // ✅ Tell Laravel to use uuid instead of id for route binding
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });

        /**
         * Automatically set the `name` when first_name or last_name changes
         */
        static::saving(function ($user) {
            if ($user->first_name || $user->last_name) {
                $user->name = trim($user->first_name.' '.$user->last_name);
            }
        });
    }

    public function profileImage()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function getProfileImageUrlAttribute()
    {
        return $this->profileImage
            ? asset('storage/'.$this->profileImage->path)
            : null;
    }

    public function getAvatarAttribute()
    {
        return $this->profile_image_url;
    }
}

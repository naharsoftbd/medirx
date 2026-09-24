<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['meta_key', 'meta_value'];

    public static function getValue($key, $default = null)
    {
        return static::where('meta_key', $key)->value('meta_value') ?? $default;
    }

    public static function setValue($key, $value)
    {
        return static::updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );
    }

    // ✅ Add your currency formatter here
    public static function formatCurrency($amount)
    {
        $currency = self::getValue('currency', 'USD');
        $symbol = self::getValue('currency_symbol', '$');
        $format = self::getValue('currency_format', 'text_symbol');

        return match ($format) {
            'text_symbol' => "{$currency} ({$symbol}{$amount})",
            'text_only'   => "{$currency} {$amount}",
            'symbol_only' => "{$symbol}{$amount}",
            default       => "{$symbol}{$amount}",
        };
    }

    public static function logoUrl(): string
    {
        $path = self::getValue('logo_path');

        return $path ? asset('storage/'.$path) : asset('default/logo.png');
    }

    public static function faviconUrl(): string
    {
        $path = self::getValue('favicon_path');

        return $path ? asset('storage/'.$path) : asset('default/favicon.ico');
    }

    public static function seo($key, $default = null)
    {
        return self::getValue($key, $default);
    }

    public function getMetaValueAttribute($value)
    {
        if (is_string($value)) {
            $lower = strtolower($value);

            if (in_array($lower, ['1', 'true', 'yes', 'on'], true)) {
                return true;
            }

            if (in_array($lower, ['0', 'false', 'no', 'off'], true)) {
                return false;
            }
        }

        return $value;
    }
}

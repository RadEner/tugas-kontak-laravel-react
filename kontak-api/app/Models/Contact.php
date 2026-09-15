<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'kontak';
    protected $fillable = ['nama', 'alamat', 'tanggal_lahir'];

    public function phones()
    {
        return $this->hasMany(ContactPhone::class, 'kontak_id');
    }
}
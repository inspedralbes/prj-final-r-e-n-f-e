<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    protected $table = 'aules';

    protected $fillable = [
        'nom',
    ];

    public function horaris()
    {
        return $this->hasMany(Horari::class, 'id_aula');
    }

    public function sensors()
    {
        return $this->hasMany(Sensor::class, 'id_aula');
    }
}

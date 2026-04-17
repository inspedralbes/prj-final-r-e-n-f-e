<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $table = 'sensors';

    protected $fillable = [
        'mac',
        'id_aula',
    ];

    public function aula()
    {
        return $this->belongsTo(Aula::class, 'id_aula');
    }
}

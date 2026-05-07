<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Justificant extends Model
{
    use HasFactory;

    protected $table = 'justificants';

    protected $fillable = [
        'id_alum',
        'data_inici',
        'data_fi',
        'comentari',
        'document',
        'estat',
    ];

    public function alumne()
    {
        return $this->belongsTo(Usuari::class, 'id_alum');
    }

}

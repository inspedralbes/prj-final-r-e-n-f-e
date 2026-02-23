<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horari extends Model
{
    use HasFactory;

    protected $table = 'horaris';

    protected $fillable = [
        'codi_hora',
        'id_assig',
        'id_classe',
        'id_aula',
    ];

    public function assignatura()
    {
        return $this->belongsTo(Assignatura::class, 'id_assig');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe');
    }

    public function aula()
    {
        return $this->belongsTo(Aula::class, 'id_aula');
    }
}

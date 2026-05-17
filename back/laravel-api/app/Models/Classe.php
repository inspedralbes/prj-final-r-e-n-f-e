<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'id_curs',
        'nom',
        'id_tutor',
    ];

    public function curs()
    {
        return $this->belongsTo(Curs::class, 'id_curs');
    }

    public function tutor()
    {
        return $this->belongsTo(Usuari::class, 'id_tutor');
    }

    public function horaris()
    {
        return $this->hasMany(Horari::class, 'id_classe');
    }

    public function assignaturesProjecte()
    {
        return $this->hasMany(Assignatura::class, 'id_classe_projecte');
    }

    public function aula()
    {
        return $this->belongsTo(Aula::class, 'id_aula');
    }
}

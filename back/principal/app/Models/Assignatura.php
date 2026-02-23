<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignatura extends Model
{
    use HasFactory;

    protected $table = 'assignatures';

    protected $fillable = [
        'nom',
        'id_classe_projecte',
        'interval',
        'exempcio',
    ];

    public function imparteix()
    {
        return $this->hasMany(Imparteix::class, 'id_assignatura');
    }

    public function inscrits()
    {
        return $this->hasMany(Inscrit::class, 'id_assignatura');
    }

    public function horaris()
    {
        return $this->hasMany(Horari::class, 'id_assig');
    }

    public function justificantsInici()
    {
        return $this->hasMany(Justificant::class, 'id_ass_ini');
    }

    public function justificantsFi()
    {
        return $this->hasMany(Justificant::class, 'id_ass_fi');
    }

    public function classeProjecte()
    {
        return $this->belongsTo(Classe::class, 'id_classe_projecte');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curs extends Model
{
    use HasFactory;

    protected $table = 'cursos';

    protected $fillable = [
        'tipus',
        'nom',
        'id_tutor',
        'id_periode',
    ];

    public function tutor()
    {
        return $this->belongsTo(Usuari::class, 'id_tutor');
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class, 'id_periode');
    }

    public function classes()
    {
        return $this->hasMany(Classe::class, 'id_curs');
    }

    public function alumnes()
    {
        return $this->hasMany(User::class, 'id_curs');
    }
}

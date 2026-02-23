<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscrit extends Model
{
    use HasFactory;

    protected $table = 'inscrits';

    protected $fillable = [
        'id_alumne',
        'id_assignatura',
    ];

    public function alumne()
    {
        return $this->belongsTo(Usuari::class, 'id_alumne');
    }

    public function assignatura()
    {
        return $this->belongsTo(Assignatura::class, 'id_assignatura');
    }

    public function assistencies()
    {
        return $this->hasMany(Assistencia::class, 'id_inscripcio');
    }
}

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
        'id_horari',
    ];

    /**
     * L'alumne vinculat a aquesta inscripció.
     */
    public function alumne()
    {
        return $this->belongsTo(Usuari::class, 'id_alumne');
    }

    /**
     * L'assignatura vinculada.
     */
    public function assignatura()
    {
        return $this->belongsTo(Assignatura::class, 'id_assignatura');
    }

    /**
     * La franja horària específica vinculada ( granularitat de la Tasca 3 ).
     */
    public function horari()
    {
        return $this->belongsTo(Horari::class, 'id_horari');
    }

    /**
     * Llista d'assistències generades per aquesta inscripció.
     */
    public function assistencies()
    {
        return $this->hasMany(Assistencia::class, 'id_inscripcio');
    }
}

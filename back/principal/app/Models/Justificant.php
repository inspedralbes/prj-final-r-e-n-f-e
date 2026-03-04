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
        'id_assistencia_ini',
        'id_assistencia_fi',
        'comentari',
        'document',
        'acceptada',
    ];

    protected $casts = [
        'acceptada' => 'boolean',
    ];

    public function alumne()
    {
        return $this->belongsTo(Usuari::class, 'id_alum');
    }

    public function assistenciaInici()
    {
        return $this->belongsTo(Assistencia::class, 'id_assistencia_ini');
    }

    public function assistenciaFi()
    {
        return $this->belongsTo(Assistencia::class, 'id_assistencia_fi');
    }
}

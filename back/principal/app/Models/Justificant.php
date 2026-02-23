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
        'id_ass_ini',
        'id_ass_fi',
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

    public function assignaturaInici()
    {
        return $this->belongsTo(Assignatura::class, 'id_ass_ini');
    }

    public function assignaturaFi()
    {
        return $this->belongsTo(Assignatura::class, 'id_ass_fi');
    }
}

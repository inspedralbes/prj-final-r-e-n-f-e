<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imparteix extends Model
{
    use HasFactory;

    protected $table = 'imparteix';

    protected $fillable = [
        'id_profe',
        'id_assignatura',
        'titular',
    ];

    protected $casts = [
        'titular' => 'boolean',
    ];

    public function professor()
    {
        return $this->belongsTo(Usuari::class, 'id_profe');
    }

    public function assignatura()
    {
        return $this->belongsTo(Assignatura::class, 'id_assignatura');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assistencia extends Model
{
    use HasFactory;

    protected $table = 'assistencies';

    protected $fillable = [
        'id_inscripcio',
        'data',
        'estat',
        'id_profe',
    ];

    protected $casts = [
        'data' => 'date',
    ];

    public function inscripcio()
    {
        return $this->belongsTo(Inscrit::class, 'id_inscripcio');
    }

    public function professor()
    {
        return $this->belongsTo(Usuari::class, 'id_profe');
    }

    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periodes';

    protected $fillable = [
        'nom',
        'actiu',
        'trimestre_1_ini',
        'trimestre_1_fi',
        'trimestre_2_ini',
        'trimestre_2_fi',
        'trimestre_3_ini',
        'trimestre_3_fi',
    ];

    /**
     * Get the dates as Carbon instances.
     */
    protected $casts = [
        'trimestre_1_ini' => 'date',
        'trimestre_1_fi' => 'date',
        'trimestre_2_ini' => 'date',
        'trimestre_2_fi' => 'date',
        'trimestre_3_ini' => 'date',
        'trimestre_3_fi' => 'date',
    ];

    public function cursos()
    {
        return $this->hasMany(Curs::class, 'id_periode');
    }
}

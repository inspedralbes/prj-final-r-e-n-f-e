<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    use HasFactory;

    protected $table = 'periodes';

    protected $fillable = [
        'trimestre_1',
        'trimestre_2',
        'trimestre_3',
    ];

    /**
     * Get the dates as Carbon instances.
     */
    protected $casts = [
        'trimestre_1' => 'date',
        'trimestre_2' => 'date',
        'trimestre_3' => 'date',
    ];

    public function cursos()
    {
        return $this->hasMany(Curs::class, 'id_periode');
    }
}

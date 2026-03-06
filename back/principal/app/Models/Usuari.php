<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuari extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuaris';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'cognom',
        'email',
        'email_pares',
        'rol',
        'password',
        'token',
        'google_id',
        'nfc_id',
        'id_classe',
        'horari_guardies',
        'photo'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'id_classe');
    }

    public function inscrits()
    {
        return $this->hasMany(Inscrit::class, 'id_alumne');
    }

    public function imparteix()
    {
        return $this->hasMany(Imparteix::class, 'id_profe');
    }

    public function tutorCursos()
    {
        return $this->hasMany(Curs::class, 'id_tutor');
    }

    public function tutorClasses()
    {
        return $this->hasMany(Classe::class, 'id_tutor');
    }

    public function justificants()
    {
        return $this->hasMany(Justificant::class, 'id_alum');
    }
}

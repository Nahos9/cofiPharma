<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PieceJointAv extends Model
{
    protected $fillable = [
        'av_salaire_id',
        'chemin_fichier',
        'nom_fichier',
        'type_mime',
        'taille_fichier',
    ];

    public function avSalaire()
    {
        return $this->belongsTo(AvSalaire::class, 'av_salaire_id');
    }
}

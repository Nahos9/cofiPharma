<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PieceJointe extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id',
        'nom_fichier',
        'chemin_fichier',
        'type_mime',
        'taille_fichier'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}

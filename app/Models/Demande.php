<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'email', 'montant','status','numero_compte','numero_carte','mode_paiement','user_validateur_level','is_deleted','user_who_deleted','phone'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pieceJointes()
    {
        return $this->hasMany(PieceJointe::class);
    }
}

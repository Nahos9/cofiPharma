<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvSalaire extends Model
{
    protected $fillable = ['nom','prenom','email','phone','numero_compte','status','montant'];

    public function pieceJointsAv()
    {
        return $this->hasMany(PieceJointAv::class);
    }
}

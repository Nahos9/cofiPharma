<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $fillable = ['first_name', 'last_name', 'email', 'montant','status','user_validateur'];
}

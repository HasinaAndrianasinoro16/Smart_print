<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'client';
    protected $fillable = ['nom','adresse','nif','email','stat','telephone','rcs'];
    public $timestamps = false;
    use HasFactory;
}

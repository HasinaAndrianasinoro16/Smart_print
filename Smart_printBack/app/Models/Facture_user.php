<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Facture_user extends Model
{
    protected $table = 'facture_user';
    protected $primaryKey = 'id';
    protected $fillable = ['facture', 'userId'];
    public $timestamps = false;

    //relation avec facture
    public function factureRelation()
    {
        return $this->belongsTo(Facture::class, 'facture');
    }

    //fonction pour ajouter un utilisateur qui a creer une facture
    public static function Made_by($facture, $userId)
    {
        try {
            $made_by = new Facture_user();
            $made_by->facture = $facture;
            $made_by->userid = $userId;
            $made_by->save();
            return $made_by;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage());
        }
    }

    use HasFactory;
}

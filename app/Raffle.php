<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Raffle extends Model
{
    protected $dates = ['publish_at'];

    public function results() {
        return $this->hasMany('App\Result');
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = ["prize", "raffle_id", "number", "last_two_number"];
}

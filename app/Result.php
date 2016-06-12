<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Result extends Model
{
    protected $fillable = ["prize", "raffle_id", "number", "last_two_number"];

    // get collection of prizes
    public static function getPrizeCollection() {
        $query = "SELECT DISTINCT prize FROM results ORDER BY prize DESC";
        return DB::select($query);
    }

    public static function getLeastAppear($channelId, $raffleIds) {
        $query = "SELECT r.last_two_number, count(r.last_two_number) AS count
                  FROM Channels c
                  INNER JOIN Raffles raf ON c.id = raf.channel_id
                  INNER JOIN Results r ON raf.id = r.raffle_id
                  WHERE c.id = :channelId AND raf.id IN ($raffleIds)
                  GROUP BY r.last_two_number
                  ORDER BY count";
//        print_r($query);

        return DB::select($query, ["channelId" => $channelId]);
    }
}

<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    public function raffles() {
        return $this->hasMany('App\Raffle');
    }

    public function refreshData() {
        // get rss from link
        $feeds = \Feeds::make($this->rss_link);

        // loop through the data
        foreach($feeds->get_items() as $item) {
            // get publish date from <link>
            $tokens = str_replace('.html', '', $item->get_link());
            $tokens = explode("/", $tokens);
            $publishDate = Carbon::createFromFormat('d-m-Y', $tokens[count($tokens) - 1]);

            // check if the publish date is existed
            $raffle = Raffle::where('publish_at', $publishDate->toDateString())
                                ->where('channel_id', $this->id)->first();

            if (count($raffle) >= 1) continue;

            // insert new raffle
            $raffle = new Raffle();
            $raffle->channel_id = $this->id;
            $raffle->publish_at = $publishDate;
            $raffle->save();

            // we build data array for adding to the result table
            $resultRows = explode("\n", $item->get_description());
            $data = [];
            foreach($resultRows as $row) {
                $resultItem = explode(": ", $row);
                if (count($resultItem) == 3) {
                    // this is the last row, it has mistake on result, 7: 5118: 98, we build two results in this string
                    $data[] = [
                        "prize" => $resultItem[0],
                        "number" => substr($resultItem[1], 0, 3),
                        "last_two_number" => substr($resultItem[1], 1, 2)
                    ];

                    $data[] = [
                        "prize" => substr($resultItem[1], -1),
                        "number" => $resultItem[2],
                        "last_two_number" => $resultItem[2]
                    ];
                } else if (strpos($resultItem[1], "-") === false) {
                    // the - chars was not found in this result, we add it to the data
                    $data[] = [
                        "prize" => $resultItem[0],
                        "number" => $resultItem[1],
                        "last_two_number" => substr($resultItem[1], -2)
                    ];
                } else {
                    // the - chars was founded
                    $numbers = explode(" - ", $resultItem[1]);
                    foreach($numbers as $num) {
                        $data[] = [
                            "prize" => $resultItem[0],
                            "number" => $num,
                            "last_two_number" => substr($num, -2)
                        ];
                    }
                }
            }

            // add to result table
            foreach($data as $d) {
                $d["raffle_id"] = $raffle->id;
                Result::create($d);
            }
        }
    }
}

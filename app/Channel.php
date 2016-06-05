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
                                ->where('channel_id', $this->id)->get();

            if (count($raffle) == 0) {
                // insert new raffle
                $raffle = new Raffle();
                $raffle->channel_id = $this->id;
                $raffle->publish_at = $publishDate;
                $raffle->save();
            }



//            print_r($item->get_title());
//            print_r($item->get_description());
//            print_r($item->get_link());
        }
    }
}

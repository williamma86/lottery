<?php

namespace App\Http\Controllers;

use App\Channel;
use App\Helper\Utils;
use App\Raffle;
use App\Result;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Config;

class HomeController extends Controller
{
    public function index() {
        $channels = Channel::all();

        foreach($channels as $c) {
            $c->refreshData();
        }

        return view('pages.home');
    }

    public function getChannels() {
        $channels = Channel::all();

        $data = [];
        foreach($channels as $c) {
            $data[] = [
                "value" => $c->id,
                "text" => $c->name
            ];
        }
        return response()->json($data);
    }

    /**
     * function for serve the ajax which will get the list of least appear number
     * @param Request $request
     */
    public function doAction(Request $request) {
        $data = [];
        $possibleNumberArray = []; // array hold all number that show on the table

        // get raffle of the channel within the selected times
        $raffles = Raffle::where('channel_id', $request->channelId)->orderBy('publish_at', 'DESC')->paginate($request->withinTimes);

        if (count($raffles) == 0){
            return response()->json($data);
        }

        // get channel Ids
        $raffleIds = [];
        foreach($raffles as $raf) {
            $raffleIds[] = $raf->id;
        }
        $raffleIds = join(", ", $raffleIds);

        // parse result data
        $rows = Result::getLeastAppear($request->channelId, $raffleIds);
        $data[0] = [];
        $data[$rows[0]->count] = [$rows[0]->last_two_number];
        $possibleNumberArray[] = $rows[0]->last_two_number;
        for ($i = 1; $i < count($rows); $i++) {
            $possibleNumberArray[] = $rows[$i]->last_two_number;
            if ($rows[$i]->count == $rows[$i - 1]->count) {
                $data[$rows[$i]->count][] = $rows[$i]->last_two_number;
            } else {
                $data[$rows[$i]->count] = [$rows[$i]->last_two_number];
            }
        }

        // apply the count = 0 numbers
        $data[0] = Utils::getRemainNumbers($possibleNumberArray);

        return response()->json($data);
    }

    /**
     * function for getting the result of selected channel
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getResults(Request $request) {
        $data = [
            "headers" => [],
            "contents" => []
        ];
        $channel = Channel::find($request->channelId);
        $raffles = $channel->raffles()->orderBy('publish_at', 'DESC')->paginate(Config::get('settings.maxDefaultRaffle'))->reverse();

        // generate header
        foreach($raffles as $raf) {
            $data["headers"][] = $raf->publish_at->toDateTimeString();
        }

        // generate content
        $prizes = Result::getPrizeCollection();
        foreach($prizes as $prize) {
            // get number of prize
            $prizeValue = $prize->prize;
            $prizeCount = $channel->raffles()->first()->results()->where('prize', $prizeValue)->count();

            for ($i = 0; $i < $prizeCount; $i++) {
                $contents = [];
                $contents[] = html_entity_decode($prizeValue);

                foreach($raffles as $raf) {
                    $prizeResultRow = $raf->results()->where("prize", $prizeValue)->limit(1)->offset($i)->first();
                    $contents[] = [
                        "number" => $prizeResultRow->number,
                        "last_two_number" => $prizeResultRow->last_two_number
                    ];
                }

                $data["contents"][] = $contents;
            }
        }

        return response()->json($data);
    }
}

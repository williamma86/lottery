<?php

namespace App\Http\Controllers;

use App\Channel;
use Illuminate\Http\Request;

use App\Http\Requests;

class HomeController extends Controller
{
    public function index() {
        $channel = Channel::first();
        $channel->refreshData();

        return view('welcome');
    }
}

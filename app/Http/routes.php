<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', ['as' => 'home', 'uses' => 'HomeController@index']);
Route::get('/home/getChannels', ['as' => 'getChannels', 'uses' => 'HomeController@getChannels']);
Route::post('/home/getResults', ['as' => 'getResults', 'uses' => 'HomeController@getResults']);
Route::post('/home/doAction', ['as' => 'doActionHome', 'uses' => 'HomeController@doAction']);

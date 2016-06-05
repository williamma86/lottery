<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades;
use App\Channel;

class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('channels')->delete();

        $channels = [
            ['name' => 'TP.HCM', 'rss_link' => 'http://xskt.com.vn/rss-feed/tp-hcm-xshcm.rss'],
            ['name' => 'An Giang', 'rss_link' => 'http://xskt.com.vn/rss-feed/an-giang-xsag.rss'],
            ['name' => 'Bình Dương', 'rss_link' => 'http://xskt.com.vn/rss-feed/binh-duong-xsbd.rss'],
            ['name' => 'Bến Tre', 'rss_link' => 'http://xskt.com.vn/rss-feed/ben-tre-xsbt.rss'],
            ['name' => 'Cần Thơ', 'rss_link' => 'http://xskt.com.vn/rss-feed/can-tho-xsct.rss'],
            ['name' => 'Đồng Nai', 'rss_link' => 'http://xskt.com.vn/rss-feed/dong-nai-xsdn.rss'],
            ['name' => 'Đồng Tháp', 'rss_link' => 'http://xskt.com.vn/rss-feed/dong-thap-xsdt.rss'],
            ['name' => 'Kiên Giang', 'rss_link' => 'http://xskt.com.vn/rss-feed/kien-giang-xskg.rss'],
            ['name' => 'Long An', 'rss_link' => 'http://xskt.com.vn/rss-feed/long-an-xsla.rss'],
            ['name' => 'Tiền Giang', 'rss_link' => 'http://xskt.com.vn/rss-feed/tien-giang-xstg.rss'],
            ['name' => 'Vĩnh Long', 'rss_link' => 'http://xskt.com.vn/rss-feed/vinh-long-xsvl.rss']
        ];

        foreach($channels as $c) {
            Channel::create($c);
        }
    }
}

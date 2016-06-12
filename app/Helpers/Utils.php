<?php

namespace App\Helper;

class Utils {

    /**
     * get return number 00 to 99 from the number array
     * @param $numbers
     */
    public static function getRemainNumbers ($numbers) {
        // build 00 to 99 number array
        $allNumbers = [];
        for ($i = 0; $i < 100; $i++) {
            if ($i < 10) {
                $allNumbers[] = "0" . $i . '';
            } else {
                $allNumbers[] = $i . '';
            }
        }

        return array_diff($allNumbers, $numbers);
    }

}
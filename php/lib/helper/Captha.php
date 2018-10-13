<?php

class Captha
{
    /**
     * @method get result captcha
     * @param $SecretKey - server-side key for google reCAPTCHA
     * @return mixed
     */
    public function getCaptcha($SecretKey)
    {
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . DefaultSettings::SECRET_KEY . "=&response={$SecretKey}");
        return json_decode($response);
    }

}
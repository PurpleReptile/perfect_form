<?php

namespace Helper;

class InputData
{
    private $settings;

    public function __construct()
    {

    }

    // get email settings
    public function getEmailTo() { return $this->settings["email"]["to"]; }
    public function getEmailSubject() { return $this->settings["email"]["subject"]; }
    public function getEmailOwner() { return $this->settings["email"]["owner"]; }

    // get smtp settings
    public function getSMTPUsername() { return $this->settings["smtp"]["username"]; }
    public function getSMTPPassword() { return $this->settings["smtp"]["password"]; }

    // get files settings
    public function getFileExtensions() { return $this->settings["files"]["extensions"]; }
    public function getFileMaxSize() { return $this->settings["files"]["max_size"]; }

    // get for settings
    public function getListRequiredFields($nameForm)
    {
        return $this->settings["form"][$nameForm]["required"];
    }

    /**
     * @method bool - get settings for sending message
     * @return bool
     */
    public function getSettingsForSubmit()
    {
        $dir = "../settings/";
        $fileSettings = "";

        if (file_exists($dir)) {
            $fileSettings .= $dir . "sendForm.json";

            if (file_exists($fileSettings)) {
                $settings = file_get_contents($fileSettings);

                if (! empty($settings)) {
                    $this->settings = json_decode($settings, true);
                    return true;

                } else {
                    $this->createFileSettings($dir);
                    return $this->getSettingsForSubmit();
                }

            } else {
                $this->createFileSettings($dir);
                return $this->getSettingsForSubmit();
            }
        } else {
            mkdir($dir, 0777, true);
            $this->createFileSettings($dir);
            return $this->getSettingsForSubmit();
        }
    }

    /**
     * @method void - creating file with settings
     * @param string $rootPath - root directory for the file
     */
    private function createFileSettings($rootPath)
    {
        $path = $rootPath . "sendForm.json";
        $file = fopen($path, "w");
        fwrite($file, "{");
        fwrite($file, DefaultSettings::$email . ",");
        fwrite($file, DefaultSettings::$smtp . ",");
        fwrite($file, DefaultSettings::$files . ",");
        fwrite($file, DefaultSettings::$form);
        fwrite($file, "}");
        fclose($file);
    }

}
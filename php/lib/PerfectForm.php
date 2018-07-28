<?php

class PerfectForm
{
    private $nameForm;
    private $tplForm;
    private $dataForm;
    private $settingsMail;

    public function __construct()
    {
        $argv = func_get_args();
        switch( func_num_args() ) {
            case 1:
                self::__construct1($argv[0]);
                break;
            case 2:
                self::__construct2($argv[0], $argv[1]);
                break;
        }
        $this->getSettings();
    }

    function __construct1($nameForm)
    {
        $this->nameForm = $nameForm;
    }

    function __construct2($nameForm, $dataForm)
    {
        $this->nameForm = $nameForm;
        $this->dataForm = $dataForm;
    }

    public function getTplForm()
    {
        return $this->tplForm;
    }

    // include form to the project
    public function includeForm()
    {
        $filename = "../tmp/" . $this->nameForm . ".html";
        if (file_exists($filename))
        {
            $this->tplForm = file_get_contents($filename);
            return true;
        }
        return false;
    }

    public function sendMsg()
    {

//  valid data
        $message = '
            <html>
            <head>
              <title>Birthday Reminders for August</title>
            </head>
            <body>
              <p>Here are the birthdays upcoming in August!</p>
              <table>
                <tr>
                  <th>Person</th><th>Day</th><th>Month</th><th>Year</th>
                </tr>
                <tr>
                  <td>Johny</td><td>10th</td><td>August</td><td>1970</td>
                </tr>
                <tr>
                  <td>Sally</td><td>17th</td><td>August</td><td>1973</td>
                </tr>
              </table>
            </body>
            </html>';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

        mail($this->settingsMail["email"]["to"],
            $this->settingsMail["email"]["subject"],
            $message,
            $headers);

        $this->addFileReport($message);
        return true;
    }

    function getSettings()
    {
        $dir = "../settings/";
        $fileSettings = "";

        if (file_exists($dir))
        {
            $fileSettings .= $dir . "sendForm.json";

            if (file_exists($fileSettings))
            {
                $settings = file_get_contents($fileSettings);

                if (!empty($settings))
                    $this->settingsMail = json_decode($settings, true);
                else
                {
                    $this->settingsMail = $this->writeDefaultSettingsInFile();
                }
            }
            else
                $this->createFileSettings($dir);
        }
        else
        {
            mkdir($dir, 0777, true);
            $this->createFileSettings($dir);
        }
    }

    // создание файла с настройками отправки письма
    function createFileSettings($rootPath)
    {
        $path = $rootPath . "sendForm.json";
        $file = fopen($path, "w");
        fwrite($file, $this->writeDefaultSettingsInFile());
        fclose($file);
    }

    function addFileReport($message)
    {
        $dir = "/report_mail/";
        $currTime = date("dd.m.Y-H:i") . ".txt";
        $filename = $dir . $currTime;

        if (!file_exists($dir))
            mkdir($dir, 0777, true);

        $this->createFileReport($filename, $message);
    }

    // создание файла с содержимым письма
    function createFileReport($filename, $message)
    {
        $file = fopen($filename, "w");
        fwrite($file, $message);
        fclose($file);
    }

    function writeDefaultSettingsInFile()
    {
        $settings = '{"email":
            {
                "to": "ig.evg.po@gmail.com",
                "subject": "the subject"
            }
        }';
        return $settings;
    }

    function dataValidation($jsonData) {
        return json_decode($jsonData);
    }

    function validInpEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
}
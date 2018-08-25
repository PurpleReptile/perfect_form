<?php

require_once 'DefaultSettings.php';
require_once 'TemplateMail.php';

use Templates\Mail\TemplateMail;

class PerfectForm
{
    private $nameForm;          /** @var string - название формы */
    private $tplForm;           /** @var string - шаблон формы (front-end) */
    private $tplMessage;        /** @var string - шаблон письма */
    private $dataForm;          /** @var array - данные формы */
    private $message;           /** @var array - сообщение письма*/
    private $settingsMail;      /** @var array - настройки письма */
    private $email;             /** @var string - e-mail */
    private $errors;            /** @var array - список ошибок */

    public function __construct()
    {
        $argv = func_get_args();
        switch (func_num_args()) {
            case 1:
                self::__construct1($argv[0]);
                break;
            case 2:
                self::__construct2($argv[0], $argv[1]);
                break;
        }

    }

    function __construct1($nameForm)
    {
        $this->nameForm = $nameForm;
        $this->message = [];
    }

    function __construct2($nameForm, $dataForm)
    {
        $this->nameForm = $nameForm;
        $this->dataForm = $dataForm;
        $this->message = [];
    }

    /**
     * @method - получение шаблона формы
     * @return mixed
     */
    public function getTplForm()
    {
        return $this->tplForm;
    }

    /**
     * @method string - получение шаблона письма
     */
    public function getTplMessage()
    {
        return $this->tplMessage;
    }


    /**
     * @method bool - подключение формы в проект
     * @return bool
     */
    public function includeForm()
    {
        $filename = "../tmp/" . $this->nameForm . ".html";
        if (file_exists($filename)) {
            $this->tplForm = file_get_contents($filename);
            return true;
        }
        return false;
    }

    /**
     * @method bool - отправка письма
     * @return bool
     */
    public function sendMsg()
    {
        $this->dataValidation();
        $this->settingsMail = $this->getSettingsForSubmit();

        $TemplateMail = new TemplateMail($this->message);
        $TemplateMail->prepareTemplate();
        $this->tplMessage = $TemplateMail->getTemplate();

        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        $emailTo = (!empty($this->email)) ? $this->email : $this->settingsMail["email"]["to"];

//        mail($emailTo,
//            $this->settingsMail["email"]["subject"],
//            $msg,
//            $headers);

//        $this->addFileReport();
        return true;
    }

    /**
     * @method void - получение настройки для отправки письма
     */
    private function getSettingsForSubmit()
    {
        $dir = "../settings/";
        $fileSettings = "";

        if (file_exists($dir)) {
            $fileSettings .= $dir . "sendForm.json";

            if (file_exists($fileSettings)) {
                $settings = file_get_contents($fileSettings);

                if (!empty($settings))
                    return json_decode($settings, true);
                else {
                    $this->createFileSettings($dir);
                    return json_decode(DefaultSettings::$email, true);
                }
            } else
                $this->createFileSettings($dir);
        } else {
            mkdir($dir, 0777, true);
            $this->createFileSettings($dir);
        }
        return false;
    }

    /**
     * @method void - создание файла с настройками отправки письма
     * @param string $rootPath - корневая директория для файла
     */
    private function createFileSettings($rootPath)
    {
        $path = $rootPath . "sendForm.json";
        $file = fopen($path, "w");
        fwrite($file, DefaultSettings::$email);
        fclose($file);
    }

    /**
     * @method void - добавление файла с содержимым письма в проект
     */
    private function addFileReport()
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . "/report_mail/";
        $filename = date("d.m.Y-H.i") . ".txt";

        if (!file_exists($dir))
            mkdir($dir, 0777, true);


        $file = fopen($dir . $filename, "w");
        if ($file) {
            foreach ($this->message as $key => $value) {
                fwrite($file, $value["text"] . "\n");
            }

            fclose($file);
        }
    }

    // TODO доделать валидацию элементов и добавление их в письмо
    // TODO исправить баг с добавлением одинаковых полей даты
    private function dataValidation()
    {
        foreach ($this->dataForm as $key => $item) {
            $correctField = false;

            switch ($item['typeField']) {
                case "email":
                    $this->message[$key]["text"] = "E-mail: " . filter_var($item['value'], FILTER_VALIDATE_EMAIL);
                    $this->email = $item['value'];
                    $correctField = true;
                    break;
                case "firstname":
                    if (preg_match("/^\W{2,}$/", $item["value"])) {
                        $this->message[$key]["text"] = "Имя: " . $item["value"];
                        $correctField = true;
                    }
                    else
                        $this->errors["input"]["firstname"] = "Имя пользователя введено некорректно.";
                    break;
                case "lastname":
                    $this->message[$key]["text"] = "Фамилия: " . $item["value"];
                    $correctField = true;
                    break;
                case "fullname":
                    $this->message[$key]["text"] = "ФИО: " . $item["value"];
                    $correctField = true;
                    break;
                case "phone":
                    if (preg_match("/^[\d|\s|\-]*$/", $item["value"])) {
                        $this->message[$key]["text"] = "Телефон: " . $item["value"];
                        $correctField = true;
                    }
                    else
                        $this->errors["input"]["phone"] = "Телефонный номер введён некорректно.";
                    break;
                case "date":
                    $this->message[$key]["text"] =  "Дата: " . $item['value'];
                    $correctField = true;
                    break;
                default:
                    break;
            }
            if ($correctField === true)
                $this->message[$key]["type"] = DefaultSettings::$p;
        }
    }
}
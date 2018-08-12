<?php

require_once 'DefaultSettings.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/tmp/mail/tmpMail.php';

use Template\Message\ModelPF as ModelPF;
use Template\Message\ViewPF as ViewPF;

class PerfectForm
{
    private $nameForm;          /** @var string - название переменной */
    private $tplForm;           /** @var string - шаблон формы (front-end) */
    private $dataForm;          /** @var array - данные формы */
    private $msg;               /** @var array - сообщение письма*/
    private $settingsMail;      /** @var array - настройки письма */
    private $email;             /** @var string - e-mail */

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
    }

    function __construct2($nameForm, $dataForm)
    {
        $this->nameForm = $nameForm;
        $this->dataForm = $dataForm;
        $this->msg = [];
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

        $modelPF = new ModelPF($this->msg);
        $viewPF = new ViewPF($modelPF);
        $msg = $viewPF->output();

        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        $emailTo = (!empty($this->email)) ? $this->email : $this->settingsMail["email"]["to"];

        mail($emailTo,
            $this->settingsMail["email"]["subject"],
            $msg,
            $headers);

        $this->addFileReport();
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
            foreach ($this->msg as $key => $value) {
                fwrite($file, $value["text"] . "\n");
            }

            fclose($file);
        }
    }

    // TODO доделать валидацию элементов и добавление их в письмо
    private function dataValidation()
    {
        $this->msg = [];

        foreach ($this->dataForm as $key => $item) {
            switch ($item['typeFieldPF']) {
                case "email":
                    $this->msg[$key]["text"] = "E-mail: " . filter_var($item['value'], FILTER_VALIDATE_EMAIL);
                    $this->email = $item['value'];
                    break;
                case "firstname":
                    $this->msg[$key]["text"] = "Имя: " . $item['value'];
                    break;
                case "lastname":
                    $this->msg[$key]["text"] = "Фамилия: " . $item['value'];
                    break;
                case "fullname":
                    $this->msg[$key]["text"] = "ФИО: " . $item['value'];
                    break;
                case "phone":
                    $this->msg[$key]["text"] = "Телефон: " . $item['value'];
                    break;
                case "date":
                    $this->msg[$key]["text"] =  "Дата: " . $item['value'];
                    break;
                default:
                    break;
            }
            $this->msg[$key]["type"] = DefaultSettings::$p;
        }
    }

}
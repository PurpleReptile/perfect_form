<?php

require_once 'DefaultSettings.php';
require_once 'TemplateMail.php';

require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

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
     * @method - получение списка ошибок
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
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
        $this->validationAllFields();

        if (isset($this->errors))
            return false;

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

    public function sendMsgFromMailer()
    {
        // Настройки
        $mail = new \PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->Host = "smtp.yandex.ru";
        $mail->SMTPAuth = true;
        $mail->Username = "ig.poyarkoff@yandex.ru"; // Ваш логин в Яндексе. Именно логин, без @yandex.ru
        $mail->Password = "}Br8O107#n4NWs[Ehi&6X<TRv"; // Ваш пароль
        $mail->SMTPSecure = "ssl";
        $mail->Port = 465;
        $mail->setFrom("ig.poyarkoff@yandex.ru"); // Ваш Email
        $mail->addAddress("ig.poyarkoff@yandex.ru"); // Email получателя

        // Письмо
        $mail->isHTML(true);
        $mail->Subject = "Тестовый заголовок"; // Заголовок письма
        $mail->Body = "Тестовое письмо от phpmailer";

        $mail->send();
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

    // TODO исправить баг с добавлением одинаковых полей даты
    /**
     * @method - валидация полей формы
     */
    private function validationAllFields()
    {
        foreach ($this->dataForm as $key => $item) {

            $typeField = $item["typeField"];
            $valueField = $item["value"];

            if (array_key_exists($typeField, DefaultSettings::VALIDATION))
                $this->validationField(
                    $valueField,
                    DefaultSettings::VALIDATION[$typeField]["regexp"],
                    $typeField,
                    DefaultSettings::VALIDATION[$typeField]["label"]
                );
        }
    }

    /**
     * @method - валидация поля формы
     * @param string $valueInp - значение поля
     * @param string $regExp - регулярное выражение
     * @param string $fieldName - название поля
     * @param string $lblMsg - текст для отображения письма
     */
    private function validationField($valueInp, $regExp, $fieldName, $lblMsg)
    {
        if (preg_match($regExp, $this->testInput($valueInp))) {
            $this->message[$fieldName]["text"] = $lblMsg . ": " . $valueInp;
            $this->message[$fieldName]["type"] = DefaultSettings::STYLE_P;
        } else {
            $this->errors["input"][$fieldName] = "Входные данные для поля \"" . $fieldName . "\" введены некорректно.";
        }
    }

    /**
     * @param $data
     * @return string
     */
    private function testInput($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
}
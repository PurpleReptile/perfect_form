<?php

require_once __DIR__ . '/helper/TemplateMail.php';
require_once __DIR__ . '/helper/DefaultSettings.php';
require_once __DIR__ . '/helper/InputData.php';

require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use Templates\Mail\TemplateMail;
use Helper\InputData;

class PerfectForm
{
    // general info
    private $nameForm;          /** @var string - name form */
    private $errors;            /** @var array - list errors */
    private $ownerInfo;         /** @var array - additional info for owner site */

    // email
    private $email;             /** @var string - e-mail */
    private $msgUser;           /** @var array - text message for user */
    private $msgOwner;          /** @var array - text message for owner */
    private $tplForm;           /** @var string - template form (client-side) */
    private $dataForm;          /** @var array - data from form */

    // files
    private $isUploadFiles;     /** @var bool - check uploading files to the server */
    private $listFiles;         /** @var array - list files for uploading files to the server */
    private $uploadedFiles;     /** @var array - list uploaded files to the server */
    private $numberOfFiles;     /** @var integer - number of files */

    // instances of a classes
    private $InpData;

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


        $this->InpData = new InputData();
        $this->InpData->getSettingsForSubmit();
    }

    private function __construct1($nameForm)
    {
        $this->nameForm = $nameForm;
        $this->msgUser = [];
    }

    private function __construct2($dataForm, $ownerInfo)
    {
        $this->dataForm = $dataForm;
        $this->ownerInfo = $ownerInfo;
        $this->nameForm = $ownerInfo->nameForm;

        $this->msgUser = [];
    }

    /**
     * @method - set list files for the work
     * @param $files - list files for additional
     * @param int $numberOfFiles - number of files for additional
     */
    public function setListFiles($files, $numberOfFiles = 1)
    {
        $this->listFiles = $files;
        $this->isUploadFiles = true;
        $this->numberOfFiles = $numberOfFiles;
    }

    /**
     * @method - getting template form
     * @return mixed
     */
    public function getTplForm()
    {
        return $this->tplForm;
    }

    /**
     * @method - getting list errors
     * @return string|array
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @method - getting name form
     * @return string
     */
    public function getNameForm()
    {
        return $this->nameForm;
    }

    /**
     * @method - getting limit files
     * @return integer
     */
    public function getFileLimit()
    {
        return $this->InpData->getFileLimit();
    }

    /**
     * @method - getting extensions file
     * @return array
     */
    public function getFileExtensions()
    {
        return $this->InpData->getFileExtensions();
    }

    /**
     * @method - getting max size file
     * @return integer
     */
    public function getFileMaxSize()
    {
        return $this->InpData->getFileMaxSize();
    }

    /**
     * @method bool - including form to the project
     * @return bool
     */
    public function includeForm()
    {
        $filename = "../templates/" . $this->nameForm . ".html";
        if (file_exists($filename)) {
            $this->tplForm = file_get_contents($filename);
            return true;
        }
        return false;
    }

    /**
     * @method bool - sending message
     * @return bool - result sending message
     */
    public function sendMessage()
    {
        // get settings for sending
        if ($this->InpData->getSettingsForSubmit()) {

            // check valid checked checkbox
            $this->checkCheckbox();
            if (isset($this->errors)) return false;

            // check valid required fields
            $this->checkRequiredFields();
            if (isset($this->errors)) return false;

            // check valid input fields
            $this->msgUser = $this->prepareValidationFields();
            $this->msgOwner = $this->prepareOwnerData();
            if (isset($this->errors)) return false;

            // settings for user
            $userTemplate = new TemplateMail($this->msgUser);
            $userMsg = $userTemplate->getTemplate();
            $userEmail = (! empty($this->email)) ? $this->email : $this->InpData->getEmailTo();

            // settings for owner
            $ownerTemplate = new TemplateMail($this->msgUser, $this->msgOwner);
            $ownerMsg = $ownerTemplate->getTemplate();
            $ownerEmail = $this->InpData->getEmailOwner();
            $emailManagers = $this->InpData->getEmailManagers($this->nameForm);

            // set subject for message
            if (! empty($this->InpData->getFormSubject($this->nameForm))) {
                $subject = $this->InpData->getFormSubject($this->nameForm);
            } else
                $subject = $this->InpData->getEmailSubject();

            // send email to user
            if (! $this->sendPHPMailer($userEmail, $userMsg, $ownerEmail, $subject, "", false))
                return false;

            // send email to owner
            $this->sendPHPMailer($ownerEmail, $ownerMsg, $ownerEmail, $subject, $emailManagers, true);
            return true;
        }

        return false;
    }

    /**
     * @method - sending message with help lib by PHPMailer
     * @param string $emailTo - to email
     * @param string $bodyMsg - body message
     * @param string $senderEmail - sender email
     * @param string $subject - subject mail
     * @param array|string $emailManagers - list email of managers
     * @param bool $isUpload - needed uploading files
     * @return bool
     */
    private function sendPHPMailer($emailTo, $bodyMsg, $senderEmail, $subject, $emailManagers, $isUpload)
    {
        $mail = new \PHPMailer\PHPMailer\PHPMailer();
        $mail->isSMTP();
        $mail->Host = "smtp.yandex.ru";
        $mail->SMTPAuth = true;
        $mail->Username = $this->InpData->getSMTPUsername();
        $mail->Password = $this->InpData->getSMTPPassword();
        $mail->SMTPSecure = "ssl";
        $mail->Port = 465;
        $mail->setFrom($senderEmail);
        $mail->addAddress($emailTo); // Email recipient

        // add email managers
        if (! empty($emailManagers))
            foreach ($emailManagers as $email)
                $mail->addAddress($email);

        // message
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $bodyMsg;
        $mail->CharSet = "UTF-8";
        $mail->Encoding = "base64";

        // attachment files
        if ($this->isUploadFiles && $isUpload) {

            // error with invalid files
            if ($this->checkFilesLimit() === false) return false;

            $this->prepareFilesForUploading();
            if (isset($this->errors)) return false;

            // attachment files to mail
            foreach ($this->uploadedFiles as $attachment)
                $mail->addAttachment($attachment["tmpName"], $attachment["name"]);
        }

        // send mail
        if ($mail->send()) {

            if ($this->isUploadFiles && $isUpload)
                $this->uploadFiles();

            return true;
        }

        return false;
    }

    /**
     * @method - check files for corrected
     * @param string $fname - name file
     * @param $fsize - size file
     * @param $ftmpName - temporary path for file
     */
    private function checkFile($fname, $fsize, $ftmpName)
    {
        $allowedExtensions = $this->InpData->getFileExtensions();
        $maxSize = $this->InpData->getFileMaxSize();
        $fextension = pathinfo($fname, PATHINFO_EXTENSION);

        if (! in_array($fextension, $allowedExtensions)) {
            $error["errors"][] = [
                "type" => "extension",
                "value" => $fextension
            ];
        }

        if ($fsize > $maxSize || $fsize === 0) {
            $error["errors"][] = [
                "type" => "size",
                "value" => $maxSize
            ];
        }

        if (empty($error))
            array_push($this->uploadedFiles, ["name" => $fname, "tmpName" => $ftmpName]);
        else {
            $error["name"] = $fname;
            $this->errors["files"][] = $error;
        }
    }

    /**
     * @method void - upload files to the server
     */
    private function uploadFiles()
    {
        date_default_timezone_set('Europe/Moscow');
        $rootPath = $_SERVER['DOCUMENT_ROOT'] . "/report_mail/";
        $dir = $rootPath . date("d.m.Y-H.i");

        if (! file_exists($dir))
            mkdir($dir, 0755, true);

        foreach ($this->uploadedFiles as $file)
            move_uploaded_file($file["tmpName"], $dir . "/" . $file["name"]);
    }

    /**
     * @method - prepare for validation fields
     */
    private function prepareValidationFields()
    {
        $res = [];

        foreach ($this->dataForm as $key => $value) {
            $nameInpField = $value->nameField;
            $valueField = $value->value;

            if (! empty($valueField)) {

                if (array_key_exists($nameInpField, DefaultSettings::VALIDATION)) {
                    $resValid = $this->validationField(
                        $valueField,
                        DefaultSettings::VALIDATION[$nameInpField]["regexp"],
                        $nameInpField,
                        DefaultSettings::VALIDATION[$nameInpField]["label"]
                    );

                    if (!empty($resValid))
                        $res[] = $resValid;
                }

            }
        }
        return $res;
    }

    /**
     * @method - prepare files for uploading
     */
    public function prepareFilesForUploading()
    {
        $this->uploadedFiles = [];
        foreach ($this->listFiles as $key => $file)
            $this->checkFile($file["name"], $file["size"], $file["tmp_name"]);
    }

    /**
     * @method - check files limit
     * @return bool
     */
    public function checkFilesLimit()
    {
        if ($this->numberOfFiles > $this->InpData->getFileLimit()) {
            $this->errors["limitFiles"] = [
                "value" => $this->numberOfFiles,
                "limit" => $this->InpData->getFileLimit()
            ];
            return false;
        }
        return true;
    }

    /**
     * @method array - prepare owner data for message
     * @return array
     */
    private function prepareOwnerData()
    {
        if (! empty($this->ownerInfo->nameForm)) $ownerInfo[] = "Название формы: " . $this->ownerInfo->nameForm;
        if (! empty($this->ownerInfo->urlPage)) $ownerInfo[] = "URL страницы: " . $this->ownerInfo->urlPage;
        if (! empty($this->ownerInfo->order)) $ownerInfo[] = "Заказ: " . $this->ownerInfo->order;

        return $ownerInfo;
    }

    /**
     * @method - validation field
     * @param string $valueInp - value field
     * @param string $regExp - regexp
     * @param string $nameInpField - vane field
     * @param string $lblMsg - text for message
     * @return array $message - message with data
     */
    private function validationField($valueInp, $regExp, $nameInpField, $lblMsg)
    {
        $message = [];
        $val = $this->testInput($valueInp);

        if (preg_match($regExp, $val)) {
            $message = $lblMsg . ": " . $valueInp;
        } else {
            $error["name"] = $nameInpField;
            $error["text"] = "Входные данные для поля введены некорректно.";

            if (isset(DefaultSettings::VALIDATION[$nameInpField]["example"]))
                $corrExample = DefaultSettings::VALIDATION[$nameInpField]["example"];
            else
                $corrExample = "";

            $error["example"] = $corrExample;

            $this->errors["input"][] = $error;
        }
        return $message;
    }

    /**
     * @method - check checkbox for checked
     */
    private function checkCheckbox()
    {
        if ($this->dataForm->checkbox->value === false)
            $this->errors["checkbox"][] = "Чекбокс не нажат.";
    }

    /**
     * @method - check required fields
     */
    private function checkRequiredFields()
    {
        $reqFields = $this->InpData->getListRequiredFields($this->nameForm);
        $formFields = $this->dataForm;

        foreach ($reqFields as $keyReq => $reqfield) {
            foreach ($formFields as $keyForm => $formfield) {
                if (! empty($formfield->value) && $reqfield === $formfield->nameField) {
                    unset($reqFields[$keyReq]);
                }
            }
        }

        if (! empty($reqFields))
            foreach ($reqFields as $reqfield)
                $this->errors["required"][] = $reqfield;
    }

    /**
     * @method - remove garbage symbols
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
<?php

require_once "lib/PerfectForm.php";
require_once "lib/PrepareDataToServer.php";
require_once "lib/helper/Captha.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["typeRequest"])) {

    switch ($_POST["typeRequest"]) {
        case "includeForm":
            $prepareData = includeForm();
            break;
        case "sendMessage":
            $prepareData = sendMessage();
            break;
        case "checkFiles":
            $prepareData = checkFiles();
            break;
    }

    echo json_encode($prepareData->getResponse());
    exit;
}

function includeForm()
{
    $prepareData = new PrepareDataToServer();

    if (! isset($_POST["nameForm"])) {
        $prepareData->setResponse("status", DefaultSettings::STATUS_ERROR);
        $prepareData->setResponse("errors", ["include" => "название формы не было передано на сервер"]);
    } else
        $prepareData->includeForm($_POST['nameForm']);

    return $prepareData;
}

function sendMessage()
{
    $isSendMail = false;
    $prepareData = new PrepareDataToServer();

    if (isset($_POST["reCAPTCHA"])) {
        $captcha = new Captha();
        $responseCaptcha = $captcha->getCaptcha($_POST["reCAPTCHA"]);

        if ($responseCaptcha->success == true && $responseCaptcha->score > 0.5)
            $isSendMail = true;
        else {
            $prepareData->setResponse("status", DefaultSettings::STATUS_ERROR);
            $prepareData->setResponse("errors", ["reCaptcha" => "Вы не прошли каптчу."]);
        }
    } else
        $isSendMail = true;

    if ($isSendMail === true) {
        if (isset($_POST["numberOfFiles"])) {
            $numberOfFiles = $_POST["numberOfFiles"];
            $isModalWindow = ($_POST["isModalWindow"] === "true") ? true : false;
            $prepareData->sendForm($_POST['data'], $_POST['ownerInfo'], $_FILES, $numberOfFiles, $isModalWindow);
        }
    }

    return $prepareData;
}

function checkFiles()
{
    $prepareData = new PrepareDataToServer();

    if (isset($_POST["numberOfFiles"]) && $_POST["nameForm"]) {
        $nameForm = $_POST["nameForm"];
        $numberOfFiles = intval($_POST["numberOfFiles"]);

        if ($numberOfFiles > 0) {
            $prepareData->checkFiles($nameForm, $_FILES, $numberOfFiles);
        }
        else {
            $prepareData->setResponse("status", DefaultSettings::STATUS_ERROR);
            $prepareData->setResponse("errors", ["Не было выбрано файлов"]);
        }
    }

    return $prepareData;
}





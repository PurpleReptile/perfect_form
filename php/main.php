<?php

require_once "lib/PerfectForm.php";
require_once "lib/PrepareDataToServer.php";
require_once "lib/helper/Captha.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["typeRequest"])) {

    $prepareData = new PrepareDataToServer();

    switch ($_POST["typeRequest"]) {
        case "includeForm":
            if (! isset($_POST["nameForm"])) {
                $prepareData->setResponse("status", DefaultSettings::STATUS_ERROR);
                $prepareData->setResponse("errors", ["include" => "название формы не было передано на сервер"]);
            } else
                $prepareData->includeForm($_POST['nameForm']);
            break;
        case "sendMessage":
            $numberOfFiles = 0;
            $isSendMail = false;

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
                if (isset($_POST["numberOfFiles"]))
                    $numberOfFiles = $_POST["numberOfFiles"];

                if ($_POST["isModalWindow"] === "true")
                    $isModalWindow = true;
                else
                    $isModalWindow = false;

                $prepareData->sendForm(
                    $_POST['data'],
                    $_POST['ownerInfo'],
                    $_FILES,
                    $numberOfFiles,
                    $isModalWindow);
            }
            break;
    }

    echo json_encode($prepareData->getResponse());
    exit;
}





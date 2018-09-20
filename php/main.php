<?php

require_once "lib/PerfectForm.php";
require_once "lib/PrepareDataToServer.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["typeRequest"])) {

    $prepareData = new PrepareDataToServer();

    if (!isset($_POST["nameForm"])) {
        $prepareData->setResponse("status", DefaultSettings::STATUS_ERROR);
        $prepareData->setResponse("error", "название формы не было передано на сервер");
    } else {
        switch ($_POST["typeRequest"]) {
            case "includeForm":
                $prepareData->includeForm($_POST['nameForm']);
                break;
            case "sendMessage":
//                $prepareData->sendForm($_POST['nameForm'], $_POST['toSend']);
//                $prepareData->sendFormPHPMailer($_POST['nameForm']);
                break;
            default:
                break;
        }

        echo json_encode($prepareData->getResponse());
        exit;
    }
}





<?php

require_once "lib/PerfectForm.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["typeRequest"])) {

    $form = new Form();

    if (!isset($_POST['nameForm'])) {
        $form->setResponse('status', 'error');
        $form->setResponse('message', 'название формы не было передано на сервер');
    } else {
        switch ($_POST["typeRequest"]) {
            case "includeForm":
                $form->includeForm($_POST['nameForm']);
                break;
            case "sendMessage":
                $form->sendForm($_POST['nameForm'], $_POST['toSend']);
                break;
            default:
                break;
        }

        echo json_encode($form->getResponse());
        exit;
    }
}

class Form
{
    private $response;

    public function getResponse()
    {
        return $this->response;
    }

    public function setResponse($type, $value)
    {
        $this->response[$type] = $value;
    }

    public function __construct()
    {
    }

    // получение содержимого формы для проекта
    public function includeForm($nameForm)
    {
        $pf = new PerfectForm($nameForm);

        if ($pf->includeForm()) {
            $this->response["status"] = "success";
            $this->response["form"] = $pf->getTplForm();
            $this->response["nameForm"] = $nameForm;
        } else {
            $this->response["status"] = "error";
            $this->response["msg"] = "Ошибка: файл с именем " . $nameForm . " не найден.";
        }
    }

    // отправка данных формы на сервер
    public function sendForm($nameForm, $dataMsg)
    {
        $pf = new PerfectForm($nameForm, $dataMsg);
        if ($pf->sendMsg()) {
            $this->response["status"] = "success";
            $this->response['message'] = $pf->getTplMessage();
        }
    }

    private function testInput($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
}






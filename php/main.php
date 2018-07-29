<?php

require_once "lib/PerfectForm.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!empty($_POST["typeRequest"])) {

        $form = new Form($_POST);

        switch ($_POST["typeRequest"]) {
            case "includeForm":
                $form->includeForm();
                break;
            case "sendMessage":
                $form->sendForm();
                break;
            default:
                break;
        }
    }
    echo json_encode($form->getResponse());
    exit;
}

class Form
{
    private $response;
    private $nameForm;
    private $dataToServer;

    public function getResponse()
    {
        return $this->response;
    }

    public function __construct($dataToServer)
    {
        $this->dataToServer = $dataToServer;
        $this->nameForm = $dataToServer["nameForm"];
    }

    // получение содержимого формы для проекта
    public function includeForm()
    {
        $pf = new PerfectForm($this->nameForm);

        if ($pf->includeForm())
        {
            $this->response["status"] = "success";
            $this->response["form"] = $pf->getTplForm();
            $this->response["nameForm"] = $this->nameForm;
        }
        else
        {
            $this->response["status"] = "error";
            $this->response["msg"] = "Ошибка: файл с именем " . $this->nameForm . " не найден.";
        }
    }

    // отправка данных формы на сервер
    public function sendForm()
    {
        $pf = new PerfectForm($this->nameForm, $this->dataToServer);
        if ($pf->sendMsg()) {
            $this->response["status"] = "success";
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






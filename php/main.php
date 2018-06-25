<?php

require_once "lib/PerfectForm.php";


if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    if (!empty($_POST["typeRequest"]))
    {
        $typeRequest = testInput($_POST["typeRequest"]);
        $response = [];

        switch ($typeRequest)
        {
            case "includeForm":
                $response = includeForm();
                break;
            case "sendForm":
                break;

            default:
                break;
        }
    }
    echo json_encode($response);
}
//else
//{
//
//}

// получение содержимого формы для проекта
function includeForm()
{
    $nameForm = $_POST["nameForm"];
    $response = [];

    $pf = new PerfectForm($nameForm);

    if ($pf->includeForm())
    {
        $response["status"] = "success";
        $response["form"] = $pf->getTplForm();
        $response["nameForm"] = $nameForm;
    }
    else
    {
        $response["status"] = "error";
        $response["msg"] = "Ошибка: файл с именем " . $nameForm . " не найден.";
    }

    return $response;
}

// отправка данных формы на сервер
function sendForm()
{

}


function testInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
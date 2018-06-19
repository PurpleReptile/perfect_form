<?php

require_once "lib/PerfectForm.php";


$nameForm = $_POST["nameForm"];
$response = [];

$pf = new PerfectForm($nameForm);

if ($pf->includeForm())
{
    $response["status"] = "success";
    $response["form"] = $pf->getContentForm();
    $response["nameForm"] = $nameForm;
}
else
{
    $response["status"] = "error";
    $response["msg"] = "Ошибка: файл с именем " . $nameForm . " не найден.";
}

echo json_encode($response);
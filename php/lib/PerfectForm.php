<?php

class PerfectForm
{
    private $nameForm;
    private $tplForm;

    public function __construct($nameForm)
    {
        $this->nameForm = $nameForm;
    }

    public function getTplForm()
    {
        return $this->tplForm;
    }

    // загрузка формы из файла
    public function includeForm()
    {
        $filename = "../tmp/" . $this->nameForm . ".html";
        if (file_exists($filename))
        {
            $this->tplForm = file_get_contents($filename);
            return true;
        }
        return false;
    }

    public function sendMsg()
    {

    }

    private function valideInpEmail($data)
    {
        return filter_var($data, FILTER_VALIDATE_EMAIL);
    }
}
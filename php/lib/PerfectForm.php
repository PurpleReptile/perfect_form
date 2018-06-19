<?php

class PerfectForm
{
    private $nameForm;
    private $contentForm;

    public function __construct($nameForm)
    {
        $this->nameForm = $nameForm;
    }

    public function getContentForm()
    {
        return $this->contentForm;
    }

    // загрузка формы из файла
    public function includeForm()
    {
        $filename = "../tmp/" . $this->nameForm . ".html";
        if (file_exists($filename))
        {
            $this->contentForm = file_get_contents($filename);
            return true;
        }
        return false;
    }
}
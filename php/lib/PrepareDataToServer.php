<?php

class PrepareDataToServer
{
    private $response;

    /**
     * @method - getting response from server
     * @return mixed - response server
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * @method - adding parameter for response server
     * @param string $type - type parameter
     * @param array|string $value - value parameter
     */
    public function setResponse($type, $value)
    {
        $this->response[$type] =  $value;
    }

    public function __construct() {}

    /**
     * @method - getting content form for project
     * @method - including template form
     * @param string $nameForm - name form
     */
    public function includeForm($nameForm)
    {
        $pf = new PerfectForm($nameForm);

        if ($pf->includeForm()) {
            $this->response["status"] = DefaultSettings::STATUS_SUCCESS;
            $this->response["form"] = $pf->getTplForm();
            $this->response["nameForm"] = $nameForm;
        } else {
            $this->response["status"] = DefaultSettings::STATUS_ERROR;
            $this->response["errors"] = "Ошибка: файл с именем " . $nameForm . " не найден.";
        }
    }

    /**
     * @method - sending data form to the server
     * @param string $dataMsg - data form from fields
     * @param string $ownerInfo - additional info about owner
     * @param object $files - list files for uploading
     * @param int $numberOfFiles - number of files
     * @param bool $isModalWindow - info about type window (modal/static)
     */
    public function sendForm($dataMsg, $ownerInfo, $files, $numberOfFiles, $isModalWindow)
    {
        $pf = new PerfectForm(json_decode($dataMsg), json_decode($ownerInfo));

        // adding files to send
        if ($numberOfFiles > 0) {
            $listFiles = ($numberOfFiles > 1) ? $this->reArrayFiles($files["file"]) : [$files["file"]];
            $pf->setListFiles($listFiles, $numberOfFiles);
        }

        if ($pf->sendMessage()) {
            $this->response["status"] = DefaultSettings::STATUS_SUCCESS;
            $this->response["isModalWindow"] = $isModalWindow;
        } else {
            $this->response["status"] = DefaultSettings::STATUS_ERROR;
            $this->response["errors"] = $pf->getErrors();
        }

        $this->response["nameForm"] = $pf->getNameForm();
    }

    /**
     * @method reorganization $_FILES to human view
     * @param $file_post
     * @return array
     */
    private function reArrayFiles(&$file_post)
    {
        $file_ary = array();
        $file_count = count($file_post['name']);
        $file_keys = array_keys($file_post);

        for ($ind = 0; $ind < $file_count; $ind++) {
            foreach ($file_keys as $key) {
                $file_ary[$ind][$key] = $file_post[$key][$ind];
            }
        }

        return $file_ary;
    }

    /**
     * @method - check upload files to the server
     * @param string $nameForm - name form
     * @param object $files - list files for uploading
     * @param int $numberOfFiles - number of files
     */
    public function checkFiles($nameForm, $files, $numberOfFiles)
    {
        $refAboutFiles = true;
        $pf = new PerfectForm($nameForm);

        // adding files for checking
        if ($numberOfFiles > 0) {

            $listFiles = ($numberOfFiles > 1) ? $this->reArrayFiles($files["file"]) : [$files["file"]];
            $pf->setListFiles($listFiles, $numberOfFiles);

            if ($pf->checkFilesLimit()) {
                $pf->prepareFilesForUploading();

                if ( !$pf->getErrors()) {
                    $this->response["status"] = DefaultSettings::STATUS_SUCCESS;

                } else {
                    $this->response["status"] = DefaultSettings::STATUS_ERROR;
                    $this->response["errors"] = $pf->getErrors();
                }

            } else {
                $this->response["status"] = DefaultSettings::STATUS_ERROR;
                $this->response["errors"] = $pf->getErrors();
            }
        } else
            $refAboutFiles = false;

        // addition info about files
        if ($refAboutFiles === true) {
            $this->response["reference"] = [
                "limit" => $pf->getFileLimit(),
                "maxSize" => $pf->getFileMaxSize(),
                "extensions" => $pf->getFileExtensions(),
                "numberOfFiles" => $numberOfFiles
            ];
            $this->response["listFiles"] = $listFiles;
            $this->response["nameForm"] = $nameForm;
        }
    }
}
<?php
/**
 * Created by PhpStorm.
 * User: i.poyarkov
 * Date: 30/08/18
 * Time: 9:43 AM
 */

class PrepareDataToServer
{
    private $response;

    /**
     * @method - получение ответа с сервера
     * @return mixed - ответ с сервера
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * @method - добавление параметра для ответа с сервера
     * @param string $type - тип параметра
     * @param string $value - значение параметра
     */
    public function setResponse($type, $value)
    {
        $this->response[$type] = $value;
    }

    public function __construct()
    {
    }

    /**
     * @method - получение содержимого формы для проекта
     * @method - подключение шаблона формы
     * @param string $nameForm - название формы
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
     * @method - отправка данных формы на сервер
     * @param string $nameForm - название формы
     * @param $dataMsg
     */
    public function sendForm($nameForm, $dataMsg)
    {
        $pf = new PerfectForm($nameForm, $dataMsg);
        if ($pf->sendMsg()) {
            $this->response["status"] = DefaultSettings::STATUS_SUCCESS;
            $this->response['message'] = $pf->getTplMessage();
        } else {
            $this->response["status"] = DefaultSettings::STATUS_ERROR;
            $this->response["errors"] = $pf->getErrors();
        }
    }

    public function sendFormPHPMailer($nameForm)
    {
        $pf = new PerfectForm($nameForm);
        $pf->sendMsgFromMailer();
    }
}
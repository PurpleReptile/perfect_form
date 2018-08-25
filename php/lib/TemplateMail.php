<?php

namespace Templates\Mail;

class TemplateMail
{
    private $template;          /** @var string - шаблон */
    private $path;              /** @var string - путь к шаблону */
    private $styles;            /** @var array - стили элементов шаблона */
    private $dataMsg;           /** @var array - содержимое для добавления в шаблон */

    public function __construct($dataMsg)
    {
        $this->dataMsg = $dataMsg;
        $this->path = $_SERVER['DOCUMENT_ROOT'] . "/tmp/mail/TemplateMail.html";
    }

    /**
     * @method string - получение шаблона письма
     * @return string $this->template - шаблон письма
     */
    public function getTemplate()
    {
        return $this->template;
    }

    /**
     * @method void - инициализация стилей
     */
    private function setStyles()
    {
        $this->styles['h1'] = "font-size: 1.5em;";
        $this->styles['h2'] = "font-size: 1em;";
        $this->styles['h3'] = "font-size: 0.5em;";
        $this->styles['span'] = "font-size: 0.5em";
        $this->styles['p'] = "font-size: 1em; margin-bottom: .5rem";
        $this->styles['.btn'] = "
            text-decoration:none;
            color: #FFF;
            background-color: #666;
            padding:10px 16px;
            font-weight:bold;
            margin-right:10px;
            text-align:center;
            cursor:pointer;
            display: inline-block;";
        $this->styles['.social .soc-btn'] = "
            padding: 3px 7px;
            font-size:12px;
            margin-bottom:10px;
            text-decoration:none;
            color: #FFF;font-weight:bold;
            display:block;
            text-align:center;";
    }

    /**
     * @method void - подготовка шаблона
     */
    public function prepareTemplate()
    {
        $contentMsg = '';
        $this->setStyles();
        $this->template = file_get_contents($this->path);

        foreach ($this->dataMsg as $info) {
            $contentMsg .= '<p style="' .$this->styles["p"]. '">' .$info['text']. '</p>';
        }

        $this->template = str_replace('{{ data }}', $contentMsg, $this->template);
        $this->template = str_replace('{{ .btn }}', $this->styles['.btn'], $this->template);
        $this->template = str_replace('{{ .social .soc-btn }}', $this->styles['.social .soc-btn'], $this->template);

    }
}
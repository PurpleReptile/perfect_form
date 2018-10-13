<?php

namespace Templates\Mail;

class TemplateMail
{
    private $template;          /** @var string - content template */
    private $path;              /** @var string - path to the template */
    private $styles;            /** @var array - styles of template elements */
    private $settings;          /** @var array - settings for site */
    private $msgUser;           /** @var array - content for adding into the template user */
    private $msgOwner;          /** @var array - content for adding into the template owner */

    public function __construct()
    {
        $argv = func_get_args();
        switch (func_num_args()) {
            case 1:
                self::__construct2($argv[0]);
                break;
            case 2:
                self::__construct3($argv[0], $argv[1]);
                break;
        }
    }

    private function __construct2($msg)
    {
        $this->msgUser = $msg;
        $this->path = $_SERVER['DOCUMENT_ROOT'] . "/templates/mail/userMail.html";
        $this->template = $this->prepareTemplate();
    }

    private function __construct3($msgUser, $msgOwner)
    {
        $this->msgUser = $msgUser;
        $this->msgOwner = $msgOwner;
        $this->path = $_SERVER['DOCUMENT_ROOT'] . "/templates/mail/ownerMail.html";
        $this->template = $this->prepareTemplate();
    }

    /**
     * @method string - get template for mail
     * @return string $this->template - template mail
     */
    public function getTemplate()
    {
        return $this->template;
    }

    /**
     * @method initialize variables for mail template
     */
    private function initVariablesTemplate()
    {
        $this->styles = [
            'logo' => ['display:block;margin: auto;'],
            'a' => ['color:#348eda;'],
            'p' => ['font-family: Arial;color: #666666;font-size: 12px;'],
            'h' => ['font-family:Arial;color: #111111;font-weight: 200;line-height: 1.2em;margin: 40px 20px;'],
            'h1' => ['font-size: 36px;'],
            'h2' => ['font-size: 28px;'],
            'h3' => ['font-size: 22px;'],
            'th' => ['font-family: Arial;text-align: left;color: #111111;'],
            'td' => ['font-family: Arial;text-align: left;color: #111111;'],
        ];

        $this->settings = [
            'site_url' => ["https://developers.google.com/"],
            'site_name' => ["Название сайта"],
            'logo_url' => ["https://www.gstatic.com/webp/gallery/1.webp"]
        ];
    }

    private function prepareTemplate()
    {
        $this->initVariablesTemplate();
        $template = file_get_contents($this->path);

        foreach ($this->styles as $typeTag => $style)
            $template = str_replace('{{ ' . $typeTag .' }}', $style[0], $template);

        foreach ($this->settings as $typeTag => $setting)
            $template = str_replace('{{ ' . $typeTag .' }}', $setting[0], $template);

        if (! empty($this->msgUser)) {
            $msgUser = "<p>" . implode("</p><p>", $this->msgUser);
            $template = str_replace('{{ dataUser }}', $msgUser, $template);
        }

        if (! empty($this->msgOwner)) {
            $msgOwner = "<p>" . implode("</p><p>", $this->msgOwner);
            $template = str_replace('{{ dataOwner }}', $msgOwner, $template);
        }

        return $template;
    }
}
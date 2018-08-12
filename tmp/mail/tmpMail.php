<?php
namespace Template\Message;

require_once $_SERVER['DOCUMENT_ROOT'] . '/php/lib/DefaultSettings.php';

class ModelPF
{
    public $template;
    public $styles;
    public $dataMsg;

    public function __construct($dataMsg)
    {
        $this->dataMsg = $dataMsg;
        $this->setStyles();
        $this->template = "template.php";
    }

    public function setStyles()
    {
        $this->styles['h1'] = "font-size: 1.5em;";
        $this->styles['h2'] = "font-size: 1em;";
        $this->styles['h3'] = "font-size: 0.5em;";
        $this->styles['span'] = "font-size: 0.5em";
        $this->styles['p'] = "font-size: 1em";
    }


}

class ViewPF
{
    private $model;

    public function __construct($model)
    {
//        $this->controller = $controller;
        $this->model = $model;
    }

    public function output()
    {
        $data = '<!DOCTYPE html>
                    <html>
                     <head>
                      <meta charset="charset=utf-8">
                      <title>The Template Message</title>
                     </head>
                     <body>';
//        $data .= '<div style="display: flex; flex-direction: column; margin: 3em 1em;">';
        $data .= '<div>';

        foreach ($this->model->dataMsg as $key => $value) {
            switch ($value["type"]) {
                case 'p':
                    $data .= '<p style="' . $this->model->styles['p'] . '">' . $value["text"] . '</h1>';
                    break;
            }
        }
        $data .= "</div>
                </body>
                </html>";
//        require_once($this->model->template);
        return $data;
    }

}


//$data .= '<p>Here are the birthdays upcoming in August!</p>
//              <table>
//                <tr>
//                  <th>Person</th><th>Day</th><th>Month</th><th>Year</th>
//                </tr>
//                <tr>
//                  <td>Johny</td><td>10th</td><td>August</td><td>1970</td>
//                </tr>
//                <tr>
//                  <td>Sally</td><td>17th</td><td>August</td><td>1973</td>
//                </tr>
//              </table>';

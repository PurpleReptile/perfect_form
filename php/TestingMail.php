<?php

require_once __DIR__ . '/lib/helper/TemplateMail.php';

use Templates\Mail\TemplateMail;

$msgUser = [
        "<p>Test user message</p>",
        "<p>Test user message</p>",
        "<p>Test user message</p>",
        "<p>Test user message</p>",
        "<p>Test user message</p>",
    ];

$msgOwner = [
        "<p>Test owner message</p>",
        "<p>Test owner message</p>",
        "<p>Test owner message</p>",
        "<p>Test owner message</p>",
        "<p>Test owner message</p>",
];

// шаблон для юзера
//$templateUser = new TemplateMail($msgUser);
//echo $templateUser->getTemplate();

// шаблон для владельца
$templateOwner = new TemplateMail($msgUser, $msgOwner);
echo $templateOwner->getTemplate();
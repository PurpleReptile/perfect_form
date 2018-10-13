<?php

class DefaultSettings
{
    // client-side google reCAPTCHA v3
    const SITE_KEY = "6LeNyHIUAAAAAEX7wD_srG8r17k67OOPZJwZKFjn";

    // server-side google reCAPTCHA v3
    const SECRET_KEY = "6LeNyHIUAAAAAC8DDIAN0ciu17bLZvnEueCccDXx";

    // email settings
    static public $email = '
        "email": {
            "to": "ig.poyarkoff@yandex.ru",
            "owner": "ig.evg.po@gmail.com",
            "subject": "Тестовый заголовок"
        }';

    // smtp settings
    static public $smtp = '
        "smtp": {
            "username": "ig.poyarkoff",
            "password": "}Br8O107#n4NWs[Ehi&6X<TRv"
        }';

    // file settings
    static public $files = '
        "files": {
            "extensions": ["txt", "jpg", "jpeg", "png"],
            "max_size": "2097152"
        }';

    // form settings
    static public $form = '
        "form": {
            "bsForm": {
                "required": [
                    "firstname",
                    "surname",
                    "fullname",
                    "email"
                ]
            },
            "bsForm2": {
                "required": [
                    "firstname",
                    "email"
                ]
            }
        }';

    // status response
    const STATUS_SUCCESS = "success";
    const STATUS_ERROR = "error";
    const STATUS_WARNING = "warning";

    // regexp for validation
    const VALIDATION = [
        "email" => [
            "regexp" => "/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/",
            "example" => "test@test.com",
            "label" => "Email"
        ],
        "firstname" => [
            "regexp" => "/^[А-Я]{1}[а-я]{1,}$/u",
            "example" => "Имя",
            "label" => "Имя"
        ],
        "surname" => [
            "regexp" => "/^[А-Я]{1}[а-я]{1,}$/u",
            "example" => "Фамилия",
            "label" => "Фамилия"
        ],
        "fullname" => [
            "regexp" => "/^([А-Я]{1}[а-я]{1,})\s([А-Я]?[а-я]{1,})\s([А-Я]{1}[а-я]{1,})$/u",
            "example" => "Поярков Игорь Евгеньевич",
            "label" => "ФИО"
        ],
        "phone" => [
            "regexp" => "/^[\d|\s|\-]*$/",
            "example" => "12-12-12",
            "label" => "Телефон"
        ],
        "date" => [
            "regexp" => "/\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/",
            "example" => "DD.MM.YYYY H:mm",
            "label" => "Дата"
        ]
    ];

    // styles
    const STYLE_H1 = 'h1';
    const STYLE_H2 = 'h2';
    const STYLE_H3 = 'h3';
    const STYLE_P = 'p';
    const STYLE_SPAN = 'span';
}
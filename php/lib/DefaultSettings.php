<?php

class DefaultSettings
{
    // email settings
    static public $email = '{
    "email": 
        {
            "to": "ig.poyarkoff@yandex.ru",
            "subject": "Тестовое название"
          }
    }';

    // status response
    const STATUS_SUCCESS = "success";
    const STATUS_ERROR = "error";

    // regexp for validation
    const VALIDATION = [
        "email" => [
            "regexp" => "/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/",
            "label" => "Email"
        ],
        "firstname" => [
            "regexp" => "/^[А-Я][а-я]+$/",
            "label" => "Имя"
        ],
        "lastname" => [
            "regexp" => "/^[А-Я][а-я]+$/",
            "label" => "Фамилия"
        ],
        "fullname" => [
            "regexp" => "/^([А-Я][а-я]+)\s([А-Я][а-я]+)$/",
            "label" => "ФИО"
        ],
        "phone" => [
            "regexp" => "/^[\d|\s|\-]*$/",
            "label" => "Телефон"
        ],
        "date" => [
            "regexp" => "",
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
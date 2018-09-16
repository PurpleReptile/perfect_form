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
    const REGEXP_EMAIL= "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";
    const REGEXP_FIRST_LAST_NAME = "/^[А-Я][а-я]+$/";
    const REGEXP_FULLNAME = "/^([А-Я][а-я]+)\s([А-Я][а-я]+)$/";
    const REGEXP_PHONE = "/^[\d|\s|\-]*$/";
    const REGEXP_DATE = "";

    // styles
    const STYLE_H1 = 'h1';
    const STYLE_H2 = 'h2';
    const STYLE_H3 = 'h3';
    const STYLE_P = 'p';
    const STYLE_SPAN = 'span';
}
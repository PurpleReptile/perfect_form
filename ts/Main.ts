import { PerfectForm } from "./PerfectForm";
import { Validation } from "./Validation";

$(function () {

    $("[data-pf-open]").click(function () {
        let nameForm = $(this).data("pfName");
        let placeForForm = `[data-pf-place="${nameForm}"]`;
        let pf = new PerfectForm(nameForm, placeForForm);

        pf.includeForm();

        $("body").unbind("submit"); // delete old bind "submit form"
        $("body").unbind("keyup");  // delete old bind "validation fields"

        $("body").bind("submit", `#${nameForm}`, submitForm);   // отправка данных на сервер
        $("body").bind("keyup", `#${nameForm}`, validationForm);    // валидация полей формы "налету"
    });

    /**
     * @method - отправка формы
     * @param nameForm - название формы
     * @param event - объект событий
     * @param pf - объект "PerfectForm"
     */
    function submitForm(nameForm: any, event: any, pf: PerfectForm) {
        let data: any = [];
        let dataElem: any = [];

        event.preventDefault();

        if ($(event.target).is(`form#${nameForm}`)) {

            $.each($(event.target.children).find("input"), function (ind, item) {
                switch ($(this).attr('type')) {
                    case "text":
                        if ($(item).attr('data-pf-field') == 'date')
                            dataElem = prepareField($(item), "date");
                        else
                            dataElem = prepareField($(item), "text");
                        break;
                    case "email":
                        dataElem = prepareField($(item), "email");
                        break;
                    case "range":
                        dataElem = prepareFieldRange($(item));
                        break;
                    case "file":
                        dataElem = prepareFieldFile($(item));
                        break;
                    default:
                        break;
                }

                if (dataElem) {
                    data.push(dataElem);
                }
            }

            if (!$.isEmptyObject(data)) {
                pf.setDataFields = data;
                pf.sendDataToServer();
            }
        }
    }

    // TODO: реализовать валидацию полей формы "налету"
    /**
     * @method валидация полей форм "налету"
     * @param nameForm - названия формы
     * @param nameField - название поля для валидации
     * @param valueField - значение поля
     */
    function validationForm(nameForm: any, nameField: string, valueField: string) {
        let valid: Validation;
        let expCorrectField: string;

        valid= new Validation(nameForm, nameField, valueField);

        if (valid.validation()) {

        } else {
            expCorrectField = valid.getExpCorrectField();
            // $(nameField).
        }
    }

    /**
     * @method - получение данных из поля формы (тестовый формат)
     * @param elem - объект элемента
     * @param typeField - тип поля
     */
    function prepareField(elem: any, typeField: string) {
        if (elem.val()) {
            return {
                type: typeField,
                value: elem.val(),
                required: elem.attr("required"),
                typeField: elem.attr("data-pf-field")
            };
        }
    }

    /**
     * @method - получение данных из поля формы (диапазон)
     * @param elem - объект элемента
     */
    function prepareFieldRange(elem: any) {
        return {
            type: "range",
            value: elem.val(),
            min: elem.attr("min"),
            max: elem.attr("max"),
            typeField: "range"
        };
    }

    /**
     * @method - получение данных из поля формы (файл)
     * @param elem - объект элемента
     */
    function prepareFieldFile(elem: any) {
        if ((elem[0].files.length) > 0) {
            return {
                files: $(this)[0].files
                typeField: files
            };
        }
    }

    /**
     * @method - отправление тестового письма
     */
    $("#sendMesage").click(function(e) {
        e.preventDefault();
        console.log("ok");

        $.ajax({
            type: "post",
            url: "../php/testMail.php",
            // data: "data",
            // dataType: "json",
            success: function (response) {
                alert("ok");
            }
        });
    });

});
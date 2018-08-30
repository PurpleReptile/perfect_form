import { Validation } from "./Validation";

class PerfectForm {

    readonly typeRequestIncludeForm = "includeForm";
    readonly typeRequestSendMsg = "sendMessage";
    readonly urlScript = '../php/main.php';

    private nameForm: string;           /** @var - название формы */
    private placeForm: any;             /** @var - опорный элемент для выгрузки формы в DOM */
    private dataToServer: object;       /** @var - данные для отправки на сервер */
    private dataFields: object;         /** @var - данные полей */

    set setDataFields(data: any) {
        this.dataFields = data;
    }

    constructor(nameForm: string, placeForm: any) {
        this.nameForm = nameForm;
        this.placeForm = placeForm;
        this.dataToServer = {};
        this.dataFields = {};
    }

    // подключение формы в проект
    public includeForm(): any {
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: `&nameForm=${this.nameForm}&typeRequest=${this.typeRequestIncludeForm}`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.includeFormError,
        });
    }

    private includeFormSuccess(response: any): any {
        if (response.status == "success")
            $(`[data-pf-place="${response.nameForm}"]`).html(response.form);
        else
            console.log(response.msg);
    }

    private includeFormError(jqXHR: any): any {
        console.log(jqXHR);
    }

    // отправка данных на сервер
    public sendDataToServer(): any {
        this.dataToServer = {
            toSend: this.dataFields,
            typeRequest: this.typeRequestSendMsg,
            nameForm: this.nameForm
        };

        console.log(this.dataToServer);
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: this.dataToServer,
            dataType: 'json',
            success: this.sendDataToServerSuccess,
            error: this.sendDataToServerError
        });
    }

    private sendDataToServerSuccess(response: any): any {
        if (response.status == "success") {
            $('#mail-place').html(response.message);
            console.log("message was send");
        }
        else {
            console.log(response.msg);
        }
    }

    private sendDataToServerError(jqXHR: any): any {
        console.log(jqXHR);
    }

    public prepareData(formObj: any, typeField: string | undefined): any {
        let data = {};
        console.log(formObj);
    }
}

$(function () {

    $("[data-pf-open]").click(function () {
        let nameForm = $(this).data("pfName");
        let placeForForm = `[data-pf-place="${nameForm}"]`;
        let pf = new PerfectForm(nameForm, placeForForm);

        // подключение формы
        pf.includeForm();

        // delete old binds
        $("body").unbind("submit");
        $("body").unbind("keyup");

        // отправка данных на сервер
        $("body").bind("submit", `#${nameForm}`, submitForm);

        // валидация полей формы "налету"
        $("body").bind("keyup", `#${nameForm}`, validationForm);
    });

    // отправка формы
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

    // валидация полей формы "налету"
    // TODO: реализовать валидацию полей формы "налету"
    function validationForm(nameForm: string, nameField: string, valueField: string) {
        let valid: Validation;
        let expCorrectField: string;

        valid= new Validation(nameForm, nameField, valueField);

        if (valid.validation()) {

        } else {
            expCorrectField = valid.getExmpCorrectField();
            // $(nameField).
        }
    }

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

    // получение данных из любого текстового поля формы
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

    // получение данных из поля формы типа "диапазон"
    function prepareFieldRange(elem: any) {
        return {
            type: "range",
            value: elem.val(),
            min: elem.attr("min"),
            max: elem.attr("max"),
            typeField: "range"
        };
    }

    // получение данных из поля формы типа "файл"
    function prepareFieldFile(elem: any) {
        if ((elem[0].files.length) > 0) {
            return {
                files: $(this)[0].files
                typeField: files
            };
        }
    }

});


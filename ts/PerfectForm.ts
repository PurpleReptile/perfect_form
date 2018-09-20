class Validation {

    readonly regexpEmail= /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    readonly regexpFirstname = /^\W{2,}$/;
    readonly regexpLastname = /W/;
    readonly regexpFullname = /W/;
    readonly regexpPhone = /^[\d|\s|\-]*$/;
    readonly regexpDate = /W/;
    readonly listExamples = [

    ];

    private nameForm: string;
    private nameField: string;
    private valueField: string;
    private exampleCorrectField: string;

    constructor(nameForm: string, nameField: string, valueField: string) {
        this.nameForm = nameForm;
        this.nameField = nameField;
        this.valueField = valueField;
        this.exampleCorrectField = "";
    }

    get getExpCorrectField(): any {
        return this.exampleCorrectField;
    }

    public validation(): any {
        let fieldExist = false;

        switch (this.nameField) {
            case "email":
                if (this.regexpEmail.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "test@gmail.com";
                break;
            case "firstname":
                if (this.regexpFirstname.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "Johny";
                break;
            case "lastname":
                if (this.regexpLastname.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "Cash";
                break;
            case "fullname":
                if (this.regexpFullname.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "Johny Cash";
                break;
            case "phone":
                if (this.regexpPhone.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "8-120-120";
                break;
            case "date":
                if (this.regexpDate.test(this.valueField))
                    return true;
                else
                    this.exampleCorrectField = "20.09.2018";
                break;
        }

        return false;
    }
}

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
        let formData = new FormData();
        formData.append("firstname", "test");
        formData.append("typeRequest", "test");
        // formData.append(this.dataFields);
        // console.log
        this.dataToServer = {
            // toSend: this.dataFields,
            toSend: formData,
            typeRequest: this.typeRequestSendMsg,
            nameForm: this.nameForm
        };

        console.log(this.dataToServer);
        console.log(formData);

        $.ajax({
            type: 'post',
            url: this.urlScript,
            // data: this.dataToServer,
            data: formData,
            contentType: false,
            processData: false,
            success: this.sendDataToServerSuccess,
            error: this.sendDataToServerError
        });
    }

    private sendDataToServerSuccess(response: any): any {
        switch (response.status) {
            case "success":
                $('#mail-place').html(response.message);
                console.log("message was send");
                break;
            case "error":
                console.log(response.errors);
                break;
        }
    }

    private sendDataToServerError(jqXHR: any): any {
        console.log(jqXHR);
    }
}

$(function () {

    // нажатие на кнопку "открыть форму"
    $("[data-pf-open]").click(function () {
        let nameForm: string = $(this).data("pfName");
        let placeForForm: string  = `[data-pf-place="${nameForm}"]`;
        let pf: PerfectForm = new PerfectForm(nameForm, placeForForm);

        pf.includeForm();

        $("body").unbind("submit"); // delete old bind "submit form"
        $("body").unbind("keyup");  // delete old bind "validation fields"

        // валидация полей формы "налету"

        // $("body").bind("keyup", `#${nameForm}`, function (event: any) {

        // отправка данных на сервер
        $("body").bind("submit", `#${nameForm}`, function (event: any) {
            let data: any = [];
            let dataElem: any = [];
            let found: boolean = false;

            event.preventDefault();

            if ($(event.target).is(`form#${nameForm}`)) {

                $.each($(event.target.children).find("input"), function (ind, item) {

                    found = false;

                    switch ($(this).attr('type')) {
                        case "text":
                            let typeField: string = ($(item).attr('data-pf-field') == "date") ? "date" : "text";

                            if (prepareField($(item), typeField) !== false) {
                                dataElem = prepareField($(item), typeField);
                                found = true;
                            }
                            break;
                        case "email":
                            dataElem = prepareField($(item), "email");
                            found = true;
                            break;
                        case "range":
                            dataElem = prepareFieldRange($(item));
                            found = true;
                            break;
                        case "file":
                            if (prepareFieldFile($(item)) !== false) {
                                dataElem = prepareFieldFile($(item));
                                found = true;
                            }
                            break;
                        default:
                            break;
                    }

                    if (found)
                        data.push(dataElem);
                }

                if (!$.isEmptyObject(data)) {
                    pf.setDataFields = data;
                    pf.sendDataToServer();
                }
            }
        });
        $("body").bind("click",  `#${nameForm}`, function (event: any) {

            let elem = $(event.target);

            // click checkbox
            if (elem.localName === "input" && elem.type === "checkbox") {
                if (elem.checked)
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", false);
                else
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", true);
            }
        });
    });

    /**
     * @method - отправка формы
     * @param nameForm - название формы
     * @param event - объект событий
     * @param pf - объект "PerfectForm"
     */
    // function submitForm(nameForm: any, event: any, pf: PerfectForm) {
    //     let data: any = [];
    //     let dataElem: any = [];
    //
    //     event.preventDefault();
    //
    //     if ($(event.target).is(`form#${nameForm}`)) {
    //
    //         $.each($(event.target.children).find("input"), function (ind, item) {
    //             switch ($(this).attr('type')) {
    //                 case "text":
    //                     if ($(item).attr('data-pf-field') == 'date')
    //                         dataElem = prepareField($(item), "date");
    //                     else
    //                         dataElem = prepareField($(item), "text");
    //                     break;
    //                 case "email":
    //                     dataElem = prepareField($(item), "email");
    //                     break;
    //                 case "range":
    //                     dataElem = prepareFieldRange($(item));
    //                     break;
    //                 case "file":
    //                     dataElem = prepareFieldFile($(item));
    //                     break;
    //                 default:
    //                     break;
    //             }
    //
    //             if (dataElem) {
    //                 data.push(dataElem);
    //             }
    //         }
    //
    //         if (!$.isEmptyObject(data)) {
    //             pf.setDataFields = data;
    //             pf.sendDataToServer();
    //         }
    //     }
    // }

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
            // expCorrectField = valid.getExpCorrectField();
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
        return false;
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
        if (($(elem)[0].files.length) > 0) {
            return {
                files: $(this)[0].files,
                typeField: files
            };
        }
        return false;
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
            success: function (response: any) {
                console.log(response);
                alert("ok");
            }
        });
    });

});


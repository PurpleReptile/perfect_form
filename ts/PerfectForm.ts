class PerfectForm {

    readonly typeRequestIncludeForm = "includeForm";
    readonly typeRequestSendMsg = "sendMessage";
    readonly _urlConn = '../php/main.php';
    readonly _nameForm: string;

    private _placeForm: any;
    private _dataToServer: object;
    private _dataFields: object;

    set setDataFields(data: any) {
        this._dataFields = data;
    }

    constructor(nameForm: string, placeForm: any) {
        this._nameForm = nameForm;
        this._placeForm = placeForm;
        this._dataToServer = {};
        this._dataFields = {};
    }

    // подключение формы в проект
    public includeForm(): any {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `&nameForm=${this._nameForm}&typeRequest=${this.typeRequestIncludeForm}`,
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
    public sendDataForm(): any {
        this._dataToServer = {
            toSend: this._dataFields,
            typeRequest: this.typeRequestSendMsg,
            nameForm: this._nameForm
        };

        console.log(this._dataToServer);
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: this._dataToServer,
            dataType: 'json',
            success: this.mailFormSuccess,
            error: this.mailFormError
        });
    }

    private mailFormSuccess(response: any): any {
        if (response.status == "success") {
            console.log("message was send");
        }
        else {
            console.log(response.msg);
        }
    }

    private mailFormError(jqXHR: any): any {
        console.log(jqXHR);
    }

    public prepareDataToServer(formObj: any, typeField: string | undefined): any {

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

        // отправка формы
        $("body").bind("submit", `#${nameForm}`, function (event) {
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
                        case "email":   dataElem = prepareField($(item), "email"); break;
                        case "range":   dataElem = prepareFieldRange($(item)); break;
                        case "file":    dataElem = prepareFieldFile($(item)); break;
                        default:
                            break;
                    }

                    if (dataElem) {
                        data.push(dataElem);
                    }
                }

                if (!$.isEmptyObject(data)) {
                    pf.setDataFields = data;
                    pf.sendDataForm();
                }
                    // pf.sendDataForm(data);
            }
        });

        // валидация данных
        // TODO: реализовать валидацию полей "налету"
        $("body").bind("keyup", `#${nameForm}`, function (event) {
            // console.log(event.key)
        });
    });

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
                typeFieldPF: elem.attr("data-pf-field")
            };
        }
    }

    // получение данных из поля формы типа "диапазон"
    function prepareFieldRange(elem: any) {
        return {
            type: "range",
            value: elem.val(),
            min: elem.attr("min"),
            max: elem.attr("max")
        };
    }

    // получение данных из поля формы типа "файл"
    function prepareFieldFile(elem: any) {
        if ((elem[0].files.length) > 0) {
            return {
                files: $(this)[0].files
            };
        }
    }

});


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = require("./Validation");
class PerfectForm {
    constructor(nameForm, placeForm) {
        this.typeRequestIncludeForm = "includeForm";
        this.typeRequestSendMsg = "sendMessage";
        this.urlScript = '../php/main.php';
        this.nameForm = nameForm;
        this.placeForm = placeForm;
        this.dataToServer = {};
        this.dataFields = {};
    }
    set setDataFields(data) {
        this.dataFields = data;
    }
    includeForm() {
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: `&nameForm=${this.nameForm}&typeRequest=${this.typeRequestIncludeForm}`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.includeFormError,
        });
    }
    includeFormSuccess(response) {
        if (response.status == "success")
            $(`[data-pf-place="${response.nameForm}"]`).html(response.form);
        else
            console.log(response.msg);
    }
    includeFormError(jqXHR) {
        console.log(jqXHR);
    }
    sendDataToServer() {
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
    sendDataToServerSuccess(response) {
        if (response.status == "success") {
            $('#mail-place').html(response.message);
            console.log("message was send");
        }
        else {
            console.log(response.msg);
        }
    }
    sendDataToServerError(jqXHR) {
        console.log(jqXHR);
    }
    prepareData(formObj, typeField) {
        let data = {};
        console.log(formObj);
    }
}
$(function () {
    $("[data-pf-open]").click(function () {
        let nameForm = $(this).data("pfName");
        let placeForForm = `[data-pf-place="${nameForm}"]`;
        let pf = new PerfectForm(nameForm, placeForForm);
        pf.includeForm();
        $("body").unbind("submit");
        $("body").unbind("keyup");
        $("body").bind("submit", `#${nameForm}`, submitForm);
        $("body").bind("keyup", `#${nameForm}`, validationForm);
    });
    function submitForm(nameForm, event, pf) {
        let data = [];
        let dataElem = [];
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
            });
            if (!$.isEmptyObject(data)) {
                pf.setDataFields = data;
                pf.sendDataToServer();
            }
        }
    }
    function validationForm(nameForm, nameField, valueField) {
        let valid;
        let expCorrectField;
        valid = new Validation_1.Validation(nameForm, nameField, valueField);
        if (valid.validation()) {
        }
        else {
            expCorrectField = valid.getExmpCorrectField();
        }
    }
    $("#sendMesage").click(function (e) {
        e.preventDefault();
        console.log("ok");
        $.ajax({
            type: "post",
            url: "../php/testMail.php",
            success: function (response) {
                alert("ok");
            }
        });
    });
    function prepareField(elem, typeField) {
        if (elem.val()) {
            return {
                type: typeField,
                value: elem.val(),
                required: elem.attr("required"),
                typeField: elem.attr("data-pf-field")
            };
        }
    }
    function prepareFieldRange(elem) {
        return {
            type: "range",
            value: elem.val(),
            min: elem.attr("min"),
            max: elem.attr("max"),
            typeField: "range"
        };
    }
    function prepareFieldFile(elem) {
        if ((elem[0].files.length) > 0) {
            return {
                files: $(this)[0].files,
                typeField: files
            };
        }
    }
});

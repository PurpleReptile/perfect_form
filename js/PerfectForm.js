"use strict";
class Validation {
    constructor(nameForm, nameField, valueField) {
        this.regexpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.regexpFirstname = /^\W{2,}$/;
        this.regexpLastname = /W/;
        this.regexpFullname = /W/;
        this.regexpPhone = /^[\d|\s|\-]*$/;
        this.regexpDate = /W/;
        this.listExamples = [];
        this.nameForm = nameForm;
        this.nameField = nameField;
        this.valueField = valueField;
        this.exampleCorrectField = "";
    }
    get getExpCorrectField() {
        return this.exampleCorrectField;
    }
    validation() {
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
        let formData = new FormData();
        formData.append("firstname", "test");
        formData.append("typeRequest", "test");
        this.dataToServer = {
            toSend: formData,
            typeRequest: this.typeRequestSendMsg,
            nameForm: this.nameForm
        };
        console.log(this.dataToServer);
        console.log(formData);
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: formData,
            contentType: false,
            processData: false,
            success: this.sendDataToServerSuccess,
            error: this.sendDataToServerError
        });
    }
    sendDataToServerSuccess(response) {
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
    sendDataToServerError(jqXHR) {
        console.log(jqXHR);
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
        $("body").bind("submit", `#${nameForm}`, function (event) {
            let data = [];
            let dataElem = [];
            let found = false;
            event.preventDefault();
            if ($(event.target).is(`form#${nameForm}`)) {
                $.each($(event.target.children).find("input"), function (ind, item) {
                    found = false;
                    switch ($(this).attr('type')) {
                        case "text":
                            let typeField = ($(item).attr('data-pf-field') == "date") ? "date" : "text";
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
                });
                if (!$.isEmptyObject(data)) {
                    pf.setDataFields = data;
                    pf.sendDataToServer();
                }
            }
        });
        $("body").bind("click", `#${nameForm}`, function (event) {
            let elem = $(event.target);
            if (elem.localName === "input" && elem.type === "checkbox") {
                if (elem.checked)
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", false);
                else
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", true);
            }
        });
    });
    function validationForm(nameForm, nameField, valueField) {
        let valid;
        let expCorrectField;
        valid = new Validation(nameForm, nameField, valueField);
        if (valid.validation()) {
        }
        else {
        }
    }
    function prepareField(elem, typeField) {
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
        if (($(elem)[0].files.length) > 0) {
            return {
                files: $(this)[0].files,
                typeField: files
            };
        }
        return false;
    }
    $("#sendMesage").click(function (e) {
        e.preventDefault();
        console.log("ok");
        $.ajax({
            type: "post",
            url: "../php/testMail.php",
            success: function (response) {
                console.log(response);
                alert("ok");
            }
        });
    });
});

"use strict";
class PerfectForm {
    constructor(nameForm, placeForm) {
        this.typeRequestIncludeForm = "includeForm";
        this.typeRequestSendMsg = "sendMessage";
        this._nameForm = nameForm;
        this._placeForm = placeForm;
        this._urlConn = '../php/main.php';
        this._dataToServer = {};
    }
    includeForm() {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `&nameForm=${this._nameForm}&typeRequest=${this.typeRequestIncludeForm}`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.includeFormError,
        });
    }
    includeFormSuccess(response) {
        if (response.status == "success") {
            $(`[data-pf-place="${response.nameForm}"]`).html(response.form);
        }
        else {
            console.log(response.msg);
        }
    }
    includeFormError(jqXHR) {
        console.log(jqXHR);
    }
    sendDataForm(data) {
        this._dataToServer = {
            toSend: data,
            typeRequest: this.typeRequestSendMsg,
            nameForm: this._nameForm
        };
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: this._dataToServer,
            dataType: 'json',
            success: this.mailFormSuccess,
            error: this.mailFormError
        });
    }
    mailFormSuccess(response) {
        if (response.status == "success") {
            console.log("message was send");
        }
        else {
            console.log(response.msg);
        }
    }
    mailFormError(jqXHR) {
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
            let dataToServer = [];
            let data = {};
            event.preventDefault();
            if ($(event.target).is(`form#${nameForm}`)) {
                $.each($(event.target.children).find("input"), function () {
                    data = {};
                    switch ($(this).attr("type")) {
                        case "text":
                            if ($(this).val()) {
                                data = {
                                    type: "text",
                                    value: $(this).val(),
                                    required: $(this).attr("required")
                                };
                            }
                            break;
                        case "range":
                            data = {
                                type: "range",
                                value: $(this).val(),
                                min: $(this).attr("min"),
                                max: $(this).attr("max")
                            };
                            break;
                        case "file":
                            if (($(this)[0].files.length) > 0) {
                                data = {
                                    files: $(this)[0].files
                                };
                            }
                            break;
                    }
                    if (!$.isEmptyObject(data))
                        dataToServer.push(data);
                });
                console.log(dataToServer);
                pf.sendDataForm(dataToServer);
            }
        });
        $("body").bind("keyup", `#${nameForm}`, function (event) {
        });
    });
});

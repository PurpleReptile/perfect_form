"use strict";
class PerfectForm {
    constructor(nameForm, placeForm) {
        this._nameForm = nameForm;
        this._placeForm = placeForm;
        this._urlConn = '../php/main.php';
    }
    includeForm() {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `&nameForm=${this._nameForm}&typeRequest=includeForm`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.includeFormError,
        });
    }
    includeFormSuccess(response) {
        if (response.status == "success") {
            $(`[data-pf-place="${response.nameForm}"]`).html(response.form);
            console.log(response);
        }
        else {
            console.log(response.msg);
        }
    }
    includeFormError(jqXHR) {
        console.log(jqXHR);
    }
    sendDataForm(data) {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `${data}&typeRequest=sendForm`,
            dataType: 'json',
            success: function (response) {
            }
        });
    }
}
$(document).ready(function () {
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
                            data = {
                                type: "text",
                                value: $(this).val()
                            };
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
            }
        });
        $("body").bind("keyup", `#${nameForm}`, function (event) {
        });
    });
});

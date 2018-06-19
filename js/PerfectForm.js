"use strict";
class PerfectForm {
    constructor(nameForm, placeForm) {
        this._nameForm = nameForm;
        this._placeForm = placeForm;
    }
    includeForm() {
        $.ajax({
            type: 'post',
            url: '../php/main.php',
            data: `&nameForm=${this._nameForm}`,
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
}
$(document).ready(function () {
    $("[data-pf-open]").click(function () {
        let nameForm = $(this).data("pfName");
        let placeForForm = '[data-pf-place="${nameForm}"]';
        let pf = new PerfectForm(nameForm, placeForForm);
        pf.includeForm();
        $("body").unbind("submit");
        $("body").bind("submit", `#${nameForm}`, function (event) {
            event.preventDefault();
            console.log("form submited");
        });
    });
});

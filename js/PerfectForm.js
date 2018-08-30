"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.PerfectForm = PerfectForm;

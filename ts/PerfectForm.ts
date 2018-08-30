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

export { PerfectForm }


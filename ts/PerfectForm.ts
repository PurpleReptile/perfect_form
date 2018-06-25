class PerfectForm {
    private _nameForm: string;
    private _placeForm: any;
    private _urlConn: string;

    constructor(nameForm: string, placeForm: any) {
        this._nameForm = nameForm;
        this._placeForm = placeForm;
        this._urlConn = '../php/main.php';
    }

    public includeForm(): any {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `&nameForm=${this._nameForm}&typeRequest=includeForm`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.includeFormError,
        });
    }
    private includeFormSuccess(response: any): any {
        if (response.status == "success") {
            $(`[data-pf-place="${response.nameForm}"]`).html(response.form);
            console.log(response);
        }
        else {
            console.log(response.msg);
        }
    }
    private includeFormError(jqXHR: any): any {
        console.log(jqXHR);
    }

    public sendDataForm(data: string): any {
        $.ajax({
            type: 'post',
            url: this._urlConn,
            data: `${data}&typeRequest=sendForm`,
            dataType: 'json',
            success: function(response) {

            }
        });
    }
}

$(document).ready(function() {

    $("[data-pf-open]").click(function() {
        let nameForm = $(this).data("pfName");
        let placeForForm = `[data-pf-place="${nameForm}"]`;

        let pf = new PerfectForm(nameForm, placeForForm);
        pf.includeForm();

        // удаление старых событий
        $("body").unbind("submit");
        $("body").unbind("keyup");

        $("body").bind("submit",`#${nameForm}`, function (event) {
            let dataToServer: any = [];
            let data = {};

            event.preventDefault();
            // let data = $(this).serialize();
            if ($(event.target).is(`form#${nameForm}`)) {

                $.each($(event.target.children).find("input"), function() {
                    data = {};
                    // console.log("type is " + $(this).attr("type") + " value is " + $(this).val());
                    // console.log($(this));

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
                // console.log(JSON.stringify(dataToServer));
                console.log(dataToServer);
            }

        });
        $("body").bind("keyup", `#${nameForm}`, function(event) {
            // console.log(event.key)
        })
    });

});
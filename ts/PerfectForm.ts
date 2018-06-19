class PerfectForm {
    private _nameForm: string;
    private _placeForm: any;

    constructor(nameForm: string, placeForm: any) {
        this._nameForm = nameForm;
        this._placeForm = placeForm;
    }

    public includeForm(): any {
        $.ajax({
            type: 'post',
            url: '../php/main.php',
            data: `&nameForm=${this._nameForm}`,
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
}

$(document).ready(function() {

    $("[data-pf-open]").click(function() {
        let nameForm = $(this).data("pfName");
        let placeForForm = '[data-pf-place="${nameForm}"]';

        let pf = new PerfectForm(nameForm, placeForForm);
        pf.includeForm();

        $("body").unbind("submit");
        $("body").bind("submit",`#${nameForm}`, function (event) {
            event.preventDefault();
            console.log("form submited");
        });
    });



    // $("body").bind("submit", function(e) {
    //     e.preventDefault();
    //
    //     // $("#bsForm").submit(function(e) {
    //     //     e.preventDefault();
    //     //     console.log($(this).attr("id"));
    //     // });
    //
    // });
    // $("#bsForm").bind("submit", function(e) {
    //     e.preventDefault();
    //     console.log($(this));
    // });
});
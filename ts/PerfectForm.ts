class PerfectForm {
    private nameForm:string;

    constructor(_nameForm: string) {
        this.nameForm = _nameForm;
    }
}

$(document).ready(function() {

    $("#openForm").click(function() {
        let nameForm = $(this).data("pfName");

        $.ajax({
            type: 'post',
            url: '../php/main.php',
            data: '&hi=hi',
            dataType: 'json',
            success: function(response) {
                console.log(response);
            },
            error: function(jqXHR) {
                console.log(jqXHR);
            }


        })
        // $("[data-pf-place]").html();
    })
});
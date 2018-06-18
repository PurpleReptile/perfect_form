"use strict";
var PerfectForm = /** @class */ (function () {
    function PerfectForm(_nameForm) {
        this.nameForm = _nameForm;
    }
    return PerfectForm;
}());
$(document).ready(function () {
    $("#openForm").click(function () {
        var nameForm = $(this).data("pfName");
        $.ajax({
            type: 'post',
            url: '../php/main.php',
            data: '&hi=hi',
            dataType: 'json',
            success: function (response) {
                console.log(response);
            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
        // $("[data-pf-place]").html();
    });
});

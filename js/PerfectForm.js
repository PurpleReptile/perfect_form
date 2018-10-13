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
    constructor(nameForm) {
        this.typeRequestIncludeForm = "includeForm";
        this.typeRequestSendMsg = "sendMessage";
        this.urlScript = '../php/main.php';
        this.nameForm = nameForm;
        this.urlPage = "";
        this.reCAPTCHA = "";
        this.dataToServer = {};
        this.dataFields = {};
    }
    set setDataFields(data) {
        this.dataFields = data;
    }
    set setUrlPage(url) {
        this.urlPage = url;
    }
    set setRECAPTCHA(reCAPTCHA) {
        this.reCAPTCHA = reCAPTCHA;
    }
    set setModalWindow(isModal) {
        this.isModalWindow = isModal;
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
        if (response.status == "success") {
            let modal = {};
            let formContainer = {};
            let btnClose = {};
            modal = document.createElement("div");
            formContainer = document.createElement("div");
            formContainer.classList.add("pf-container");
            formContainer.innerHTML = '<span class="btn-close">x</span>' + response.form;
            modal.classList.add("pf-modal");
            modal.setAttribute("id", `pf-modal-${response.nameForm}`);
            modal.appendChild(formContainer);
            document.body.appendChild(modal);
            $(`#pf-modal-${response.nameForm}`).hide().fadeIn();
            btnClose = modal.getElementsByClassName("btn-close")[0];
            $.datetimepicker.setLocale('ru');
            $('#datetimepicker').datetimepicker({
                format: 'd/m/Y H:i',
                formatDate: 'd.m.y',
                formatTime: 'H:i',
                step: 5
            });
            btnClose.onclick = function () {
                $(`#pf-modal-${response.nameForm}`).fadeOut(function () {
                    modal.remove();
                    if (document.getElementsByClassName("xdsoft_datetimepicker")[0])
                        document.getElementsByClassName("xdsoft_datetimepicker")[0].remove();
                });
            };
            window.onclick = function (event) {
                if (event.target == modal) {
                    $(`#pf-modal-${response.nameForm}`).fadeOut(function () {
                        modal.remove();
                        if (document.getElementsByClassName("xdsoft_datetimepicker")[0])
                            document.getElementsByClassName("xdsoft_datetimepicker")[0].remove();
                    });
                }
            };
        }
        else {
            console.log("Не удалось подключить форму");
            console.log(response.msg);
        }
        console.log(response);
    }
    includeFormError(jqXHR) {
        console.log(jqXHR);
    }
    sendDataToServer() {
        let formData = new FormData();
        let data = {};
        let ownerInfo = {};
        let numberOfFiles = 0;
        $.each(this.dataFields, function (ind, val) {
            if (this.type === "file") {
                numberOfFiles = this.files.length;
                formData.append("numberOfFiles", numberOfFiles);
                if (numberOfFiles > 1) {
                    for (let indFile = 0; indFile < numberOfFiles; indFile++)
                        formData.append("file[]", this.files[indFile]);
                }
                else
                    formData.append("file", this.files[0]);
            }
            else
                data[this.nameField] = {
                    "type": this.type,
                    "value": this.value,
                    "required": this.required,
                    "nameField": this.nameField
                };
        });
        ownerInfo = {
            "nameForm": this.nameForm,
            "urlPage": this.urlPage
        };
        formData.append("data", JSON.stringify(data));
        formData.append("ownerInfo", JSON.stringify(ownerInfo));
        formData.append("typeRequest", this.typeRequestSendMsg);
        formData.append("isModalWindow", this.isModalWindow);
        if (this.reCAPTCHA)
            formData.append("reCAPTCHA", this.reCAPTCHA);
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: formData,
            contentType: false,
            processData: false,
            success: this.sendDataToServerSuccess,
            error: this.sendDataToServerError,
        });
    }
    sendDataToServerSuccess(resp) {
        let response = JSON.parse(resp);
        let nameForm = response.nameForm;
        let lenElem = 0;
        let listFiles = [];
        let listParams = [];
        let currElem = {};
        switch (response.status) {
            case "success":
                let idForm = response.nameForm;
                let form = {};
                if (response.isModalWindow) {
                    idForm = `pf-modal-${response.nameForm}`;
                    form = document.getElementById(idForm);
                    $(`#${idForm}`).fadeOut(function () {
                        form.remove();
                        if (document.getElementsByClassName("xdsoft_datetimepicker")[0])
                            document.getElementsByClassName("xdsoft_datetimepicker")[0].remove();
                    });
                }
                else {
                    form = document.getElementById(idForm);
                    form.reset();
                    lenElem = form.elements.length;
                    for (let ind = 0; ind < lenElem; ind++) {
                        if (form[ind].type !== "submit") {
                            form[ind].removeAttribute("value");
                            form[ind].classList.remove("valid");
                        }
                        form[ind].parentElement.classList.remove("error");
                        let exampElem = form[ind].parentElement.getElementsByClassName("example")[0];
                        if (exampElem)
                            form[ind].parentElement.removeChild(exampElem);
                    }
                }
                swal({
                    title: 'Отправка сообщения',
                    text: 'Ваше сообщение было успешно отправлено.',
                    type: 'success',
                    confirmButtonText: 'Ок'
                });
                break;
            case "error":
                let warnMsg = "";
                let textSweetAlert = "";
                let listErrFields = [];
                let listRequiredFields = [];
                let counterErrorsFields = 0;
                nameForm = response.nameForm;
                if (nameForm) {
                    let form = document.getElementById(nameForm);
                    lenElem = form.elements.length;
                    for (let ind = 0; ind < lenElem; ind++) {
                        form[ind].parentElement.classList.remove("error");
                        let exampElem = form[ind].parentElement.getElementsByClassName("example")[0];
                        if (exampElem)
                            form[ind].parentElement.removeChild(exampElem);
                    }
                }
                if (response.errors.hasOwnProperty("checkbox")) {
                    textSweetAlert = `Согласитесь, пожалуйста, с тем, что Вы против всех.`;
                }
                if (response.errors.hasOwnProperty("input")) {
                    counterErrorsFields = 0;
                    response.errors.input.forEach(function (item, val, response, errors, input) {
                        listErrFields.push(item.name);
                        warnMsg += `${item.name} `;
                        let tagAboutError = document.createElement("span");
                        tagAboutError.innerHTML = `Пример: ${item.example}`;
                        tagAboutError.classList.add("example");
                        currElem = document.getElementById(nameForm);
                        currElem = currElem.querySelector(`[data-pf-field=${item.name}]`).parentElement;
                        currElem.classList.add("error");
                        currElem.appendChild(tagAboutError);
                        counterErrorsFields++;
                    });
                    textSweetAlert = `Ваше сообщение не может быть отправлено, так как 
                        ${(counterErrorsFields > 1) ? `поля <b>[${warnMsg}]</b> заполнены` : `поле <b>${warnMsg}</b> заполнено`} некорректно.`;
                }
                if (response.errors.hasOwnProperty("required")) {
                    response.errors.required.forEach((item, val, response, errors, required) => {
                        let tagAboutError = document.createElement("span");
                        tagAboutError.classList.add("example");
                        tagAboutError.innerHTML = "Это поле обязательно к заполнению";
                        currElem = document.getElementById(nameForm);
                        currElem = currElem.querySelector(`[data-pf-field=${item}`).parentElement;
                        currElem.classList.add("error");
                        currElem.appendChild(tagAboutError);
                    });
                    textSweetAlert = `Ваше сообщение не может быть отправлено, так как не все обязательные поля заполнены`;
                }
                if (response.errors.hasOwnProperty("files")) {
                    listFiles = response.errors.files.listFiles;
                    listParams = response.errors.files.params;
                    listFiles.forEach((item) => {
                        if (item.errors.length > 0) {
                            warnMsg += `<br>В файле <b>${item.name}</b>:`;
                            warnMsg += `<ul>`;
                            item.errors.forEach((itemError, valError, item, errors) => {
                                if (itemError.type === "extension")
                                    warnMsg += `<li>Ошибка расширения файла (текущее <b>${itemError.value}</b>).</li>`;
                                if (itemError.type === "size") {
                                    let currSize = itemError.value;
                                    currSize /= 1024 / 1024;
                                    warnMsg += `<li>Превышен допустимый размер файла (текущий <b>${Math.round((currSize * 100) / 100)} Мб)</b>.</li>`;
                                }
                            });
                            warnMsg += `</ul>`;
                        }
                    });
                    warnMsg += "</br> Доступные расширения: <b>[ ";
                    listParams.extension.forEach((item) => {
                        warnMsg += `${item} `;
                    });
                    warnMsg += "]</b>";
                    warnMsg += `</br>Максимальный размер файла: <b>${listParams.size / 1024 / 1024} Мб</b>`;
                    textSweetAlert = `Ваше сообщение не может быть отправлено, так как в файлах найдены следующие ошибки: ${warnMsg}`;
                }
                if (response.errors.hasOwnProperty("reCaptcha")) {
                    textSweetAlert = `Ваше сообщение не может быть отправлено, так как Вы - Терминатор.`;
                }
                if (textSweetAlert) {
                    swal({
                        title: 'Отправка сообщения',
                        html: textSweetAlert,
                        type: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
                break;
        }
    }
    sendDataToServerError(jqXHR) {
        console.log(jqXHR);
    }
}
$(function () {
    let nameForm = "";
    $("[data-pf-open]").click(function () {
        let nameForm = $(this).data("pfOpen");
        if (nameForm)
            generalMagic(nameForm, "modal");
    });
    if (document.querySelector("[data-pf-form]")) {
        nameForm = document.querySelector("[data-pf-form]").getAttribute("id");
        generalMagic(nameForm);
    }
    function generalMagic(nameForm, typeForm = "") {
        let captchaExist = false;
        let pf = new PerfectForm(nameForm);
        if (typeForm === "modal")
            pf.includeForm();
        $("body").unbind("submit");
        $("body").unbind("click");
        updateCaptcha(pf, nameForm);
        $("body").bind("click", `#${nameForm}`, function (event) {
            let fieldsForm = document.querySelectorAll("[data-pf-field]");
            fieldsForm.forEach(function (item, num, pfFields) {
                item.onfocus = function () {
                    if (item.value !== "")
                        item.classList.add("valid");
                    else
                        item.classList.remove("valid");
                };
                item.onblur = function () {
                    if (item.value !== "")
                        item.classList.add("valid");
                    else
                        item.classList.remove("valid");
                };
            });
        });
        $("body").bind("submit", `#${nameForm}`, function (event) {
            let data = [];
            let dataElem = [];
            let found = false;
            event.preventDefault();
            updateCaptcha(pf, nameForm);
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
                            if (prepareField($(item), "email") !== false) {
                                dataElem = prepareField($(item), "email");
                                found = true;
                            }
                            break;
                        case "file":
                            if (prepareFieldFile($(item)) !== false) {
                                dataElem = prepareFieldFile($(item));
                                found = true;
                            }
                            break;
                        case "checkbox":
                            if (prepareFieldCheckbox($(item)) !== false) {
                                dataElem = prepareFieldCheckbox($(item));
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
                    pf.setUrlPage = window.location.href;
                    pf.setModalWindow = (typeForm !== "") ? true : false;
                    pf.sendDataToServer();
                }
            }
        });
        $("body").bind("click", `#${nameForm}`, function (event) {
            let elem = $(event.target)[0];
            if (elem.localName === "input" && elem.type === "checkbox") {
                if (elem.checked)
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", false);
                else
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", true);
            }
        });
    }
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
        if (elem) {
            return {
                type: typeField,
                value: elem.val(),
                required: elem.attr("required") ? true : false,
                nameField: elem.attr("data-pf-field")
            };
        }
        return false;
    }
    function prepareFieldFile(elem) {
        if ($(elem)[0].files) {
            if (($(elem)[0].files.length) > 0) {
                return {
                    type: "file",
                    files: elem[0].files,
                    nameField: "files"
                };
            }
        }
        return false;
    }
    function prepareFieldCheckbox(elem) {
        if (elem) {
            return {
                type: "checkbox",
                value: elem[0].checked,
                nameField: elem.attr("data-pf-field")
            };
        }
        return false;
    }
    function emptyField(item) {
        if (item.value !== "")
            item.classList.add("valid");
        else
            item.classList.remove("valid");
    }
    function updateCaptcha(pf, nameForm) {
        grecaptcha.ready(function () {
            grecaptcha.execute('6LeNyHIUAAAAAEX7wD_srG8r17k67OOPZJwZKFjn', { action: 'homepage' }).then(function (token) {
                let form = document.getElementById(nameForm);
                if (form) {
                    if (form.querySelector('[data-pf-field="recaptcha"]') !== null) {
                        form.querySelector('[data-pf-field="recaptcha"]').value = token;
                        pf.setRECAPTCHA = token;
                    }
                }
            });
        });
    }
});

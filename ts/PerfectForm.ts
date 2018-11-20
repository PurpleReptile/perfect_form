class Validation {

    readonly regexpEmail= /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    readonly regexpFirstname = /^\W{2,}$/;
    readonly regexpLastname = /W/;
    readonly regexpFullname = /W/;
    readonly regexpPhone = /^[\d|\s|\-]*$/;
    readonly regexpDate = /W/;

    private nameForm: string;
    private nameField: string;
    private valueField: string;
    private exampleCorrectField: string;

    constructor(nameForm: string, nameField: string, valueField: string) {
        this.nameForm = nameForm;
        this.nameField = nameField;
        this.valueField = valueField;
        this.exampleCorrectField = "";
    }

    get getExpCorrectField(): any {
        return this.exampleCorrectField;
    }

    public validation(): any {
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

    readonly typeRequestIncludeForm = "includeForm";
    readonly typeRequestSendMsg = "sendMessage";
    readonly typeRequestCheckFiles = "checkFiles";
    readonly urlScript = '../php/main.php';

    private nameForm: string;           /** @var - name form */
    private dataToServer: object;       /** @var - data for sending to the server */
    private dataFields: object;         /** @var - data of fields */
    private reCAPTCHA: string;          /** @var - google reCAPTCHA v3 */
    private isModalWindow: boolean;     /** @var - check is modal window */

    // info for owner
    private urlPage: string;            /** @var - url-form */
    private orderInfo: string;          /** @var - info about order */

    set setDataFields(data: any) { this.dataFields = data; }
    set setUrlPage(url: string) { this.urlPage = url; }
    set setOrderInfo(info: string) { this.orderInfo = info; }
    set setRECAPTCHA(reCAPTCHA: string) { this.reCAPTCHA = reCAPTCHA; }
    set setModalWindow(isModal: boolean) { this.isModalWindow = isModal; }

    constructor(nameForm: string) {
        this.nameForm = nameForm;
        this.urlPage = "";
        this.orderInfo = "";

        this.reCAPTCHA = "";
        this.isModalWindow = false;

        this.dataToServer = {};
        this.dataFields = {};
    }

    public includeForm(): any {
        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: `&nameForm=${this.nameForm}&typeRequest=${this.typeRequestIncludeForm}`,
            dataType: 'json',
            success: this.includeFormSuccess,
            error: this.errorResponse,
        });
    }

    private includeFormSuccess(response: any): any {
        if (response.status == "success") {
            let btnClose: any = {};
            let pfModalId: string = `pf-modal-${response.nameForm} #datetimepicker`;

            let modal = document.createElement("div");
            let formContainer = document.createElement("div");

            formContainer.classList.add("pf-container");
            formContainer.innerHTML = '<span class="btn-close">x</span>' + response.form;

            modal.classList.add("pf-modal");
            modal.setAttribute("id", `pf-modal-${response.nameForm}`);
            modal.appendChild(formContainer);
            document.body.appendChild(modal);
            $(`#${pfModalId}`).hide().fadeIn();

            btnClose = modal.getElementsByClassName("btn-close")[0];

            // include datetimepicker
            $.datetimepicker.setLocale('ru');
            $(`#${pfModalId}`).datetimepicker({
                format: 'd/m/Y H:i',
                formatDate: 'd.m.y',
                formatTime: 'H:i',
                step: 30
            });

            btnClose.onclick = function() {
                $(`#pf-modal-${response.nameForm}`).fadeOut(function() {
                    modal.nextSibling.remove();
                    modal.remove();
                    $(`#${pfModalId}`).datetimepicker('destroy');
                });
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    $(`#pf-modal-${response.nameForm}`).fadeOut(function() {
                        modal.nextSibling.remove();
                        modal.remove();
                        $(`#${pfModalId}`).datetimepicker('destroy');
                    });
                }
            }
        }
        else {
            console.log("Не удалось подключить форму");
            console.log(response.msg);
        }
        console.log(response);
    }

    public sendDataToServer(): any {

        let formData = new FormData();
        let data: any = {};
        let ownerInfo: any;
        let numberOfFiles: number = 0;

        $.each(this.dataFields, function(ind: number, val: any) {
            if (this.type === "file") {
                numberOfFiles = this.files.length;
                formData.append("numberOfFiles", numberOfFiles);

                if (numberOfFiles > 1) {
                    for (let indFile = 0; indFile < numberOfFiles; indFile++)
                        formData.append("file[]", this.files[indFile]);

                } else
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
            "urlPage": this.urlPage,
            "order": this.orderInfo,
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
            error: this.errorResponse,
        });
    }

    private sendDataToServerSuccess(resp: any): any {
        let response = JSON.parse(resp);
        let nameForm: string = response.nameForm;
        let lenElem: number = 0;
        let listFiles: any = [];
        let listParams: any = [];
        let currElem: any = {};

        switch (response.status) {
            case "success":
                let idForm = response.nameForm;
                let form: any = {};
                let inpFile = document.querySelector(`#${response.nameForm} input[type="file"]`);
                let parentElemInpFile = inpFile.parentNode.parentNode;

                if (response.isModalWindow) {
                    idForm = `pf-modal-${response.nameForm}`;
                    form = document.getElementById(idForm);

                    $(`#${idForm}`).fadeOut(function () {
                        form.remove();
                        if (document.getElementsByClassName("xdsoft_datetimepicker")[0])
                            document.getElementsByClassName("xdsoft_datetimepicker")[0].remove();
                    });
                } else {
                    form = document.getElementById(idForm);
                    form.reset();

                    // remove all elements with class errors
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

                    // remove all elements for file upload
                    parentElemInpFile = inpFile.parentNode.parentNode;
                    while (parentElemInpFile.childNodes.length > 2) {
                        parentElemInpFile.removeChild(parentElemInpFile.lastChild);
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
                let warnMsg: string = "";
                let textSweetAlert: string = "";
                let listErrFields: any = [];
                let listRequiredFields: any = [];
                let counterErrorsFields: number = 0;

                nameForm = response.nameForm;

                // remove all elements with class errors
                if (nameForm) {
                    let form: any = document.getElementById(nameForm);
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

                // add error message about invalid fields
                if (response.errors.hasOwnProperty("input")) {
                    counterErrorsFields = 0;

                    response.errors.input.forEach(function (item: any, val: number, response.errors.input) {
                        listErrFields.push(item.name);
                        warnMsg += `${item.name} `;

                        let tagAboutError = document.createElement("span");
                        tagAboutError.innerHTML =  `Пример: ${item.example}`;
                        tagAboutError.classList.add("example");

                        currElem = document.getElementById(nameForm);
                        currElem = currElem.querySelector(`[data-pf-field=${item.name}]`).parentElement;
                        currElem.classList.add("error");
                        currElem.appendChild(tagAboutError);

                        counterErrorsFields++;
                    });

                    textSweetAlert = `Ваше сообщение не может быть отправлено, так как 
                        ${ (counterErrorsFields > 1) ? `поля <b>[${warnMsg}]</b> заполнены` : `поле <b>${warnMsg}</b> заполнено` } некорректно.`;
                }

                // add error message about required fields
                if (response.errors.hasOwnProperty("required")) {

                    response.errors.required.forEach( (item: any, val: number, response.errors.required: any) => {
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

                // add error message about invalid files
                if (response.errors.hasOwnProperty("files")) {
                    // reference info
                    const limitFiles = response.reference.limit;
                    const maxSizeFiles = response.reference.maxSize / 1024 / 1024;
                    const listExtensionFiles = response.reference.extensions.join(', ');

                    let counterFiles = document.createElement("span");
                    let infoAboutFiles = document.createElement('ol');
                    let filesReference = document.createElement("div");

                    let inpFile = document.querySelector(`#${response.nameForm} input[type="file"]`);
                    let parentElemInpFile = inpFile.parentNode.parentNode;

                    counterFiles.textContent = ` файлов - ${response.reference.numberOfFiles}`;

                    switch (response.status) {
                        case "success":
                            response.listFiles.forEach((file: any) => {
                                infoAboutFiles.innerHTML += `<li class="valid">Файл ${file.name} успешно загружен!</li>`;
                            });
                            break;

                        case "error":
                            const textErrorExtenstion = "неверное расширение";
                            const textErrorSize = `размер больше ${maxSizeFiles} Мб`;
                            let error: number = 0;

                            if (response.errors.hasOwnProperty("limitFiles")) {
                                infoAboutFiles.innerHTML = `<p class="invalid">Превышен лимит загружаемых файлов!</p>`;

                            } else {
                                let isFind = false;
                                // get list files with errors
                                response.listFiles.forEach((file: any) => {
                                    isFind = false;
                                    response.errors.files.forEach((elem: any) => {
                                        if (elem["name"] === file.name) {
                                            isFind = true;
                                            return;
                                        }
                                    });

                                    if (isFind === false)
                                        infoAboutFiles.innerHTML += `<li class="valid">Файл ${file.name} успешно загружен!</li>`;
                                });

                                response.errors.files.forEach((descError: any) => {
                                    error = 0;
                                    descError.errors.forEach((typeError: any) => {
                                        if (typeError.type === "extension") error += 1;
                                        if (typeError.type === "size") error += 2;
                                    });

                                    switch (error) {
                                        case 1:
                                            infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorExtenstion}.</li>`;
                                            break;

                                        case 2:
                                            infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorSize}.</li>`;
                                            break;

                                        case 3:
                                            infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorExtenstion}, ${textErrorSize}.</li>`;
                                            break;
                                    }
                                });
                            }
                            break;
                    }

                    filesReference.innerHTML += `
                                <div class="reference">
                                    <p>Максимально файлов: ${limitFiles}</p>
                                    <p>Расширения: ${listExtensionFiles}</p>
                                    <p>Размер: <${maxSizeFiles}Мб</p>
                                </div>`;

                    // remove old elements from front-end
                    while (parentElemInpFile.childNodes.length > 2) {
                        parentElemInpFile.removeChild(parentElemInpFile.lastChild);
                    }

                    // add new elements to front-end
                    parentElemInpFile.insertBefore(counterFiles, inpFile.nextSibling);
                    parentElemInpFile.insertBefore(infoAboutFiles, inpFile.nextSibling);
                    parentElemInpFile.insertBefore(filesReference, inpFile.nextSibling);
                }

                // add error message about reCAPTCHA
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
        // console.log(response);
    }

    public checkFiles(): any {
        let formData = new FormData();
        let numberOfFiles = 0;

        $.each(this.dataFields, function(ind: number, val: any) {
            if (this.type === "file") {
                numberOfFiles = this.files.length;
                formData.append("numberOfFiles", numberOfFiles);

                if (numberOfFiles > 1) {
                    for (let indFile = 0; indFile < numberOfFiles; indFile++)
                        formData.append("file[]", this.files[indFile]);

                } else
                    formData.append("file", this.files[0]);
            }
        });

        formData.append("nameForm", this.nameForm);
        formData.append("typeRequest", this.typeRequestCheckFiles);

        $.ajax({
            type: 'post',
            url: this.urlScript,
            data: formData,
            contentType: false,
            processData: false,
            success: this.checkFilesSuccess,
            error: this.errorResponse,
        });
    }

    private checkFilesSuccess(resp: any): any {
        let response = JSON.parse(resp);

        // reference info
        const limitFiles = response.reference.limit;
        const maxSizeFiles = response.reference.maxSize / 1024 / 1024;
        const listExtensionFiles = response.reference.extensions.join(', ');

        let counterFiles = document.createElement("span");
        let infoAboutFiles = document.createElement('ol');
        let filesReference = document.createElement("div");

        let parentElemInpFile;
        let inpFile;

        counterFiles.textContent = ` файлов - ${response.reference.numberOfFiles}`;

        switch (response.status) {
            case "success":
                response.listFiles.forEach((file: any) => {
                    infoAboutFiles.innerHTML += `<li class="valid">Файл ${file.name} успешно загружен!</li>`;
                });
                break;

            case "error":
                const textErrorExtenstion = "неверное расширение";
                const textErrorSize = `размер больше ${maxSizeFiles} Мб`;
                let error: number = 0;

                if (response.errors.hasOwnProperty("limitFiles")) {
                    infoAboutFiles.innerHTML = `<p class="invalid">Превышен лимит загружаемых файлов!</p>`;

                } else {
                    let isFind = false;
                    // get list files with errors
                    response.listFiles.forEach((file: any) => {
                        isFind = false;
                        response.errors.files.forEach((elem: any) => {
                            if (elem["name"] === file.name) {
                                isFind = true;
                                return;
                            }
                        });

                        if (isFind === false)
                            infoAboutFiles.innerHTML += `<li class="valid">Файл ${file.name} успешно загружен!</li>`;
                    });

                    response.errors.files.forEach((descError: any) => {
                        error = 0;
                        descError.errors.forEach((typeError: any) => {
                            if (typeError.type === "extension") error += 1;
                            if (typeError.type === "size") error += 2;
                        });

                        switch (error) {
                            case 1:
                                infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorExtenstion}.</li>`;
                                break;

                            case 2:
                                infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorSize}.</li>`;
                                break;

                            case 3:
                                infoAboutFiles.innerHTML += `<li class="invalid">Файл ${descError.name}: ${textErrorExtenstion}, ${textErrorSize}.</li>`;
                                break;
                        }
                    });
                }
                break;
        }

        filesReference.innerHTML += `
            <div class="reference">
                <p>Максимально файлов: ${limitFiles}</p>
                <p>Расширения: ${listExtensionFiles}</p>
                <p>Размер: <${maxSizeFiles}Мб</p>
            </div>`;


        inpFile = document.querySelector(`#${response.nameForm} input[type="file"]`);

        // remove old elements from front-end
        parentElemInpFile = inpFile.parentNode.parentNode;
        while (parentElemInpFile.childNodes.length > 2) {
            parentElemInpFile.removeChild(parentElemInpFile.lastChild);
        }

        // add new elements to front-end
        parentElemInpFile.insertBefore(counterFiles, inpFile.nextSibling);
        parentElemInpFile.insertBefore(infoAboutFiles, inpFile.nextSibling);
        parentElemInpFile.insertBefore(filesReference, inpFile.nextSibling);
    }

    private errorResponse(jqXHR: any): any {
        console.log(jqXHR);
    }
}

$(function () {

    // add magic for the modal form
    $("[data-pf-open]").click(function () {
        let nameForm: string = $(this).data("pfOpen");
        let btnOpen: HTMLInputElement = event.target as HTMLInputElement;

        if (nameForm)
            generalMagic(nameForm, true, btnOpen);
    });

    // add magic for the form
    if (document.querySelector("[data-pf-form]")) {
        let nameForm: string = (document.querySelector("[data-pf-form]") as HTMLDivElement).getAttribute("id");
        generalMagic(nameForm);
    }

    function generalMagic(nameForm: string, isModal: boolean = false, btnOpen = {}) {
        let pf: PerfectForm = new PerfectForm(nameForm);

        if (isModal === true)
            pf.includeForm();

        $("body").unbind("submit");     // delete old bind "submit form"
        $("body").unbind("click");      // delete old bind "validation fields"

        pf.setRECAPTCHA = updateCaptcha(nameForm);    // set google reCAPTCHA

        $("body").bind("click", `#${nameForm}`, function (event: any) {

            let fieldsForm = document.querySelectorAll("[data-pf-field]");

            fieldsForm.forEach(function(item: any, num: number, pfFields) {
                item.onfocus = function() {
                    if (item.value !== "")
                        item.classList.add("valid");
                    else
                        item.classList.remove("valid");
                };
                item.onblur = function() {
                    if (item.value !== "")
                        item.classList.add("valid");
                    else
                        item.classList.remove("valid");
                };
            });
        });

        // sending data to server
        $("body").bind("submit", `#${nameForm}`, function (event: any) {
            let data: any = [];
            let dataElem: any = [];
            let found: boolean = false;

            event.preventDefault();
            pf.setRECAPTCHA = updateCaptcha(nameForm);    // set google reCAPTCHA

            if ($(event.target).is(`form#${nameForm}`)) {

                $.each($(event.target.children).find("input"), function (ind, item) {
                    found = false;

                    switch ($(this).attr('type')) {
                        case "text":
                            let typeField: string = ($(item).attr('data-pf-field') == "date") ? "date" : "text";

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
                            if (prepareFieldFile(item) !== false) {
                                dataElem = prepareFieldFile(item);
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
                }

                if (! $.isEmptyObject(data)) {
                    pf.setDataFields = data;
                    pf.setModalWindow = isModal;

                    // set info about order
                    if (isModal && btnOpen.dataset.hasOwnProperty('orderInfo'))
                        pf.setOrderInfo = btnOpen.dataset.orderInfo;

                    pf.setUrlPage = window.location.href;

                    pf.sendDataToServer();
                }
            }
        });

        // change checkbox
        $("body").bind("click",  `#${nameForm}`, function (event: any) {

            let elem = $(event.target)[0];

            // click checkbox
            if (elem.localName === "input" && elem.type === "checkbox") {
                if (elem.checked)
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", false);
                else
                    $(`form#${nameForm}`).find('[type="submit"]').attr("disabled", true);
            }
        });

        $("body").bind("change", `#${nameForm}`, function (event: any) {
            let elem = $(event.target)[0];
            let data = [];

            // change upload file
            if (elem.type === "file") {
                if (prepareFieldFile(elem) !== false) {
                    data.push(prepareFieldFile(elem));
                    pf.setDataFields = data;
                    pf.checkFiles();
                }
            }
        })
    }

    // TODO: to reliaze validation fields on the fly
    /**
     * @method validation fields on the fly
     * @param nameForm - name form
     * @param nameField - name field for validation
     * @param valueField - value filed
     */
    function validationForm(nameForm: any, nameField: string, valueField: string) {
        let valid: Validation;
        let expCorrectField: string;

        valid= new Validation(nameForm, nameField, valueField);

        if (valid.validation()) {

        } else {
            // expCorrectField = valid.getExpCorrectField();
            // $(nameField).
        }
    }

    /**
     * @method - prepare data from fields (text field)
     * @param elem - element of object
     * @param typeField - type field
     */
    function prepareField(elem: any, typeField: string) {
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

    /**
     * @method -  prepare data from fields (file field)
     * @param elem - element of object
     */
    function prepareFieldFile(elem: any) {
        if (elem.files) {
            if ((elem.files.length) > 0) {
                return {
                    type: "file",
                    files: elem.files,
                    nameField: "files"
                };
            }
        }
        return false;
    }

    /**
     * @method -  prepare data from fields (checkbox field)
     * @param elem - element of object
     */
    function prepareFieldCheckbox(elem: any) {
        if (elem) {
            return {
                type: "checkbox",
                value: elem[0].checked,
                nameField: elem.attr("data-pf-field")
            }
        }
        return false;
    }

    function emptyField(item: HTMLInputElement) {
        if (item.value !== "")
            item.classList.add("valid");
        else
            item.classList.remove("valid");
    }

    function updateCaptcha(nameForm: string) {
        grecaptcha.ready(function() {
            grecaptcha.execute('6LeNyHIUAAAAAEX7wD_srG8r17k67OOPZJwZKFjn', {action: 'homepage'}).then(function(token: string) {
                let form = document.getElementById(nameForm);
                if (form) {
                    if (form.querySelector('[data-pf-field="recaptcha"]') !== null) {
                        (form.querySelector('[data-pf-field="recaptcha"]') as HTMLInputElement).value = token;
                        return token;
                    }
                }
            });
        });
        return "";
    }


});




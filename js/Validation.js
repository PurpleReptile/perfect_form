"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validation {
    constructor(nameForm, nameField, valueField) {
        this.regexpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.regexpFirstname = /^\W{2,}$/;
        this.regexpLastname = /W/;
        this.regexpFullname = /W/;
        this.regexpPhone = /^[\d|\s|\-]*$/;
        this.regexpDate = /W/;
        this.nameForm = nameForm;
        this.nameField = nameField;
        this.valueField = valueField;
        this.exampleCorrectField = "";
    }
    get getExmpCorrectField() {
        return this.exampleCorrectField;
    }
    validation() {
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
exports.Validation = Validation;

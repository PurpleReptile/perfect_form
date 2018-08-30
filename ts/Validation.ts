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

    get getExmpCorrectField(): any {
        return this.exampleCorrectField;
    }

    public validation(): any {

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

export { Validation }
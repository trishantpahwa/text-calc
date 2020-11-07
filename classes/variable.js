class variable {

    name;
    value;

    constructor(variableName) {
        this.name = variableName;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

module.exports = variable;
var endOfLine = require('os').EOL;
const variable = require('./variable');
var arithmeticExpression = require('./arithmeticExpression');

class input {

    constructor() {
        this.contents = '';
        this.commands = [];
        this.storedVariables = [];
    }

    addContents(contents) {
        this.contents = contents;
        this.addCommands();
    }

    addCommands() {
        this.commands  = this.contents.split(endOfLine);
        var cmds = [];
        if(this.commands[0] == 'input:') {
            this.commands.shift();
            this.commands.forEach(function(command) {
                var commandVariables = command.match(/([a-zA-Z_$][a-zA-Z_$0-9]*)/gm);
                var assignmentVariable = commandVariables[0];
                var lhs = command.split('=')[0];
                var rhs = command.split('=')[1];
                if(lhs.split('')[lhs.length-1] != ' ') {
                    rhs = assignmentVariable + ' ' + lhs.split('')[lhs.length-1] + rhs;
                    lhs = lhs.split('').slice(0, -1).join('');
                } else {
                    rhs = rhs.trim(' ');
                }
                lhs = lhs.trim('');
                rhs = rhs.trim('');
                command = lhs + '=' + rhs;
                cmds.push(command);
            });
            this.commands = cmds;
            return true;
        } else {
            return false;
        }
    }

    findOutput() {
        for(var i=0;i<this.commands.length;i++) {
            this.getVariables(this.commands[i]);
        }
    }

    getVariables(command) {
        var cmd = command.split('=');
        if(this.storedVariables.length > 0) {
            var names = [];
            for(var i=0;i<this.storedVariables.length;i++) {
                names.push(this.storedVariables[i].name);
            }
            if(!names.includes(cmd[0])) {
                this.storedVariables.push(new variable(cmd[0]));
            }
        } else {
            this.storedVariables.push(new variable(cmd[0]));
        }
        if(cmd[1].match(/([a-zA-Z_$][a-zA-Z_$0-9]*)/gm)) {
            var commandVariables = cmd[1].match(/([a-zA-Z_$][a-zA-Z_$0-9]*)/gm);
            var names = [];
            for(var i=0;i<this.storedVariables.length;i++) {
                names.push(this.storedVariables[i].name);
            }
            for(var i=0;i<commandVariables.length;i++) {
                if(names.includes(commandVariables[i])) {
                    if(cmd[1].match(/\+\+([a-zA-Z_$][a-zA-Z_$0-9]*)/gm)) {
                        var variables = cmd[1].match(/\+\+([a-zA-Z_$][a-zA-Z_$0-9]*)/gm);
                        for(var j=0;j<variables.length;j++) {
                            variables[j] = variables[j].split('').slice(2).join('');
                            if(names.includes(variables[j])) {
                                const tempVal = parseInt(this.storedVariables[names.indexOf(variables[j])].getValue());
                                this.storedVariables[names.indexOf(variables[j])].setValue((tempVal + 1).toString());
                            }
                        }
                        cmd[1] = cmd[1].replace(/\+\+/gm, '');
                        cmd[1] = cmd[1].replace(commandVariables[i], this.storedVariables[names.indexOf(commandVariables[i])].getValue());
                    } else if(cmd[1].match(/([a-zA-Z_$][a-zA-Z_$0-9]*)\+\+/gm)) {
                        var variables = cmd[1].match(/([a-zA-Z_$][a-zA-Z_$0-9]*)\+\+/gm);
                        cmd[1] = cmd[1].replace(/\+\+/gm, '');
                        for(var j=0;j<variables.length;j++) {
                            variables[j] = variables[j].split('').slice(0, -2).join('');
                            if(names.includes(variables[j])) {
                                cmd[1] = cmd[1].replace(commandVariables[i], this.storedVariables[names.indexOf(commandVariables[i])].getValue());
                                const tempVal = parseInt(this.storedVariables[names.indexOf(variables[j])].getValue());
                                this.storedVariables[names.indexOf(variables[j])].setValue((tempVal + 1).toString());
                            }
                        }
                    } else {
                        cmd[1] = cmd[1].replace(commandVariables[i], this.storedVariables[names.indexOf(commandVariables[i])].getValue());
                    }
                }
            }
            cmd[1] = cmd[1].split(' ').join('');
            const ae = new arithmeticExpression(cmd[1]);
            var val = ae.solve().toString();
            this.storedVariables[names.indexOf(cmd[0])].setValue(val);
        } else {
            cmd[1] = cmd[1].split(' ').join('');
            const ae = new arithmeticExpression(cmd[1]);
            var val = ae.solve().toString();
            this.storedVariables[this.storedVariables.length-1].setValue(val);
        }
    }
}

module.exports = input;
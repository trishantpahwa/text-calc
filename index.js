const fs = require('fs');
const input = require('./classes/input');
const args = Object.keys(require("args-parser")(process.argv));
const readline = require('readline');

if(args.length > 0) {
    args.forEach(function(arg) {
        const file = arg;
        var fileContents = fs.readFileSync(file).toString();
        input_ = new input();
        input_.addContents(fileContents);
        input_.findOutput();
        console.log(input_.storedVariables);
    });
} else {
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    r.on('close', function() {
        process.exit(0);
    });
    getExpression(r);
}

var variablesSet = new Set();
var expressions = [ ];

function getExpression(r) {
    r.question('Enter an expression: ', function(expression) {
        checkExpressionValidity(expression, r);
    });
}

function checkExpressionValidity(expression, r) {
    if(expression == '') {
        output();
        r.close();
    } else {
        var variables = expression.match(/([a-zA-Z_$][a-zA-Z_$0-9]*)/gm);
        if(variables) {
            var lhs = variables[0];
            variables.shift();
            if(variables.length > 0) {
                var flag = true;
                var notFound = [];
                variables.forEach(function(variable) {
                    if(!variablesSet.has(variable)) {
                        flag = false;
                        notFound.push(variable);
                    }
                });
                if(flag) {
                    expressions.push(expression);
                    variablesSet.add(lhs);
                } else {
                    console.log('The following variables were not defined before, in order to use them.');
                    console.log(notFound);
                }
            } else {
                if(expression.match(new RegExp("(^\\" + lhs + "\\s\\=\\s.*)|(^\\" + lhs + "\\s\\+\\=\\s.*)|(^\\" + lhs + "\\s\\-\\=\\s.*)|(^\\" + lhs + "\\s\\*\\=\\s.*)|(^\\" + lhs + "\\s\\/\\=\\s.*)", 'gm'))) {
                    expressions.push(expression);
                    variablesSet.add(lhs);
                } else {
                    console.log('There should be a black space, \\s between lhs and rhs.')
                }
            }
            getExpression(r);
        } else {
            console.log('Error: No variables found');
            getExpression(r);
        }
    }
}

function output() {
    expressions.unshift('input:');
    expressionsString = expressions.join('\r\n');
    input_ = new input();
    input_.addContents(expressionsString);
    input_.findOutput();
    console.log(input_.storedVariables);
}
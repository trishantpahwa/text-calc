class arithmeticExpression {

    expression = '';
    solution = null;
    stack = [];
    sign = '+';
    num = 0;

    constructor(expression) {
        this.expression = expression;
    }

    solve() {
        const expression = this.expression;
        const expressionArray = expression.split('');
        for(var i=0;i<expressionArray.length;i++) {
            var c = expressionArray[i];
            if(this.isDigit(c)) {
                this.num = this.num * 10 + parseInt(c);
            }
            if(c == '(') {
                var pCnt = 0;
                var end = 0;
                var clone = expressionArray.slice(i);
                while(end<clone.length) {
                    if(clone[end] == '(') {
                        pCnt += 1;
                    } else if(clone[end] == ')') {
                        pCnt -= 1;
                        if(pCnt == 0) {
                            break;
                        }
                    }
                    end += 1;
                }
                var tempAE = new arithmeticExpression(expressionArray.slice(i+1,i+end).join(''))
                this.num = tempAE.solve();
                i += end;
            }
            if((i + 1) == expressionArray.length || (c == '+' || c == '-' || c == '*' || c == '/')) {
                if(this.sign == '+') {
                    this.stack.push(this.num);
                } else if(this.sign == '-') {
                    this.stack.push(-this.num);
                } else if(this.sign == '*') {
                    this.stack[this.stack.length-1] = this.stack[this.stack.length-1] * this.num;
                } else if(this.sign == '/') {
                    this.stack[this.stack.length-1] = parseInt(this.stack[this.stack.length-1] / parseFloat(this.num));
                }
                this.sign = c;
                this.num = 0
            }
        }
        var sum = 0;
        this.stack.forEach(function(element) {
            sum += parseInt(element);
        });
        return sum;
    }

    isDigit(digit) {
        return /^\d+$/.test(digit);
    }
}

module.exports = arithmeticExpression;

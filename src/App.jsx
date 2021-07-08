import React from 'react';
import './scss/style.css';
import Display from './components/Display';
import ClearBtn from './components/ClearBtn';
import OperatorBtn from './components/OperatorBtn';
import NumBtn from './components/NumBtn';
import DecimalBtn from './components/DecimalBtn';
import EqualsBtn from './components/EqualsBtn';

class App extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            input: '0',
            equation: '',
        }

        this.handleClearBtnClick = this.handleClearBtnClick.bind(this);
        this.handleOperatorBtnClick = this.handleOperatorBtnClick.bind(this);
        this.handleNumBtnClick = this.handleNumBtnClick.bind(this);
        this.handleDecimalBtnClick = this.handleDecimalBtnClick.bind(this);
        this.handleEqualsBtnClick = this.handleEqualsBtnClick.bind(this);
    }

    handleClearBtnClick() {
        this.setState({
            input: '0',
            equation: '',
        });
    }

    handleOperatorBtnClick(event) {
        const operatorId = event.target.id;
        const symbolNames = {
            "divide": "/",
            "multiply": "x",
            "subtract": "-",
            "add": "+",
        }
        const operator = symbolNames[operatorId];

        this.setState((prevState) => {
            const prevInput = prevState.input;
            const prevEquation = prevState.equation;

            // If previous answer is not cleared take it as first number and insert operator after that
            // check whether already given a operator or not.
            // If already given, ols operator will replace by new operator.
            if (prevEquation === '' && prevInput !== '0' && !isNaN(prevInput)) {
                return {
                    input: operator,
                    equation: prevInput + operator,
                }
            } else if (['+', '-', 'x', '/', '.'].includes(prevInput[prevInput.length-1])) {
                return {
                    input: operator,
                    equation: prevEquation.slice(0, -1) + operator,
                }
            } else {
                return {
                    input: operator,
                    equation: prevEquation + operator,
                }
            }
        });
    }

    handleNumBtnClick(event) {
        const numberId = event.target.id;
        const numberNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const number = String(numberNames.indexOf(numberId));

        this.setState((prevState) => {
            const prevInput = prevState.input;
            const prevEquation = prevState.equation;

            // consider for entering minus value,
            // remove unnecessary zeroes and operators in the begining,
            // and combine digits for values that have more than one digit
            if (prevEquation === '-') {
                return ({
                    input: '-'+number,
                    equation: '-'+number,
                });
            } else if (prevEquation === '' || prevEquation === '0' || ['+', '-', 'x', '/'].includes(prevEquation)) {
                return ({
                    input: number,
                    equation: number,
                });
            } else if (prevInput === '0' || ['+', '-', 'x', '/'].includes(prevInput)) {
                return ({
                    input: number,
                    equation: prevEquation + number,
                });
            } else if (typeof(Number(prevInput)) === 'number') {
                return ({
                    input: prevInput + number,
                    equation: prevEquation + number,
                })
            } else {
                return ({
                    input: number,
                    equation: String(prevState.equation) + number,
                })
            }
        });
    }

    handleDecimalBtnClick() {
        
        this.setState((prevState) => {
            const prevInput = prevState.input;
            const prevEquation = prevState.equation;

            // replace decimal with unnecessary operators
            // and prevent accidentaly entering more than one decimal operator
            if (prevEquation === '-') {
                return {
                    input: '-0.',
                    equation: '-0.',
                }
            } else if (prevEquation === '' || ['+', 'x', '/'].includes(prevEquation)) {
                return {
                    input: '0.',
                    equation: '0.',
                }
            } else if (prevInput[prevInput.length-1] === '.') {
                return {
                    input: prevInput,
                    equation: prevEquation,
                }
            } else if (['+', '-', 'x', '/', '.'].includes(prevEquation[prevEquation.length-1])) {
                return {
                    input: '0.',
                    equation: prevEquation + '0.',
                }
            } else {
                return {
                    input: prevInput + '.',
                    equation: prevEquation + '.',
                }
            }
            
        });
    }

    handleEqualsBtnClick() {
        
        this.setState((prevState) => {
            const prevInput = prevState.input;
            const prevEquation = prevState.equation;

            // function for calculate final answer from the given string of equation ##############
            function calculate(stringEquation) {

                // If first number is negetive add a zero in the begining
                // ex: (-5+5) => (0-5+5)
                if(stringEquation[0] === '-') {
                    stringEquation = '0' + stringEquation;
                }

                // helper function for
                // do multiplication and devision from left to right
                const multiplyAndDivide = (ex) => {    
                    const operators = ex.split(/[0-9]+[.]*[0-9]*/);
                    return ex.split(/[x|/]/).reduce( (prev, cur, idx) => (operators[idx] === 'x') ? Number(prev)*Number(cur) : Number(prev)/Number(cur) )
                }

                // 1. split the full equation by (+ or -) symbols into parts that only contain numbers and (x, /)symbols
                        // ex: '1+2x3+4/5+6-7' => ['1', '2x3', '4/5', '6', '7']
                // 2. then map each element of the above array by multiplyAndDivide function
                        // ex: '2x3' => '6'
                        // ex: '4/5' => '0.8'
                // 3. then add and subtract from left to right
                const subtractAndAddAfterMultyplyAndDivide = (ex) => {                    
                    const operators = ex.split(/[0-9]+[.]*[0-9]*/);
                    return ex.split(/[+|-]/).map( (cur) => multiplyAndDivide(cur)).reduce( (prev, cur, idx) => (operators[idx] === '+') ? Number(prev)+Number(cur) : Number(prev)-Number(cur) )
                }

                return subtractAndAddAfterMultyplyAndDivide(stringEquation);
            }
            // End of the calculate fuction #######################################################

            if (!isNaN(prevInput)) {
                const answer = calculate(prevEquation);

                return {
                    input: answer,
                    equation: '',
                }
            } else {
                const answer =  calculate(prevEquation.slice(0, -1));

                return {
                    input: answer,
                    equation: '',
                }
            }
        });
    }

    render() {
        return (
            <div id="calculator">
                <Display equation={this.state.equation} input={this.state.input} />
                <ClearBtn handler={this.handleClearBtnClick} />
                <OperatorBtn operator='divide' handler={this.handleOperatorBtnClick} /><OperatorBtn operator='multiply' handler={this.handleOperatorBtnClick}/>
                <NumBtn num='7' handler={this.handleNumBtnClick} /><NumBtn num='8' handler={this.handleNumBtnClick} /><NumBtn num='9' handler={this.handleNumBtnClick} /><OperatorBtn operator='subtract' handler={this.handleOperatorBtnClick} />
                <NumBtn num='4' handler={this.handleNumBtnClick} /><NumBtn num='5' handler={this.handleNumBtnClick} /><NumBtn num='6' handler={this.handleNumBtnClick} /><OperatorBtn operator='add' handler={this.handleOperatorBtnClick} />
                <NumBtn num='1' handler={this.handleNumBtnClick} /><NumBtn num='2' handler={this.handleNumBtnClick} /><NumBtn num='3' handler={this.handleNumBtnClick} /><EqualsBtn handler={this.handleEqualsBtnClick} />
                <NumBtn num='0' handler={this.handleNumBtnClick} /><DecimalBtn handler={this.handleDecimalBtnClick} />
            </div>
        );
    }
}

export default App;

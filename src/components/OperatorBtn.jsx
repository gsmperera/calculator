
function OperatorBtn(props) {
    const symbolNames = {
        "divide": "/",
        "multiply": "x",
        "subtract": "-",
        "add": "+",
    }
    
    return (
        <div id={props.operator} className='operators grid-item btn' onClick={props.handler} dangerouslySetInnerHTML={{ __html: symbolNames[props.operator]}}></div>
    );
}

export default OperatorBtn;
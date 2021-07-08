
function Display(props) {
    return (
        <div id='display' className='display grid-item'>
            <p id='equation'>{props.equation}</p>
            <p id='inputValue'>{props.input}</p>
        </div>
    );
}

export default Display;
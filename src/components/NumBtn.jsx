
function NumBtn(props) {
    const number = Number(props.num);
    const numberNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'decimal']

    return (
        <div id={numberNames[number]} className='numbers grid-item btn' onClick={props.handler}>{number}</div>
    );
}

export default NumBtn;
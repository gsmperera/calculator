
function ClearBtn(props) {
    return (
        <div id="clear" className='clear grid-item btn' onClick={props.handler}>AC</div>
    );
}

export default ClearBtn;
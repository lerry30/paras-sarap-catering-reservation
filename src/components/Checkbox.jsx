
const Checkbox = ({ value='', text='', onChange=()=>{} }) => {
    return (
        <div className="flex gap-2">
            <input value={ value } type="checkbox" className="size-4 mt-1" onChange={ onChange } />
            <span className="text-sm">{ text }</span>
        </div>
    );
}

export default Checkbox;
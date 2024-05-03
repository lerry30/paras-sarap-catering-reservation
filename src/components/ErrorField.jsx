const ErrorField = ({ message }) => {
    return (
        <p className={ `w-full font-paragraphs text-[14px] text-rose-700 bg-red-800/10` }>{ message }</p>
    );
}

export default ErrorField
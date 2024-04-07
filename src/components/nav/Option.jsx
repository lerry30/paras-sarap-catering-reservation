import Link from 'next/link';

const Option = ({ children, href='', className='', icon='' }) => {
    return (
        <Link href={ href }>
            <div className={ `text-nowrap text-[16px] p-2 px-4 rounded-sm hover:bg-skin-ten hover:text-white hover:font-semibold overflow-x-hidden text-ellipsis flex gap-2 items-center ${ className }` }>
                {/* { icon && <Icon size={20} className="stroke-neutral-900" /> } */}
                { children }
            </div>
        </Link>
    );
}

export default Option;
import { CirclePlus, CircleX } from '@/components/icons/All';

export const HoverAvailable = ({ onClick=()=>{}, text='' }) => {
    return ( 
        <div onClick={ onClick } className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg border-2 border-green-600 shadow-lg hover:shadow-green-600 flex justify-center items-center overflow-hidden">
            <div className="absolute top-0 right-0 pr-4 pl-6 py-2 bg-green-900 rounded-bl-full hidden group-hover:flex justify-center items-center gap-2">
                <CirclePlus size={ 20 } className="stroke-white" />
                <h1 className="font-headings text-white font-bold text-[16px]">{ text }</h1>
            </div>
        </div>
    );
}

export const HoverUnavailable = ({ text }) => {
    return (
        <div className="group absolute top-0 left-0 right-0 bottom-0 rounded-lg border-2 border-red-600 shadow-lg hover:shadow-red-900 flex justify-center items-center overflow-hidden">
            <div className="absolute top-0 right-0 pr-4 pl-6 py-2 bg-red-700 rounded-bl-full hidden group-hover:flex justify-center items-center gap-2">
                <CircleX size={ 20 } className="stroke-white" />
                <h1 className="font-headings text-white font-bold text-[16px]">{ text }</h1>
            </div>
        </div>
    );
}

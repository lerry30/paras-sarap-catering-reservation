import { X, Star } from '@/components/icons/All';
import { useRef, useState, useLayoutEffect } from 'react';
import ErrorField from './ErrorField';

export const SuccessModal = ({ message, callback }) => {
    const modalRef = useRef();

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        callback();
    }

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="card p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-emerald-500 flex flex-col">
                <article className="w-full relative">
                    <div onClick={ closeModal } className="group absolute top-[-20px] right-[-20px]">
                        <X
                            onClick={ closeModal }
                            className="cursor-pointer rounded-full group-hover:bg-neutral-800/50 group-hover:stroke-neutral-200 stroke-neutral-500/75" 
                        />
                    </div>
                </article>
                
                <h1 className="font font-headings font-bold text-2xl">Success!</h1>
                <p className="font-paragraphs w-60 py-4 text-center text-neutral-800">{ message }</p>
            </div>
        </div>
    );
}

export const ErrorModal = ({ header, message, callback }) => {
    const modalRef = useRef();

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        callback();
    }

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center">
            <div className="card p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-rose-700 flex flex-col">
                <article className="w-full relative">
                    <div onClick={ closeModal } className="group absolute top-[-20px] right-[-20px]">
                        <X
                            onClick={ closeModal }
                            className="cursor-pointer rounded-full group-hover:bg-neutral-800/50 group-hover:stroke-neutral-200 stroke-neutral-500/75" 
                        />
                    </div>
                </article>
                
                <h1 className="font font-headings font-bold text-2xl pt-2">{ header }</h1>
                <p className="font-paragraphs w-60 py-4 text-center text-neutral-800 dark:text-neutral-400">{ message }</p>
            </div>
        </div>
    );
}

export const Prompt = ({ header, message, callback, onClose }) => {
    const modalRef = useRef();

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        onClose();
    }

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="card p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-emerald-500 flex flex-col">
                <article className="w-full relative">
                    <div onClick={ closeModal } className="group absolute top-[-20px] right-[-20px]">
                        <X
                            onClick={ closeModal }
                            className="cursor-pointer rounded-full group-hover:bg-neutral-800/50 group-hover:stroke-neutral-200 stroke-neutral-500/75" 
                        />
                    </div>
                </article>
                
                <h1 className="font-headings font-bold text-2xl pt-2 max-w-80 text-center">{ header }</h1>
                <p className="font-paragraphs w-60 py-4 text-center text-neutral-800">{ message }</p>
                <div className="w-full justify-end flex gap-2 mt-2">
                    <button onClick={ callback } className="font-headings bg-neutral-500/45 px-4 py-1 leading-none rounded-full text-[16px]">Yes</button>
                    <button onClick={ closeModal } className="font-headings bg-neutral-500/45 p-2 leading-none rounded-full text-[16px]">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export const PromptTextBox = ({ header, message, callback, onClose }) => {
    const modalRef = useRef();
    const [ textBoxError, setTextBoxError ] = useState('');

    const send = async (ev) => {
        try {
            ev.preventDefault();

            const form = ev?.target;
            const textarea = form?.querySelector('textarea');
            if(!textarea?.value) {
                setTextBoxError(`Please fill in the box with the ${ header?.trim()?.toLowerCase() }.`);
                return;
            }

            if(textarea?.value?.length > 200) {
                setTextBoxError('Max 200 characters, please be concise.');
                return;
            }

            await callback(form);
        } catch(error) {
            setTextBoxError(error?.message || 'There\'s something wrong.');
        }
    }
    
    const closeModal = () => { 
        modalRef.current.style.display = 'none';
        onClose();
    }

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="card w-full sm:w-[500px] p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-emerald-500 flex flex-col">
                <h1 className="font-headings font-bold text-2xl pt-2 text-center">{ header }</h1>
                <p className="font-paragraphs py-4 text-center text-neutral-800">{ message }</p>

                <form onSubmit={ send } className="w-full">
                    <textarea name="textbox" className="input w-full min-h-[140px] outline-none border-[1px] border-neutral-400 font-paragraphs"></textarea>
                    <ErrorField message={ textBoxError } />

                    <div className="w-full justify-end flex gap-2 mt-2">
                        <button onClick={ closeModal } className="font-headings bg-neutral-500/45 p-2 leading-none rounded-full text-[16px]">Cancel</button>
                        <button type="submit" className="font-headings bg-neutral-500/45 px-4 py-1 leading-none rounded-full text-[16px]">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const PromptAgreement = ({ callback, onClose, deadline }) => {
    const modalRef = useRef();
    const [ agreed, setAgreed ] = useState(false);

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        onClose();
    }

    const agree = () => {
        if(!agreed) return;
        callback();
    }

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="card w-full lg:w-[80%] p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-emerald-500 flex flex-col">
                <article className="w-full relative">
                    <div onClick={ closeModal } className="group absolute top-[-20px] right-[-20px]">
                        <X
                            onClick={ closeModal }
                            className="cursor-pointer rounded-full group-hover:bg-neutral-800/50 group-hover:stroke-neutral-200 stroke-neutral-500/75" 
                        />
                    </div>
                </article>
                
                <h1 className="font-headings font-bold text-2xl pt-2 max-w-80 text-center">Terms and Policies:</h1>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    1. Refund Policy: Reservations cannot be refunded if canceled within 3 days of the event date.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    2. Contract Requirement: Clients are required to sign a contract before finalizing their reservation.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    3. Downpayment: A downpayment is required to secure the reservation.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    4. Cancellation Policy: Cancellations made after the contract is signed may incur penalties.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    5. Payment Deadline: Full payment must be received by { deadline } to confirm the reservation.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    6. Guest Count: The final guest count must be confirmed three days before the event date.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    7. Additional Charges: Additional fees may apply for special requests or last-minute changes.
                </p>
                <p className="font-paragraphs w-full py-0 md:py-4 text-sm md:text-base text-center text-neutral-800">
                    8. Damages: Clients are responsible for any damages incurred during the event.
                </p>
                <div className="flex gap-2">
                    <input type="checkbox" onChange={ ev => setAgreed(ev.target.checked) } className="size-6"/>
                    <span>I read the terms and policies above, I agree to proceed</span>
                </div>
                <div className="w-full justify-end flex gap-2 mt-2">
                    <button onClick={ agree } className={ `font-headings bg-neutral-500/45 px-4 py-1 leading-none rounded-full text-[16px] ${ agreed || 'opacity-70' }` }>Yes</button>
                    <button onClick={ closeModal } className="font-headings bg-neutral-500/45 p-2 leading-none rounded-full text-[16px]">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export const PromptRating = ({ callback, onClose }) => {
    const modalRef = useRef();
    const starWidth = useRef(50);

    const [ point, setPoint ] = useState(0);
    const [ shade, setShade ] = useState(Array(5).fill(0));

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        onClose();
    }

    const rateInStar = (ev, number) => {
        const rectProps = ev.target.getBoundingClientRect();
        const mouseX = ev.clientX;

        const xDistance = Math.ceil(mouseX - rectProps?.left);
        const rate = xDistance / starWidth.current + number;
        setPoint(Number(rate.toFixed(1)));
        setShade(nShade => {
            for(let i = 0; i < nShade.length; i++) {
                nShade[i] = 0;
                if(i < number) nShade[i] = starWidth.current;
            }

            nShade[number] = xDistance; 
            return nShade; 
        });
    }

    useLayoutEffect(() => {
        if(innerWidth < 600)
            starWidth.current = 40;
    }, []);

    return (
        <div ref={ modalRef } className="w-screen h-screen fixed top-0 left-0 bg-neutral-800/90 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="card p-16 bg-zinc-100 rounded-md shadow-lg shadow-black border border-emerald-500 flex flex-col">
                <article className="w-full relative">
                    <div onClick={ closeModal } className="group absolute top-[-20px] right-[-20px]">
                        <X
                            onClick={ closeModal }
                            className="cursor-pointer rounded-full group-hover:bg-neutral-800/50 group-hover:stroke-neutral-200 stroke-neutral-500/75" 
                        />
                    </div>
                </article>
 
                <h1 className="font-headings font-bold text-2xl pt-2 max-w-80 text-center">Service Satisfaction Rating</h1>
                <p className="font-paragraphs w-60 py-2 text-center text-neutral-800">Please rate your overall service satisfaction from 1 to 5.</p>

                <h2 className="font-headings font-semibold text-2xl py-2">{ !!point && point }</h2>
                <div className="flex gap-[4px]"
                    style={{ 
                        width: `${starWidth.current*5+16}px`, 
                        height: `${starWidth.current}px`,
                }}>
                    {
                        shade.map((nShade, index) => (
                            <div key={ index } className="relative"
                                style={{
                                    width: `${starWidth.current}px`,
                                    height: `${starWidth.current}px`
                                }}
                                onClick={ (ev) => rateInStar(ev, index)
                            }>
                                <Star size={ starWidth.current } className="absolute top-0 left-0 right-0 bottom-0" strokeWidth={1} />
                                <div className="overflow-hidden absolute top-0 left-0 right-0 bottom-0" style={{ width: `${ nShade }px` }}>
                                    <Star size={ starWidth.current } className="fill-yellow-400" strokeWidth={1} />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="w-full justify-end flex gap-2 mt-6">
                    <button onClick={ closeModal } className="font-headings bg-neutral-500/45 p-2 leading-none rounded-full text-[16px]">Cancel</button>
                    <button onClick={ () => callback(point) } className="font-headings bg-neutral-500/45 px-4 py-1 leading-none rounded-full text-[16px]">Submit</button>
                </div>
            </div>
        </div>
    );
}

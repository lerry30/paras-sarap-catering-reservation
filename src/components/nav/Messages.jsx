'use client';
import { useEffect, useState } from 'react';
import { MessageCircle, SendHorizontal, X } from '@/components/icons/All';
import { getData, sendJSON } from '@/utils/send';

const Messages = () => {
    const [ displayChats, setDisplayChats ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ chats, setChats ] = useState([]);

    const sendMessage = async () => {
        try {
            if(!message) return;
            const nMessage = message?.trim().toLowerCase();
            const messageData = await sendJSON('/api/messenges', { message: nMessage });
            setMessage('');
        } catch(error) {}
    }

    const fetchMessageUpdate = async () => {
        try {
            const messages = await getData('/api/messenges');
            const nMessages = typeof 
            setChats(messages);
        } catch(error) {}
    }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         fetchMessageUpdate();
    //     }, 3000);

    //     return () => clearInterval(intervalId);
    // }, []);

    return (
        <>
            <div onClick={ () => setDisplayChats(state => !state) } className="h-full aspect-square flex justify-center items-center rounded-full cursor-pointer">
                <MessageCircle size={24} strokeWidth={1}/>
            </div>
            <div className={ `w-[400px] h-[calc(100vh-var(--nav-height))] flex flex-col fixed bottom-0 right-0 shadow bg-white rounded-t-lg overflow-hidden transition-transform ${ displayChats ? '-translate-y-0' : 'translate-y-full' }` }>
                <header className="h-nav-height flex items-center bg-skin-ten">
                    <button onClick={ () => setDisplayChats(false) } className="ml-auto mr-6">
                        <X className="cursor-pointer rounded-full hover:bg-neutral-800 stroke-neutral-200" />
                    </button>
                </header>
                <div className="flex grow">
                    {
                        chats?.length > 0 && 
                            chats?.map((chat, index) => {
                                return (
                                    <article key={ index } className="w-full bg-pink-700">
                                        <span>{ chat }</span>
                                    </article>
                                )
                            })
                    }
                </div>
                <div className="flex gap-2 px-6 py-4 bg-skin-ten rounded-t-md">
                    <input value={ message } onChange={ ev => setMessage(ev.target.value) } className="h-8 grow font-paragraphs font-medium rounded-full outline-none px-4" placeholder="Message"/>
                    <button onClick={ sendMessage }>
                        <SendHorizontal size={34} className="p-1 stroke-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Messages;
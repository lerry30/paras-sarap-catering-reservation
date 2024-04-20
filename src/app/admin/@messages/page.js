'use client';
import { useEffect, useState } from 'react';
import { MessageCircle, SendHorizontal, X } from '@/components/icons/All';
import { getData, sendJSON } from '@/utils/send';
import Loading from '@/components/Loading';

const Messages = () => {
    const [ displayChats, setDisplayChats ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ chats, setChats ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const sendMessage = async () => {
        try {
            if(!message) return;
            const nMessage = message?.trim().toLowerCase();
            const messageData = await sendJSON('/api/messenges', { message: nMessage });
        } catch(error) {}
    }

    const fetchMessageUpdate = async () => {
        try {
            const chatsResponse = await getData('/api/messenges');
            setChats(chatsResponse?.data || []);
        } catch(error) {}
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessageUpdate();
        }, 12000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="w-full pr-[var(--admin-sidebar-width)] h-[calc(100vh-var(--nav-height))] flex flex-col shadow bg-white rounded-t-lg overflow-hidden">
                <div className="flex grow">
                    {/* {
                        chats?.length > 0 && 
                            chats?.map((chat, index) => {
                                return (
                                    <article key={ index } className="w-full bg-pink-700">
                                        <span></span>
                                    </article>
                                )
                            })
                    } */}
                </div>
                <div className="flex gap-2 px-6 py-4 border-t-[1px] border-neutral-400">
                    <input onChange={ ev => setMessage(ev.target.value) } className="h-11 grow font-paragraphs font-medium text-lg rounded-full outline-none px-4 border-[1px] border-neutral-700" placeholder="Message"/>
                    <button onClick={ sendMessage }>
                        <SendHorizontal size={42} className="p-1 stroke-neutral-900" />
                    </button>
                </div>
                <aside className="w-admin-sidebar fixed top-[var(--nav-height)] right-0 bottom-0 border-l-[1px] border-neutral-400">
                    {
                        chats?.length === 0 ?
                            <div className="size-full flex justify-center pt-[calc(50vh-var(--nav-height)-20px)]">
                                <h3 className="font-headings font-bold text-lg text-neutral-500 text-center">Currently No Messages</h3>
                            </div>
                        :
                            chats?.map((chat, index) => {
                                console.log(chat);
                                return (
                                    <div key={ index }>
                                        <span>{  }</span>
                                    </div>
                                )
                            })
                    }
                </aside>
            </section>
        </>
    );
}

export default Messages;
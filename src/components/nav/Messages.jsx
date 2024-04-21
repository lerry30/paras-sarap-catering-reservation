'use client';
import { useEffect, useRef, useState } from 'react';
import { CircleUserRound, MessageCircle, SendHorizontal, X } from '@/components/icons/All';
import { getData, sendJSON } from '@/utils/send';
import { createFullname } from '@/utils/name';
import { useSearchParams } from 'next/navigation';
import LogoWhite from '@/components/LogoWhite';

const Messages = () => {
    const [ message, setMessage ] = useState('');

    const [ viewChat, setViewChat ] = useState({});
    const [ displayChats, setDisplayChats ] = useState([]);
    const [ displayName, setDisplayName ] = useState('');

    const [ chatBar, setChatBar ] = useState(false);

    const [ loading, setLoading ] = useState(false);
    const chatCont = useRef(null);
    const timeFormat = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true,});

    const sendMessage = async () => {
        try {
            if(!message) return;
            const nMessage = message?.trim().toLowerCase();
            const messageData = await sendJSON('/api/messages', { message: nMessage });
            setMessage('');
        } catch(error) {}
    }

    const recipientInfo = () => {
        const recipient = Object.values(viewChat || {})[0]?.recipient; 
        if(Object.values(recipient || {}).length === 0) return;
        const { firstname, lastname } = recipient;
        const fullname = createFullname(firstname, lastname);
        setDisplayName(fullname);
    }

    const formatChats = () => {
        const postedConversation = Object.values(viewChat || {})[0];
        const recipientMessages = postedConversation?.messages || [];
        let repliesMessages = postedConversation?.replies || [];

        const messagesHolder = [];
        for(const recMsg of recipientMessages) {
            const timeRecSent = new Date(recMsg?.createdAt).getTime();
            const holder = [ ...repliesMessages ];
            repliesMessages = [];
            for(const repMsg of holder) {
                const timeRepSent = new Date(repMsg?.createdAt).getTime();
                if(timeRepSent < timeRecSent) {
                    messagesHolder.push({ ...repMsg, user: 'me' });
                    continue;
                }

                repliesMessages.push(repMsg);
            }

            messagesHolder.push({ ...recMsg, user: 'stranger' });
        }

        for(const repMsg of repliesMessages) {
            messagesHolder.push({ ...repMsg, user: 'me' });
        }

        // console.log(messagesHolder);
        setDisplayChats(messagesHolder);
        chatCont.current.scrollTop = chatCont.current.scrollHeight;
    }

    const fetchMessageUpdate = async () => {
        try {
            const chatsResponse = await getData('/api/messages');
            const allChatsData = chatsResponse?.data || [];

            const latest = allChatsData[0];
            setViewChat(latest);

            setLoading(false);
        } catch(error) {}
    }

    useEffect(() => {
        setLoading(true);
        const intervalId = setInterval(() => {
            fetchMessageUpdate();
        }, 3_000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        formatChats();
        recipientInfo();
    }, [ viewChat ]);

    return (
        <>
            <div onClick={ () => setChatBar(state => !state) } className="h-full aspect-square flex justify-center items-center rounded-full cursor-pointer">
                <MessageCircle size={24} strokeWidth={1}/>
            </div>
            <div className={ `w-[400px] h-[calc(100vh-var(--nav-height))] flex flex-col fixed bottom-0 right-0 shadow bg-white rounded-t-lg overflow-hidden transition-transform ${ chatBar ? '-translate-y-0' : 'translate-y-full' }` }>
                <header className="h-nav-height flex items-center bg-teal-700 pl-4">
                    {
                        displayName ? 
                            <div className="flex items-center gap-2 p-[4px]">
                                <CircleUserRound size={40} strokeWidth={1} stroke="black" className="stroke-white" />
                                <h3 className="font-headings font-semibold text-lg text-white">{ displayName }</h3>
                            </div>
                        :
                            <div className="flex items-center gap-2 p-[4px]">
                                <LogoWhite />
                            </div>
                    }
                    <button onClick={ () => setChatBar(false) } className="ml-auto mr-6">
                        <X className="cursor-pointer rounded-full hover:bg-neutral-800 stroke-neutral-200" />
                    </button>
                </header>
                <div ref={ chatCont } className="w-full flex flex-col gap-6 py-4 overflow-auto hide-scrollbar">
                    {
                        displayChats?.map((item, index) => {
                            if(item?.user === 'me') {
                                return (
                                    <div key={ index } className="w-full flex justify-end items-center gap-2 px-4">
                                        <span className="text-[12px] font-paragraphs">{ timeFormat.format(new Date(item?.createdAt)) }</span>
                                        <span className="p-2 bg-blue-600 text-white rounded-full rounded-br-none px-4 text-sm">{ item?.message }</span>
                                    </div>
                                )
                            }

                            return (
                                <div key={ index } className="w-full flex items-center gap-2 px-4">
                                    <CircleUserRound size={40} strokeWidth={1} stroke="black" className="" />
                                    <span className="p-2 bg-neutral-800 text-white rounded-full rounded-bl-none px-4 text-sm">{ item?.message }</span>
                                    <span className="text-[12px] font-paragraphs">{ timeFormat.format(new Date(item?.createdAt)) }</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="flex items-center gap-2 px-6 py-4 bg-teal-700 rounded-t-md mt-auto">
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
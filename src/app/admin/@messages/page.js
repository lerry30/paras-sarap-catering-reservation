'use client';
import { useEffect, useState } from 'react';
import { CircleUserRound, MessageCircle, SendHorizontal, X } from '@/components/icons/All';
import { getData, sendJSON } from '@/utils/send';
import { createFullname } from '@/utils/name';
import Loading from '@/components/Loading';

const Messages = () => {
    const [ message, setMessage ] = useState('');

    const [ viewChat, setViewChat ] = useState({});
    const [ chats, setChats ] = useState([]);
    const [ display, setDisplay ] = useState([]);

    const [ loading, setLoading ] = useState(false);
    const timeFormat = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true,});

    const sendMessage = async () => {
        try {
            if(!message) return;
            const clientId = Object.keys(viewChat)[0];
            const nMessage = message?.trim().toLowerCase();
            const messageData = await sendJSON('/api/messenges', { message: nMessage, recipientId: clientId });
            setMessage('');
        } catch(error) {}
    }

    const formatChats = () => {
        const postedConversation = Object.values(viewChat)[0];
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
        setDisplay(messagesHolder);
    }

    const fetchMessageUpdate = async () => {
        try {
            const chatsResponse = await getData('/api/messenges');
            const allChatsData = chatsResponse?.data || [];

            const latest = allChatsData[0];
            setViewChat(latest);

            setChats(allChatsData);
            setLoading(false);
        } catch(error) {}
    }

    useEffect(() => {
        setLoading(true);
        const intervalId = setInterval(() => {
            fetchMessageUpdate();
        }, 12000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        formatChats();
    }, [ viewChat ]);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="w-full pr-[var(--admin-sidebar-width)] h-[calc(100vh-var(--nav-height))] flex flex-col shadow bg-white rounded-t-lg overflow-hidden">
                <div className="flex grow h-[calc(100vh-var(--nav-height)-70px)] overflow-auto py-4 hide-scrollbar">
                    {
                        Object.values(chats)?.length === 0 ?
                            <div className="size-full flex justify-center pt-[calc(50vh-var(--nav-height)-20px)]">
                                <h3 className="font-headings font-bold text-lg text-neutral-500 text-center">Currently No Messages</h3>
                            </div>
                        :
                            <div className="w-full flex flex-col gap-6">
                                {
                                    display?.map((item, index) => {
                                        if(item?.user === 'me') {
                                            return (
                                                <div key={ index } className="w-full flex justify-end items-center gap-2 px-4">
                                                    <span className="text-sm font-paragraphs">{ timeFormat.format(new Date(item?.createdAt)) }</span>
                                                    <span className="p-2 bg-blue-600 text-white rounded-full rounded-br-none px-4">{ item?.message }</span>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div key={ index } className="w-full flex items-center gap-2 px-4">
                                                <CircleUserRound size={40} strokeWidth={1} stroke="black" className="" />
                                                <span className="p-2 bg-neutral-800 text-white rounded-full rounded-bl-none px-4">{ item?.message }</span>
                                                <span className="text-sm font-paragraphs">{ timeFormat.format(new Date(item?.createdAt)) }</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    }
                </div>
                <div className="h-[70px] flex gap-2 px-6 py-4 border-t-[1px] border-neutral-400">
                    <input onChange={ ev => setMessage(ev.target.value) } className="h-8 grow font-paragraphs font-medium rounded-full outline-none px-4 border-2 border-emerald-600" placeholder="Message"/>
                    <button onClick={ sendMessage }>
                        <SendHorizontal size={34} className="p-1 stroke-emerald-600" />
                    </button>
                </div>
                <aside className="w-admin-sidebar fixed top-[var(--nav-height)] right-0 bottom-0 border-l-[1px] border-neutral-300">
                    {
                        chats?.length === 0 ?
                            <div className="size-full flex justify-center pt-[calc(50vh-var(--nav-height)-20px)]">
                                <h3 className="font-headings font-bold text-lg text-neutral-500 text-center">Currently No Messages</h3>
                            </div>
                        :
                            chats?.map((chat, index) => {
                                const chatData = Object.values(chat)[0] || [];
                                const { firstname, lastname, email, profilePic, status } = chatData?.recipient;
                                const fullName = createFullname(firstname, lastname);
                                return (
                                    <div key={ index } className="cursor-pointer">
                                        <span>
                                            <div className="p-2 shadow-sm flex gap-4 min-w-[calc((100vw-var(--admin-sidebar-width))/2-32px)]">
                                                <div>
                                                    {
                                                        profilePic ? 
                                                            <div className="">
                                                                <Image 
                                                                    src={ profilePic }
                                                                    alt={ firstname }
                                                                    width={ 200 }
                                                                    height={ 200 }
                                                                    sizes='100%'
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '44%',
                                                                        objectFit: 'cover',
                                                                        transformOrigin: 'center',
                                                                        borderRadius: '8px 8px 0 0',
                                                                        minHeight: '170px',
                                                                        maxHeight: '170px',
                                                                    }}
                                                                    priority
                                                                />
                                                            </div>
                                                        :
                                                            <CircleUserRound size={40} strokeWidth={1} stroke="black" className="" />
                                                    }
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h2 className="font-headings font-semibold">{ fullName }</h2>
                                                </div>
                                            </div>
                                        </span>
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
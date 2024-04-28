'use client';
import { useEffect, useRef, useState } from 'react';
import { CircleUserRound, SendHorizontal, X } from '@/components/icons/All';
import { getData, sendJSON } from '@/utils/send';
import { createFullname } from '@/utils/name';
import { useSearchParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const Messages = () => {
    const [ message, setMessage ] = useState('');

    const [ viewChat, setViewChat ] = useState({});
    const [ chats, setChats ] = useState([]);
    const [ displayChats, setDisplayChats ] = useState([]);
    const [ displayName, setDisplayName ] = useState('');
    const [ recipeintIndex, setRecipientIndex ] = useState(0);
    const [ fCount, setFCount ] = useState(0);
    
    const [ loading, setLoading ] = useState(false);

    const chatCont = useRef(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const timeFormat = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: 'numeric', hour12: true,});

    const sendMessage = async () => {
        try {
            const clientId = Object.keys(viewChat || {})[0];
            if(!message || !clientId) return;
            const nMessage = message?.trim().toLowerCase();
            const messageData = await sendJSON('/api/messages', { message: nMessage, recipientId: clientId });
            setMessage('');
        } catch(error) {
            console.log(error);
        }
    }

    const checkIfTheresAUserSelected = async (allChatsData) => {
        try {
            const id = searchParams.get('id');
            if(!id) return;
            
            const response = await sendJSON('/api/messages/message', { userId: id });
            const data = response?.data || {};
            const userIds = Object.keys(data);
            if(userIds.length === 0) return;

            setChats([ data, ...allChatsData ]);
            setViewChat(data);
            router.replace('/admin?display=messages', undefined, { shallow: true }); 
        } catch(error) {
            console.log(error);
        }
    }

    const chatAPerson = async (allChatsData) => {
        let contains = false;
        try {
            const id = searchParams.get('id');
            if(!id) return;

            for(let i = 0; i < allChatsData.length; i++) {
                const chatData = allChatsData[i];
                if(chatData[id]) {
                    setRecipientIndex(i);
                    contains = true;
                    break;
                }
            }
        } catch(error) {
            console.log(error);
        }

        router.replace('/admin?display=messages', undefined, { shallow: true }); 
        return contains;
    }

    const selectRecipient = (index) => {
        if(index < 0 || index >= chats.length) return;
        setRecipientIndex(index);
        // const recipientData = chats[index] || {};
        // setViewChat(recipientData);
    }

    const recipientInfo = () => {
        const recipient = Object.values(viewChat || {})[0]?.recipient; 
        if(Object.values(recipient || {}).length === 0) return;
        const { firstname, lastname } = recipient;
        const fullname = createFullname(firstname, lastname);
        setDisplayName(fullname);
    }

    const formatChats = () => {
        try {
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

            // console.log(messagesHolder, '=====');
            const prevMessageHolderLength = displayChats.length;
            setDisplayChats(messagesHolder);
            
            // since it will always scroll through the bottom every request
            // made I have added a condition to scroll it once a new message 
            // occur and components are mounted
            if(messagesHolder.length > prevMessageHolderLength)
                chatCont.current.scrollTop = chatCont.current.scrollHeight;
        } catch(error) {
            console.log(error);
        }
    }

    const fetchMessageUpdate = async () => {
        try {
            const chatsResponse = await getData('/api/messages');
            const allChatsData = chatsResponse?.data || [];
            return allChatsData;
        } catch(error) {}

        return null;
    }

    useEffect(() => {
        setLoading(true);

        const intervalId = setInterval(() => {
            setFCount(state => state+1);
        }, 3_000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        formatChats();
        recipientInfo();
    }, [ viewChat ]);

    useEffect(() => {
        (async () => {
            const allChatsData = await fetchMessageUpdate();

            // I stored all data into chats instead of
            // list of client's data only so could display
            // the last message
            setChats(state => {
                const nData = [];
                for(const chatData of state) {
                    const chatsId = Object.keys(chatData)[0];
                    let equal = false;
                    for(const fData of allChatsData) {
                        const fDataId = Object.keys(fData)[0];
                        if(fDataId === chatsId) {
                            equal = true;
                            break;
                        }
                    }

                    if(!equal) nData.push(chatData);
                }

                return [ ...nData, ...allChatsData ];
            });

            const contains = await chatAPerson(allChatsData);
            if(!contains) await checkIfTheresAUserSelected(allChatsData);
            
            if(fCount < 1) chatCont.current.scrollTop = chatCont.current.scrollHeight;
            setLoading(false);
        })();
    }, [ fCount ]);

    useEffect(() => {
        if(chats.length === 0) return;
        console.log(recipeintIndex, chats);
        const currentRescipient = chats[recipeintIndex || 0] || {};
        setViewChat(currentRescipient);
    }, [ recipeintIndex, chats ]);

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
            <section className="w-full pr-[var(--admin-sidebar-width)] h-[calc(100vh-var(--nav-height))] flex flex-col shadow bg-white overflow-hidden">
                <div ref={ chatCont } className="flex grow h-[calc(100vh-var(--nav-height)-70px)] overflow-auto hide-scrollbar scroll-smooth">
                    {
                        Object.values(chats)?.length === 0 ?
                            <div className="size-full flex justify-center pt-[calc(50vh-var(--nav-height)-20px)]">
                                <h3 className="font-headings font-bold text-lg text-neutral-500 text-center">Currently No Messages</h3>
                            </div>
                        :
                            <div className="w-full">
                                {
                                    displayName && 
                                        <div className="flex items-center gap-2 p-[4px] border-b-[1px] border-[var(--skin-ten)] sticky top-0 bg-white">
                                            <CircleUserRound size={40} strokeWidth={1} stroke="black" className="" />
                                            <h3 className="font-headings font-semibold text-lg">{ displayName }</h3>
                                        </div>
                                }
                                <div className="w-full flex flex-col gap-6 py-4">
                                    {
                                        displayChats?.map((item, index) => {
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
                            </div>
                    }
                </div>
                <div className="h-[70px] flex items-center gap-2 px-6 py-4">
                    <input value={ message } onChange={ ev => setMessage(ev.target.value) } onKeyDown={ ev => ev.key === 'Enter' && sendMessage() } className="h-8 grow font-paragraphs font-medium rounded-full outline-none px-4 border-2 border-emerald-600" placeholder="Message"/>
                    <button onClick={ sendMessage }>
                        <SendHorizontal size={34} className={ `p-1 stroke-emerald-600 
                        ${ !(Object.keys(viewChat || {})[0]) && 'stroke-neutral-400' }` } />
                    </button>
                </div>
                <aside className="w-admin-sidebar fixed top-[var(--nav-height)] right-0 bottom-0 border-l-[1px] border-neutral-300">
                    {
                        chats?.map((chat, index) => {
                            const chatData = Object.values(chat)[0] || [];
                            const { firstname, lastname, email, profilePic, status } = chatData?.recipient;
                            const fullName = createFullname(firstname, lastname);
                            return (
                                <div key={ index } onClick={ () => selectRecipient(index) } className="cursor-pointer">
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
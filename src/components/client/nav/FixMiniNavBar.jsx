import { ListChecks } from '@/components/icons/All';
import { zUserData } from '@/stores/user';
import { useEffect } from 'react';
import Message from '@/components/nav/Messages';
import Link from 'next/link';

const FixMiniNavBar = () => {
    const saveUserData = zUserData(state => state.saveUserData);
    const fullName = zUserData(state => state.fullname);

    useEffect(() => {
        saveUserData();
    }, [])

    if(!fullName) return <></>
    
    return (
        <aside className="fixed right-4 bottom-4 p-4 rounded-full sm:hidden bg-white shadow-md border-[1px] border-[var(--skin-ten)] z-subnavbar">
            <ul className="flex flex-col gap-4">
                <li className="overflow-hidden">
                    <Link href="/reserve?display=myreservations" className="group size-[calc(var(--nav-item-height)-10px)] flex items-center justify-center rounded-full hover:bg-skin-ten">
                        <ListChecks size={144} strokeWidth={2} className="group-hover:stroke-white"/>
                    </Link>
                </li>
                <li className="overflow-hidden"><Message /></li>
            </ul>
        </aside>
    );
}

export default FixMiniNavBar;
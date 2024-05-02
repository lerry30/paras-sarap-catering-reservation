'use client';
import Card from '@/components/admin/users/Card';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
import Loading from '@/components/Loading';
// import { zUser } from '@/stores/user';

const Users = () => {
    const [ users, setUsers ] = useState([]);
    const [ usersObject, setUsersObject ] = useState({});
    const [ loading, setLoading ] = useState(false);

    const getUsers = async () => {
        setLoading(true);

        try {
            const { data } = (await getData('/api/clients')) || { data: [] };
            setUsers(data);

            for(const user of data) {
                setUsersObject(prev => ({ ...prev, [ user?._k ]: user }));
            }
        } catch(error) {}

        setLoading(false);
    }

    useEffect(() => {
        getUsers();
    }, []);

    if(loading) return <Loading customStyle="size-full" />
    
    if(users.length === 0) {
        return (
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-[calc(100vh-var(--nav-height))] flex justify-center items-center">
                    <h3 className="text-neutral-500 font-paragraphs text-lg font-bold">No Users Found</h3>
                </div>
            </div>
        )
    }
    
    return (
        <section className="flex flex-col gap-2 p-4 ">
            <h2 className="font-headings font-semibold">Users</h2>
            <div className="flex flex-wrap gap-2">
                {
                    users.map((user, index) => (
                        <Card 
                            key={ index } 
                            userData={ user }
                        />
                    ))
                }
            </div>
        </section>
    );
}

export default Users;
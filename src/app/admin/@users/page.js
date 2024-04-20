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

    return (
        <>
            { loading && <Loading customStyle="size-full" /> }
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
        </>
    );
}

export default Users;
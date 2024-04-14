'use client';
// import Card from '@/components/admin/users/Card';
import { useEffect, useState } from 'react';
import { getData } from '@/utils/send';
// import { zUser } from '@/stores/user';

const Users = () => {
    const [ users, setUsers ] = useState([]);
    const [ usersObject, setUsersObject ] = useState({});

    // const viewMore = (_k) => {
    //     if(!_k) return;
    //     const savingStatus = saveIntoStore(_k);
    //     if(savingStatus) {
    //         router.push('/admin?display=viewuser');
    //         return;
    //     }
    // }

    const getUsers = async () => {
        const { data } = (await getData('/')) || { data: [] };
        setUsers(data);

        for(const user of data) {
            setUsersObject(prev => ({ ...prev, [ user?._k ]: user }));
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <section className="flex flex-col gap-2 p-4 ">
            <h2 className="font-headings font-semibold">Users</h2>
            <div className="flex flex-wrap gap-2">
                {/* {
                    users.map((user, index) => (
                        <Card 
                            key={ index } 
                            userData={ user }
                            // viewMore={ viewMore }
                        />
                    ))
                } */}
            </div>
        </section>
    );
}

export default Users;
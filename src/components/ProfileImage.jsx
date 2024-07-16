import Image from 'next/image';
import { CircleUserRound } from '@/components/icons/All';

const ProfileImage = ({ image=undefined, className='', size=40 }) => {
    if(!!image) {
        return (
            <div className={ `${ className }` }>
                <Image
                    src={ image }
                    alt="User Profile Image"
                    width={ size }
                    height={ size }
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transformOrigin: 'center',
                        borderRadius: '100%',
                    }}
                    priority
                />
            </div>
        )
    }
    
    return <CircleUserRound size={ size } strokeWidth={1} stroke="black" className={ `${ className }` } />
}

export default ProfileImage;

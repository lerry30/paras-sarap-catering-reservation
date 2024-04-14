import Image from 'next/image';
import Link from 'next/link';
import ParasSarapLogo from '../../../public/ParasSarapLogo.svg';

const Logo = () => (
    <Link href="/">
        <Image 
            src={ ParasSarapLogo }
            alt='Paras Sarap Logo'
            width={ 200 }
            height={ 200 }
            sizes='100%'
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: 1,
                filter: 'invert(100%)',
            }}
            priority
        />
    </Link>
)

export default Logo;
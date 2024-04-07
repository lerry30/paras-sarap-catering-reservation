import SNavbar from '@/components/nav/SNavbar';

export default function SignUnLayout({ children }) {
    return (
        <>
            <SNavbar />
            <main className="w-full h-[calc(100vh-var(--nav-height))] flex justify-center items-center flex-col">
                { children }
            </main>
        </>
    );
}

import SNavbar from '@/components/nav/SNavbar';

export default function SignInLayout({ children }) {
    return (
        <>
            <SNavbar />
            <main className="w-full h-[calc(100vh-var(--nav-height))] flex items-center flex-col overflow-hidden">
                { children }
            </main>
        </>
    );
}

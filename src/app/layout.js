import localFont from 'next/font/local';
import "./globals.css";

const exo = localFont({
	src: '../../public/fonts/Exo/Exo-VariableFont_wght.ttf',
	display: 'swap',
	variable: '--font-exo',
});

const quicksand = localFont({
	src: '../../public/fonts/Quicksand/Quicksand-VariableFont_wght.ttf',
	display: 'swap',
	variable: '--font-quicksand',
});

export const metadata = {
	title: "Paras Sarap Catering Reservation",
	description: "At Paras Sarap Catering Reservation, we streamline catering reservations, eliminating the hassle of coordinating food for your events. From weddings to corporate gatherings, our user-friendly platform and diverse menu options ensure culinary success, allowing you to focus on creating unforgettable moments.",
	icons: {
		icon: 'favicon.svg',
	},
	metadataBase: new URL('https://paras-catering.vercel.app'),
	keywords: [ 'catering', 'online', 'cater', 'reservation', 'paras', 'sarap', 'events' ],
	openGraph: {
		description: 'Your Premier Catering Reservation Solution'
	}
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${exo.variable} ${quicksand.variable}`}>
				{children}
			</body>
		</html>
	);
}

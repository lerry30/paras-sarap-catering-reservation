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
  description: "Catering Reservation",
  icons: {
    icon: 'favicon.svg',
  },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${ exo.variable } ${ quicksand.variable }`}>
                {children}
            </body>
        </html>
    );
}

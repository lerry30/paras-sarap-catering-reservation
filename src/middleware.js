import { NextResponse } from 'next/server';
import { sendJSON } from '@/utils/send';

const legacyPrefixes = { '/signup': true, '/signin': true };

export const middleware = async (request) => {
    try {
        const { origin, pathname } = request.nextUrl;

        // const fSegments = (!pathname?.startsWith('/') || pathname?.substr(1))?.split('/')[0];
        if(!legacyPrefixes.hasOwnProperty(pathname)) { // to avoid loop since it will always redirect to signin
            // console.log(request.cookies.getAll())
            const encodedKey = request.cookies.get('user-json-token-key')?.value || '';
            const encodedData = request.cookies.get('user-json-token-data')?.value || '';
            const signInStatus = await sendJSON(`${ origin }/api/users/signed`, { encodedKey, encodedData });
            if(signInStatus.signedIn) {
                const adminVResponse = await sendJSON(`${ origin }/api/admin/auth`, { encodedKey, encodedData });
                const fSegments = (!pathname?.startsWith('/') || pathname?.substr(1))?.trim()?.split('/')[0];
                if(!adminVResponse?.isAnAdmin) {
                    if(fSegments === 'admin') {
                        return NextResponse.redirect(new URL('/', request.url));
                    }
                } else {
                    if(fSegments !== 'admin') {
                        return NextResponse.redirect(new URL('/admin', request.url));
                    }
                }
                
                /**
                 * since middleware runs in edge runtime, it is impossible for me to run node js api calls so fetching
                 * credentials everytime middleware invoked is the only solution I have, eventhough it's quite pain for 
                 * my butt.
                 */

                return NextResponse.next();
            } 
            
            const accessiblePrefixes = { '/': true, '/about': true, '/services': true };
            if(accessiblePrefixes.hasOwnProperty(pathname)) {
                return NextResponse.next();
            }
            
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    } catch(error) {}

    return NextResponse.next();
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)',
    ],
}

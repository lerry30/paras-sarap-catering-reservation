import { useEffect, useRef } from 'react';

export const useThrottle = (callback, delay=1_000) => {
    const inProcess = useRef(false);
    const waitingArgs = useRef(null);
    const timeouts = useRef([]);

    const timeoutFunc = () => {
        if(waitingArgs.current === null) {
            inProcess.current = false;
            return;
        }

        callback(...waitingArgs.current);
        waitingArgs.current = null;
        const timeoutId = setTimeout(timeoutFunc, delay);
        timeouts.current.push(timeoutId);
    }

    useEffect(() => {
        return () => {
            for(const timeout of timeouts.current) {
                clearTimeout(timeout);
            }
        }
    }, []);

    return (...args) => {
        if(inProcess.current) {
            waitingArgs.current = args;
            return;
        }

        callback(...args);
        inProcess.current = true;

        const timeoutId = setTimeout(timeoutFunc, delay);
        timeouts.current.push(timeoutId);
    }
}
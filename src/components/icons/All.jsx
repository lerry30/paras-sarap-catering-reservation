export const ChevronDown = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export const CircleUserRound = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M18 20a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
}

export const ArrowLeft = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}

export const X = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

export const Trash = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    );
}

export const Pen = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
    );
}

export const Plus = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}

export const CloudUpload = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}

export const CircleX = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
           <circle cx="12" cy="12" r="10"/>
           <path d="m15 9-6 6"/>
           <path d="m9 9 6 6"/>
        </svg>
    );
}

export const CirclePlus = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
        </svg>
    );
}

export const CircleCheck = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="m9 11 3 3L22 4"/>
        </svg>
    );
}

export const ChevronLeft = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="m15 18-6-6 6-6"/>
        </svg>
    );
}

export const ChevronRight = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}

export const Clock = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

export const MessageCircle = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
        </svg>
    );
}

export const SendHorizontal = ({ size=24, stroke='hsl(0deg 0% 10% / 100%)', strokeWidth=2, className='' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ size }
            height={ size }
            viewBox="0 0 24 24"
            fill="none"
            stroke={ stroke }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
            strokeLinejoin="round"
            className={ className }
        >
            <path d="m3 3 3 9-3 9 19-9Z"/>
            <path d="M6 12h16"/>
        </svg>
    );
}
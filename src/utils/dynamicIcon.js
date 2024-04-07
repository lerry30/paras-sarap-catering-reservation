import {
    ChevronDown,
    CircleUserRound,
    ArrowLeft,
    X,
    Trash,
} from '@/components/icons/All';

export const dynamicIcon = ({ icon='', ...props }) => {
    const icons = {
        'chevron-down': ChevronDown,
        'circle-user-round': CircleUserRound,
        'arrow-left': ArrowLeft,
        'x': X,
        'trash': Trash,
    };

    return icons[icon];
}
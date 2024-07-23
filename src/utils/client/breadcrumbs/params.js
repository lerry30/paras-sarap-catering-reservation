'use client';

import { sets } from '@/utils/client/breadcrumbs/links';
import { toNumber } from '@/utils/number';

export const getSetParam = (searchParams) => { 
    const setUrlParamerter = toNumber(searchParams.get('set'));
    const filteredSet = setUrlParamerter < 1 || setUrlParamerter > sets.length ? 1 : setUrlParamerter;
    return filteredSet;
}

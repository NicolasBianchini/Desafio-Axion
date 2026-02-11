import { useState, useMemo } from 'react';

type SortOrder = 'asc' | 'desc';

interface SortableItem {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const useSortable = <T extends SortableItem>(items: T[]) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        });
    }, [items, sortOrder]);

    return {
        sortedItems,
        sortOrder,
        toggleSort
    };
};

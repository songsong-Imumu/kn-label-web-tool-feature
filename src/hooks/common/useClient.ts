import { useState, useEffect, useCallback, useRef } from 'react';
import useDebounce from './useDebounce';

const useClientRect = () => {
    const [rect, setRect] = useState<ClientRect | null>(null);
    const parentRef = useRef<HTMLElement | null>(null);
    const { current } = parentRef;
    const getRect = (node: HTMLElement | null) => {
        if (node) {
            setRect(node.getBoundingClientRect());
        }
    };
    const [debouncedCallback, cancelDebouncedCallback] = useDebounce(() => getRect(current), 500);
    const ref = useCallback((node: HTMLElement | null) => {
        if (node) {
            getRect(node);
            parentRef.current = node;
        }
    }, []);

    useEffect(() => {
        if (!current) {
            return;
        }
        window.addEventListener('resize', debouncedCallback);

        return () => {
            window.removeEventListener('resize', cancelDebouncedCallback);
        };
    }, [cancelDebouncedCallback, current, debouncedCallback]);

    return [rect, ref];
};

export default useClientRect;

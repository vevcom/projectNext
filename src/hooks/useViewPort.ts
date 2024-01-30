import { useEffect } from "react"

export default function useViewPort(callback: (width: number, height: number) => void) {
    useEffect(() => {
        const handleResize = () => {
            callback(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Call handleResize to set the initial size
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [callback]);
}


/**
 * This hook debounces a function. It takes a function and returns a function that can be called
 * but it will only call the original function after a certain amount of time has passed since the last call.
 * @param func 
 */
export function useDebounce<T>(func: (param: T) => void, timeout: number): (param: T) => void {
    let timer: NodeJS.Timeout | null = null
    return (param: T) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func(param)
            timer = null
        }, timeout)
    }
}
import { useState, useEffect } from "react";

const PREFIX = "chessmates-";

const get_saved = (prefixed, initialize) => {
    const savedValue = JSON.parse(sessionStorage.getItem(prefixed));
    if (savedValue) return savedValue;
    if (initialize instanceof Function) return initialize();
    return initialize
}

const useSessionStorage = (key, initialize) => {
    const prefixed = PREFIX + key;
    const [value, setValue] = useState(() => {
        return get_saved(prefixed, initialize);
    });

    useEffect(() => {
        sessionStorage.setItem(prefixed, JSON.stringify(value));
    }, [value, prefixed]);

    return [value, setValue];
}

export default useSessionStorage;
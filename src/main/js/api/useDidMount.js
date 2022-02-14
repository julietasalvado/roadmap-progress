import {useEffect, useRef} from "react";

export default function useDidMount() {
    const didMountRef = useRef(true);

    useEffect(() => {
        didMountRef.current = false;
    }, []);
    return didMountRef.current;
}
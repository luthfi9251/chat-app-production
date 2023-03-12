import { useState,useEffect } from "react";

export default function useWindowSize(){
    let [width,setWidth] = useState(window.innerWidth)
    let [height,setHeight] = useState(window.innerHeight)


    const setSize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(()=>{
        window.addEventListener('resize',setSize)

        return ()=>{
            window.removeEventListener('resize', setSize)
        }
    },[])

    return{
        width,
        height
    }
}
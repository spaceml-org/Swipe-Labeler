import React , {useState} from 'react';


export default function Timer(){
    const [time,setTime] = useState(1);
    setTimeout(()=>setTime(time+1),1000);
    return (
        <>
            <strong>{time}</strong>
        </>
        
    )
} 
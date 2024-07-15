import { useState } from "react";
import { toImgUrl } from "..";




export default function() {
    const [imgStr, setImgStr] = useState("");

    const handleFile = async (files: FileList | null) => {
        if (!files) return;
        const file = files[0];
        toImgUrl(file, (e) => {
            navigator.clipboard.writeText(e);
            setImgStr(e)
        })
    }

    return <>
        <input type="file" onChange={e => handleFile(e.currentTarget.files)}/>
        <img src={imgStr} alt=""/>
        <div>App: {imgStr}</div>
    </>
}


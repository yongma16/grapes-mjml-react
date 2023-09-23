
import { useEffect } from "react";

const CkeditorPage=(props:any)=>{
    useEffect(()=>{
        if(CKEDITOR){
            // @ts-ignore
            CKEDITOR.disableAutoInline = true;
            // @ts-ignore
            CKEDITOR.inline( 'editor1' );
        }


    },[])

    return <>
        <div id="editor1" contentEditable="true">
            <h1>Inline Editing in Action!</h1>
            <p>The "div" element that contains this text is now editable.</p>
        </div>
    </>
};


export default CkeditorPage;

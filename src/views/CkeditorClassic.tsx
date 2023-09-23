
import { useEffect } from "react";

const CkeditorPage=(props:any)=>{
    useEffect(()=>{
        if(CKEDITOR){
            // @ts-ignore
            CKEDITOR.replace( 'editor-classic',{
                toolbars:['bold']
            });
        }
        return ()=>{
            // @ts-ignore
            if( CKEDITOR.instances['editor-classic']){
                // @ts-ignore
                CKEDITOR.instances['editor-classic'].destroy()
            }
        }

    },[])

    return <>
        <textarea name="editor-classic" id="editor-classic" >
        </textarea>
    </>
};


export default CkeditorPage;

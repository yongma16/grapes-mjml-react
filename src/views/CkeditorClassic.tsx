
import { useEffect, forwardRef, useImperativeHandle, useState } from "react";

const CkeditorPage=(props:any,ref:any)=>{
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

    const getContent=()=>{
        // @ts-ignore
        return CKEDITOR?.instances['editor-classic']?.getData();
    }
    useImperativeHandle(ref, () => ({
        getHtml:getContent,
        getBodyContent:getContent
    }));

    return <>
        <textarea name="editor-classic">
        </textarea>
    </>
};


export default forwardRef(CkeditorPage);


import { useEffect, useImperativeHandle,forwardRef } from "react";

const CkeditorPage=(props:any,ref:any)=>{
    useEffect(()=>{
        if(CKEDITOR){
            // @ts-ignore
            CKEDITOR.disableAutoInline = true;
            // @ts-ignore
            console.log('CKEDITOR plugins',CKEDITOR.plugins)
            // @ts-ignore
            CKEDITOR.inline( 'editor-inline',{
                position:'center'
            } );
        }
        return ()=>{
            // @ts-ignore
            if( CKEDITOR.instances['editor-inline']){
                // @ts-ignore
                CKEDITOR.instances['editor-inline'].destroy()
            }
        }

    },[])

    const getContent=()=>{
        // @ts-ignore
        return CKEDITOR?.instances['editor-inline']?.getData();
    }
    useImperativeHandle(ref, () => ({
        getHtml:getContent,
        getBodyContent:getContent
    }));

    return <>
        <div id="editor-inline" contentEditable="true">
            <h1>Inline Editing in Action!</h1>
            <p>The "div" element that contains this text is now editable.</p>
        </div>
    </>
};


export default forwardRef(CkeditorPage);

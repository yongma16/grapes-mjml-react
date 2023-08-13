import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import GjsEditor from '@grapesjs/react';
import juice from 'juice'
const GrapesPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();

    useEffect(()=>{

        // @ts-ignore
        const editorInstance:any = props.editInstance
            .init({
                container: '#gjs-grapes',
                storageManager: false,
                plugins: [GjsEditor],
                // Disable the storage manager for the moment
                // Avoid any default panel
            });
        const cmp = editorInstance.Components;
        if(cmp){
            cmp.clear()
        }
        setEditor(editorInstance)
    },[])
    const getHtml=()=>{
        // @ts-ignore
        return editor.getHtml()
    }
    useImperativeHandle(ref, () => ({
        getHtml:getHtml
    }))

    return (

        <div id={'gjs-grapes'} style={{
    width: '800px',
    height: '800px'
}}
    ref={(ref: any) => {
        setDomRef(ref)
    }}
    />

    )
};

export default forwardRef(GrapesPage);

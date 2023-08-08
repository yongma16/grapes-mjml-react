import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import juice from 'juice'
const GrapesPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();

    useEffect(()=>{
        console.log('ref',ref)

        // @ts-ignore
        const editorInstance:any = props.editInstance
            .init({
                container: '#gjs-grapes',
                storageManager: false,
                plugins: [grapesjsPresetWebpage],
                // Disable the storage manager for the moment
                // Avoid any default panel
            });
        const cmp = editorInstance.Components;
        if(cmp){
            console.log('cmp',cmp)
            cmp.clear()
        }
        setEditor(editorInstance)
    },[])
    const getHtml=()=>{
        // @ts-ignore
        const html:any=juice(editor.getHtml())
        const matchBody=new RegExp('<body[^>]*>([\\s\\S]+?)<\\/body>','ig');
        const matchBodyText=html.match(matchBody)
        // @ts-ignore
        return matchBodyText?matchBodyText[0]:editor.getHtml()
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

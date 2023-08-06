import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
const GrapesPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();

    useEffect(()=>{
        console.log('ref',ref)

        // @ts-ignore
        const editorInstance:any = props.editInstance
            .init({
                container: '#gjs-grapes',
            });
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

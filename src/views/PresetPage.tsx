import presetPlugin from '../components/preset-edit'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
const PresetPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();



    useEffect(()=>{
        console.log('ref',ref)

        const editorInstance:any = props.editInstance
            .init({
                container: '#gjs-preset',
                // Disable the storage manager for the moment
                storageManager: false,
                plugins: [presetPlugin],
            });
        setEditor(editorInstance)
    },[]);
    const getHtml=()=>{
        // @ts-ignore
        return editor.getHtml()
    }
    useImperativeHandle(ref, () => ({
        getHtml:getHtml
    }))

    return (

        <div id={'gjs-preset'} style={{
            width:'800px',
            height:'800px'
        }}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        />

    )
}

export default forwardRef(PresetPage);

import presetPlugin from '../components/preset-edit'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import juice from "./GrapesPage";
const PresetPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();



    useEffect(()=>{

        const editorInstance:any = props.editInstance
            .init({
                container: '#gjs-preset',
                // Disable the storage manager for the moment
                storageManager: false,
                plugins: [presetPlugin],
            });
        const cmp = editorInstance.Components;
        if(cmp){
            cmp.clear()
        }
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

        <div id={'gjs-preset'} className={'design-editor'}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        />

    )
}

export default forwardRef(PresetPage);

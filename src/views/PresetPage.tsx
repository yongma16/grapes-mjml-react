import presetPlugin from '../components/preset-edit'
import { useEffect, useState } from 'react'
const PresetPage=(props:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();



    const renderGrape = () => {
        if(domRef&&!editor){
            // @ts-ignore
            const editorInstance:any = props.editInstance
                .init({
                container: '#gjs-preset',
                plugins: [presetPlugin],
            });
            setEditor(editorInstance)
        }
    };

    useEffect(()=>{
        renderGrape()
    },[renderGrape]);

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

export default PresetPage

import { useEffect, useState } from 'react'
const GrapesPage=(props:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();

    const renderGrape = () => {
        if(domRef&&!editor){
            // @ts-ignore
            const editorInstance:any = props.editInstance
                .init({
                    container: '#gjs-grapes',
                });
            setEditor(editorInstance)
        }
    }

    useEffect(()=>{
        renderGrape()
    },[renderGrape])

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

export default GrapesPage

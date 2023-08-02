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
                components: '<div class="txt-red">Hello world!</div>',
                style: '.txt-red{color: red}',
                    plugins: [presetPlugin],
                    // pluginsOpts: {
                    //     [presetPlugin]: { /* options */ }
                    // }
                    // or
                    // plugins: [
                    //     editor => presetPlugin(editor, { /* options */ }),
                    // ],
            });
            setEditor(editorInstance)
        }
    }

    useEffect(()=>{
        renderGrape()
    },[renderGrape])

    return (
        <div id={'gjs-preset'} style={{
            width:'800px',
            height:'800px'
        }}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        ></div>

    )
}

export default PresetPage

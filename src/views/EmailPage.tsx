import mjmlPlugin from '../components/email-edit'
import { useEffect, useState } from 'react'
const EmailPage=(props:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();



    const renderGrape = () => {
        if(domRef&&!editor){
            // @ts-ignore
            const editorInstance:any = props.editInstance
                .init({
                    container: '#gjs-email',
                    components: '<div class="txt-red">Hello world!</div>',
                    style: '.txt-red{color: red}',
                    plugins: [mjmlPlugin],
                    // pluginsOpts: {
                    //     [mjmlPlugin]: {/* ...options */}
                    // },
                });
            setEditor(editorInstance)
        }
    }

    useEffect(()=>{
        renderGrape()
    },[renderGrape])

    return (
        <div id={'gjs-email'} style={{
            width:'800px',
            height:'800px'
        }}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        ></div>

    )
}

export default EmailPage

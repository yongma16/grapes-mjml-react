import grapesJSMJML  from '../components/email-edit/index'
import { forwardRef, useEffect, useState,useImperativeHandle } from 'react'


const EmailPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();
    const [mjmlTemplate,setMjmlTemplate]=useState(`<mjml>
                                    <mj-body>
                                      <mj-section>
                                      </mj-section>
                                    </mj-body>
                                  </mjml>`)
    useEffect(()=>{
        console.log('ref',ref)
        const editorInstance:any = props.editInstance
            .init({
                fromElement: true,
                container: '#gjs-email',
                plugins: [grapesJSMJML ],
            });
        editorInstance.addComponents(mjmlTemplate);
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
        <div id={'gjs-email'} style={{
            width:'800px',
            height:'800px'
        }}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        />

    )
}

export default forwardRef(EmailPage);

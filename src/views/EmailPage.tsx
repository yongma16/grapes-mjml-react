import grapesJSMJML  from '../components/email-edit/index'
import { useEffect, useState } from 'react'


const EmailPage=(props:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();
    const [mjmlTemplate,setMjmlTemplate]=useState(`<mjml>
                                    <mj-body>
                                      <mj-section>
                                      </mj-section>
                                    </mj-body>
                                  </mjml>`)
    useEffect(()=>{
        const editorInstance:any = props.editInstance
            .init({
                fromElement: true,
                container: '#gjs-email',
                plugins: [grapesJSMJML ],
            });
        // editorInstance.addComponents(mjmlTemplate);
        console.log('getHtml',editorInstance.getHtml())
        setEditor(editorInstance)
    },[])

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

export default EmailPage

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
        const editorInstance:any = props.editInstance
            .init({
                fromElement: true,
                container: '#gjs-email',
                // Disable the storage manager for the moment
                plugins: [grapesJSMJML ],
            });
        // const components=editorInstance.getComponents()
        const cmp = editorInstance.Components;
        if(cmp){
            cmp.clear()
        }
        editorInstance.addComponents(mjmlTemplate);
        setEditor(editorInstance)
    },[])

    const getHtml=()=>{
        // @ts-ignore
        const inlineHtml=editor.Commands.run('mjml-code-to-html-inline')
        const matchBody=new RegExp('<body[^>]*>([\\s\\S]+?)<\\/body>','ig');
        const matchBodyText=inlineHtml.match(matchBody)
        // @ts-ignore
        return matchBodyText?matchBodyText[0]:''
    }

    useImperativeHandle(ref, () => ({
        getHtml:getHtml
    }))

    return (
        <div id={'gjs-email'} style={{
            width:'800px',
            height:'calc( 100vh - 80px)'
        }}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        />

    )
}

export default forwardRef(EmailPage);

import grapesJSMJML  from '../components/email-edit'
import { useEffect, useState } from 'react'
const EmailPage=(props:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();



    const renderGrape = () => {
        if(domRef&&!editor){
            // @ts-ignore
            const editorInstance:any = props.editInstance
                .init({
                    fromElement: true,
                    container: '#gjs-email',
                    plugins: [grapesJSMJML ],
                    // pluginsOpts: {
                    //     [grapesJSMJML]: {/* ...options */}
                    // },
                });
            const baseTemplate= `<mjml>
                                    <mj-body>
                                      <mj-section>
                                      </mj-section>
                                    </mj-body>
                                  </mjml>`;
            editorInstance.addComponents(baseTemplate);
            console.log('editorInstance',editorInstance)
            console.log('editorInstance.addComponents',editorInstance.addComponents)
            console.log('grapesJSMJML',grapesJSMJML)
            setEditor(editorInstance)
        }
    }
    //
    // useEffect(()=>{
    //     renderGrape()
    // },[renderGrape])

    useEffect(()=>{

        const baseTemplate= `<mjml>
                                    <mj-body>
                                      <mj-section>
                                      </mj-section>
                                    </mj-body>
                                  </mjml>`;
        const editorInstance:any = props.editInstance
            .init({
                fromElement: true,
                container: '#gjs-email',
                components:baseTemplate,
                plugins: [grapesJSMJML ],
                // pluginsOpts: {
                //     [grapesJSMJML]: {/* ...options */}
                // },
            });
        editorInstance.addComponents(baseTemplate);
        console.log('editorInstance',editorInstance)
        console.log('editorInstance.addComponents',editorInstance.addComponents)
        console.log('grapesJSMJML',grapesJSMJML)
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

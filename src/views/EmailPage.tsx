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
                plugins: [grapesJSMJML ],
            });
        // const components=editorInstance.getComponents()

        editorInstance.addComponents(mjmlTemplate);
        setEditor(editorInstance)
    },[])

    const startAnimation=()=>{
        console.log('startAnimation')
    }

    const endAnimation=()=>{
        console.log('endAnimation')
    }


    const notifyError=(error:any)=>{
        console.log('notifyError',error)
    }

    const uploadSuceess=(res:any)=>{
        console.log('res')
    }

    const changeContent=(res:any)=>{
        console.log('change',res)
    }

    useEffect(()=>{
        if(editor){

            // @ts-ignore
            console.log('editor.on',editor.on);
            // @ts-ignore
            editor.on('asset:upload:start', startAnimation);
            // @ts-ignore
            editor.on('asset:upload:end', endAnimation);
            // @ts-ignore
            editor.on('asset:upload:error', notifyError);
            // @ts-ignore
            editor.on('asset:upload:response', uploadSuceess);
            // @ts-ignore
            editor.on('change:placeholder', changeContent);

            // @ts-ignore
            const component = editor.getSelected(); // Component selected in canvas
            if(component){
                const traits = component.get('traits');
                if(traits){
                    traits.forEach((trait:any) => console.log('trait',trait.props()))
                }

            }
            // @ts-ignore
            editor.on(`component:create`, model => console.log('Global hook: component:create', model.get('type')));
            // @ts-ignore
            editor.on(`component:mount`, model => console.log('Global hook: component:mount', model.get('type')));
            // @ts-ignore
            editor.on(`component:update:testprop`, model => console.log('Global hook: component:update:testprop', model.get('type')));
            // @ts-ignore
            editor.on(`component:remove`, model => console.log('Global hook: component:remove', model.get('type')));

        }

},[editor]);

    const getBodyContent=()=>{
        // @ts-ignore
        const inlineHtml=editor.Commands.run('mjml-code-to-html-inline')
        const matchBody=new RegExp('<body[^>]*>([\\s\\S]+?)<\\/body>','ig');
        const matchBodyText=inlineHtml.match(matchBody)
        // @ts-ignore
        return matchBodyText?matchBodyText[0]:''
    };

    const getHtml=()=>{
        // @ts-ignore
        return editor.Commands.run('mjml-code-to-html-inline')
    }



    useImperativeHandle(ref, () => ({
        getHtml:getHtml,
        getBodyContent:getBodyContent
    }));

    return (
        <div id={'gjs-email'} className={'design-editor'}
             ref={(ref:any)=>{
                 setDomRef(ref)
             }}
        />

    )
}

export default forwardRef(EmailPage);

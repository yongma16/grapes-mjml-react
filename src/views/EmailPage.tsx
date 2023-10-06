import grapesJSMJML  from '../components/email-edit/index'
import { forwardRef, useEffect, useState,useImperativeHandle } from 'react'
import zh from "../components/email-edit/locale/zh";
// import grapesCkeditor from 'grapesjs-plugin-ckeditor';
// ckeditor
// @ts-ignore
import ckEditorPlugin  from '../components/grapes-ck-plugin/index'
// import { CKEditor } from 'ckeditor4-react';
const EmailPage=(props:any,ref:any)=>{
    const [editor,setEditor]=useState();
    const [domRef,setDomRef]=useState();
    const [editorInstance,setEditorInstance]=useState(null);
    const callbackEmail=(editor:any)=>{
        // 传递 editor
        setEditorInstance(editor);
        console.log('editor',editor)
    }
    useEffect(()=>{
        // @ts-ignore
        const options:any={
            container: '#gjs-email',
            plugins: [grapesJSMJML, ckEditorPlugin],
            pluginsOpts: {
                // @ts-ignore
                [ckEditorPlugin]: {
                    onToolbar: (el:HTMLElement) => {
                        console.log('el tools',el)
                        el.style.minWidth = '350px';
                    },
                    options: {
                        startupFocus: true,
                        extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
                        allowedContent: true, // Disable auto-formatting, class removing, etc.
                        enterMode: 2, // CKEDITOR.ENTER_BR,
                        callbackEmail:callbackEmail,
                    }

                },
            },
            i18n: {
                messages: { zh },
            },
            assetManager:{
                assets:[
                    {
                        // You can pass any custom property you want
                        category: 'logo',
                        src: 'https://yongma16.xyz/staticFile/common/img/logo.png',
                    }, {
                        category: 'c1',
                        src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
                    }, {
                        category: 'c2',
                        src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
                    }
                ]
            },
        }
        console.log('options',options)
        const editorInstance:any =props.editInstance
            .init(options);
        try{
            editorInstance.Commands.run('mjml-clear')
        }
        catch (e) {
            console.error('e',e)
        }
        setEditor(editorInstance)
    },[props.editInstance])

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
            const layers = editor.Layers;
            // @ts-ignore
            const panelManager = editor.Panels;
            console.log('layers',layers)
            const allViewsDom=panelManager.getPanelsEl()
            const viewsDom=panelManager.getPanel('views')
            const button= panelManager.getButton('views','open-blocks')
            // @ts-ignore
            console.log('layers panelManager',panelManager)
            console.log('layers panelManager getButton',);
            console.log('all viewsDom',allViewsDom );
            console.log('all viewsDom',viewsDom );
            console.log('views button',button);
            console.log('views button attributes',button.attributes);
            console.log('views button active',button.active);
            button.active=true

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
            editor.on('component:focus', ()=>{
                console.log('focus')
            });
            // @ts-ignore
            editor.on('component:update:click', ()=>{
                console.log('update click')
            });

            // @ts-ignore
            editor.on('click', ()=>{
                console.log('only click')
            });
            // @ts-ignore
            editor.on('component:click', ()=>{
                console.log('component click')
            });
            // @ts-ignore
            editor.on('component:event:click', ()=>{
                console.log('component click')
            });


            // @ts-ignore
            editor.on('block:click', ()=>{
                console.log('component click')
            });

            // @ts-ignore
            editor.on('component:selected', (e)=>{
                // const {attributes}=e
                // if(attributes.tagName!=='mj-section'){
                //     const editAttrInstance= panelManager.getButton('views','open-sm');
                //     editAttrInstance.active=true
                // }
                const editAttrInstance= panelManager.getButton('views','open-sm');
                editAttrInstance.active=true

                console.log('component:selected',e)
            });
            // @ts-ignore
            editor.on('component:toggled', (e)=>{
                console.log('component:toggled',e)
            });

            // @ts-ignore
            editor.on('wrapper:click', ()=>{
                console.log('wrapper click')
            });


            // @ts-ignore
            editor.on('component:change:active', ()=>{
                console.log('component active')
            });



            // @ts-ignore
            editor.on('component:event:click', ()=>{
                console.log('component click')
            });
            // @ts-ignore
            editor.on(`component:mount`, model => console.log('Global hook: component:mount', model.get('type')));
            // @ts-ignore
            editor.on(`component:update:testprop`, model => console.log('Global hook: component:update:testprop', model.get('type')));
            // @ts-ignore
            editor.on(`component:update:click`, model => console.log('Global hook: component:update:click', model.get('type')));
            // @ts-ignore
            editor.on(`component:remove`, model => console.log('Global hook: component:remove', model.get('type')));
            // @ts-ignore
            editor.on('canvas:click', ()=>{
                console.log('canvas click')
            });

            // @ts-ignore
            // editor.components().forEach(
            //     (inner:any) => {
            //         console.log(inner.props())
            //         console.log(inner,'inner')
            //     }
            // );

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

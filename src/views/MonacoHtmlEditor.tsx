
// @ts-ignore
import { useEffect,useState, forwardRef, useImperativeHandle,useRef} from "react";
import {htmlLangConfig} from './const'
import {htmlString} from './html'

import MonacoEditor,{ monaco }  from 'react-monaco-editor';
// monaco.languages.register({id:'html'})
// // @ts-ignore
// monaco.languages.setMonarchTokensProvider('html',{...htmlLangConfig});

function MonacoHtmlEditor(props:any,ref:any){
    const [content,setContent]=useState(htmlString)

    const iframeRef=useRef<HTMLElement|any>(null)
    const options={
        disableLayerHinting: true
    }

    const renderIframe=(htmlContent:string)=>{
        if(iframeRef?.current?.contentDocument?.body){
            //@ts-ignore
            iframeRef.current.contentDocument.body.innerHTML=htmlContent
        }

    }

    const onChange=(value:string)=>{
        setContent(value)
        renderIframe(value)
    }

    const onEditorDidMount=(editor: any, monaco: any) => {
        // 格式化
        editor.getAction('editor.action.formatDocument').run()
        console.log('format')
    }

    useEffect(()=>{
        if(iframeRef&&iframeRef.current){
            console.log('iframeRef.current',iframeRef.current)
            console.log('iframeRef.current.contentWindow',iframeRef.current.contentWindow)
            renderIframe(htmlString)
        }

    },[])


    useImperativeHandle(ref, () => ({
        getHtml:()=>content
    }))

    // @ts-ignore
    return <>
        <div style={{display:'flex'}} id='monaco_html_id'>
            <div style={{flex:1,textAlign:"left"}}>
                <MonacoEditor
                    width="100%"
                    height="600"
                    language="html"
                    value={content}
                    onChange={onChange}
                    options={options}
                    editorDidMount={onEditorDidMount}
                />
            </div>
            <div style={{flex:1}}>
                <iframe ref={iframeRef} style={{
                    width:'100%',
                    height:'600px'
                }}/>
            </div>
        </div>
        </>
}

export default forwardRef(MonacoHtmlEditor)

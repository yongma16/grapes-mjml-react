import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { CKEditor } from 'ckeditor4-react';
const CkeditorRender=(props:any,ref:any)=>{
    const [data,setData]=useState('<p>Hello from CKEditor 4!</p>')

    useEffect(()=>{
        console.log('editor-module',CKEditor)
    },[])
    const getContent=()=>{

        // @ts-ignore
        return data
    }
    useImperativeHandle(ref, () => ({
        getHtml:getContent,
        getBodyContent:getContent
    }));
    return (
        <div className="Editor">
            <h2>Using CKEditor 4 in React</h2>
            <CKEditor
                initData={data}
                onInstanceReady={ () => {
                    console.log( 'Editor is ready!' );
                } }
                onChange={(val:any)=>{
                    const {editor}=val
                    setData(editor?.getData())
                }}
            />
        </div>
    );
}
export default forwardRef(CkeditorRender);

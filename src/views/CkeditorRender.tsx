import React, { useEffect } from 'react';
import { CKEditor } from 'ckeditor4-react';
const CkeditorRender=(props:any)=>{

    useEffect(()=>{
        console.log('CKEditor',CKEditor)
    },[])
    return (
        <div className="Editor">
            <h2>Using CKEditor 4 in React</h2>
            <CKEditor
                initData="<p>Hello from CKEditor 4!</p>"
                onInstanceReady={ () => {
                    console.log( 'Editor is ready!' );
                } }
            />
        </div>
    );
}
export default CkeditorRender;

import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
import 'tdesign-react/es/style/index.css'; // 少量公共样式
// @ts-ignore
import { Button ,message,InputAdornment, Input,Radio } from "tdesign-react";
// @ts-ignore
import grapesjs from 'grapesjs';
// @ts-ignore
import { useState,useEffect,useRef } from 'react';
import EmailPage from './views/EmailPage'
import UnlayerPage from './views/UnlayerPage'
import CkeditorPage from './views/CkeditorPage'
import CkeditorRender from './views/CkeditorRender'
import CkeditorClassic from './views/CkeditorClassic'
import  {sendEmail} from './service/sendEmailApi'

import html2canvas from "html2canvas";
import { IFrameElementContainer } from "html2canvas/dist/types/dom/replaced-elements/iframe-element-container";


function App() {
  const [editType,setEditType]=useState('mjml');
  const [emailLoading,setEmailLoading]=useState(false);
  const [emailNumber,setEmailNumber]=useState('1432448610@qq.com');

  const emailRef:any=useRef();
  const grapesRef:any=useRef();
  const presetRef:any=useRef();
  const unLayerRef:any=useRef();
  const ckeditorUrl:any=useRef();
  const ckeditorInline:any=useRef();
  const ckeditorModule:any=useRef();



    /** 下载图片 */
    const downloadBase64 = (content:any,fileName:any) => {
        const base64ToBlob = function (code:any) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], {
                type: contentType
            });
        };
        let aLink = document.createElement('a');
        let blob = base64ToBlob(content);
        aLink.download = fileName + '.png';
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
    };

// 截图
    const shotAction=(dom:any)=>{
        console.log('dom',dom)
        html2canvas(dom,{
            allowTaint:true,
            useCORS:true,
            proxy:'localhost',
            scale:2,
        }).then(function(canvas) {
            console.log('canvas',canvas)
            const base64 = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
            const base64img = `data:image/png;base64,${base64}`;
            downloadBase64(base64img, '邮件');
            // document.body.appendChild(canvas);
        });
    }

    const shotImg=async ()=>{
        setEmailLoading(true);
        try {
            if(editType==='grapejs' ||editType==='mjml' ){
                // @ts-ignore
                shotAction(document.getElementsByClassName("gjs-frame")[0].contentWindow.document.body)
            }
            else if(editType==='unlayer'){
                // @ts-ignore
                shotAction(document.getElementById("editor-2"))
            }
            else if(editType==='ckeditor inline'){
                // @ts-ignore
                shotAction(document.getElementById("editor-inline"))
            }
            else if(editType==='ckeditor url'){
                // @ts-ignore
                shotAction(document.getElementById("cke_editor-classic"))
            }
            else if(editType==='ckeditor module'){
                // @ts-ignore
                shotAction(document.getElementById("cke_editor1"))
            }
        }
        catch (e) {
            console.error(e)
        }
        setTimeout(()=>{setEmailLoading(false)},200)
    };

  const sendEmailAction=async ()=>{
      setEmailLoading(true);
      // { text: "ckeditor inline cdn", value: "ckeditor" },
      try{
          let content=''
          if(editType==='grapejs'){
              content=grapesRef.current.getHtml()
          }
          else if(editType==='mjml'){
              content=emailRef.current.getHtml()
          }
          else if(editType==='unlayer'){
              content=await unLayerRef.current.getHtml()
          }
          else if(editType==='ckeditor inline'){
              content=ckeditorInline.current.getHtml()
          }
          else if(editType==='ckeditor url'){
              content=ckeditorUrl.current.getHtml()
          }
          else if(editType==='ckeditor module'){
              content=ckeditorModule.current.getHtml()
          }
          console.log('editType',editType)
          console.log('content',content)
          const data={
              "toUserEmail":emailNumber,
              "title":editType,
              "content":content
          };
          const res=await sendEmail(data)
          if(res&&res.data.code){
              message.success({
                  content: res.data.msg,
              })
          }
          else {
              message.warning({
                  content: res.data.msg,
              })
          }
          setEmailLoading(false)
      }
      catch (e) {
          setEmailLoading(false)
          message.error({
              content: JSON.stringify(e),
          })
      }
  };

  useEffect(()=>{
      console.log('emailRef',emailRef)
  },[]);

  // @ts-ignore
    return (
      <div className="App">
        <header className="App-header">
          <div style={{width:'50%',textAlign:'left',paddingLeft:'10px'}}>
              email web插件 富文本插件 对比

          </div>
            <div style={{minWidth:'150px',fontWeight:'bold',fontSize:'18px'}}>在线编辑邮件</div>
            <div style={{display:'flex',justifyItems:'center',alignItems:'center',float:"right"}}>
                    <div>
                        <InputAdornment prepend="邮箱：">
                            <Input  value={emailNumber} placeholder={'请输入邮箱'} onChange={(value:any)=>setEmailNumber(value)} />
                        </InputAdornment>
                    </div>
                    <div>
                        <Button style={{marginLeft:'20px'}} onClick={()=>sendEmailAction()} type="button"  loading={emailLoading}>发送邮件</Button>
                    </div>
                <div>
                    <Button style={{marginLeft:'20px'}} onClick={()=>shotImg()} type="button"  loading={emailLoading}>截图</Button>
                </div>

                    <div>
                        <Button style={{marginLeft:'20px',lineHeight:'32px',background:'transparent',border:'none'}} onClick={()=>{window.open('https://github.com/yongma16/grapes-mjml-react','blank')}} type="button" >
                            <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true">
                                <path fill={'#fff'}
                                      d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                            </svg>
                        </Button>
                    </div>
            </div>
        </header>
          <div style={{height:'120px',display:'flex',alignItems:'center'}}>
              <Radio.Group variant="default-filled" defaultValue={editType} onChange={(value:any)=>setEditType(value)}>
                  {[
                      { text: "mjml", value: "mjml" },
                      { text: "unlayer", value: "unlayer" },
                      { text: "ckeditor inline cdn", value: "ckeditor inline" },
                      { text: "Ckeditor classic cdn", value: "ckeditor url" },
                      { text: "ckeditor classical npm", value: "ckeditor module" },
                  ].map((item,index)=>{return ( <Radio.Button value={item.value} key={index}>{item.text}</Radio.Button>)})}
              </Radio.Group>


              当前的插件类型：{editType}
          </div>

        <div style={{border:'1px solid #262626'}}>
            {editType==='mjml'&&<EmailPage editInstance={grapesjs} ref={emailRef}
            ></EmailPage>}
            {editType==='unlayer'&&<UnlayerPage ref={unLayerRef}></UnlayerPage>}
            {editType==='ckeditor inline'&&<CkeditorPage ref={ckeditorInline}></CkeditorPage>}
            {editType==='ckeditor url'&&<CkeditorClassic ref={ckeditorUrl}></CkeditorClassic>}
            {editType==='ckeditor module'&&<CkeditorRender ref={ckeditorModule}></CkeditorRender>}
        </div>
      </div>
  );
}

export default App;

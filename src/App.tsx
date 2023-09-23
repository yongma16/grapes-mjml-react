import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
import "tea-component/dist/tea.css";
import { Button ,message,InputAdornment, Input,Segment, Switch, Badge} from "tea-component";
// @ts-ignore
import grapesjs from 'grapesjs';
import { useState,useEffect,useRef } from 'react';
import EmailPage from './views/EmailPage'
import UnlayerPage from './views/UnlayerPage'
import CkeditorPage from './views/CkeditorPage'
import  {sendEmail} from './service/sendEmailApi'


function App() {
  const [editType,setEditType]=useState('mjml');
  const [emailLoading,setEmailLoading]=useState(false);
  const [emailNumber,setEmailNumber]=useState('1432448610@qq.com');
  const changeEditype=(val:string)=>{
    setEditType(val)
  };

  const emailRef:any=useRef();
  const grapesRef:any=useRef();
  const presetRef:any=useRef();
  const unLayerRef:any=useRef();


  const sendEmailAction=async ()=>{
      setEmailLoading(true);
      try{
          let content=''
          if(editType==='grapejs'){
              console.log(grapesRef)
              content=grapesRef.current.getHtml()
          }
          else if(editType==='mjml'){
              console.log(emailRef)
              content=emailRef.current.getHtml()
          }
          else if(editType==='unlayer'){
              console.log(unLayerRef)
              content=await unLayerRef.current.getHtml()
          }
          else{
              console.log(presetRef)
              content=presetRef.current.getHtml()
          }
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

  return (
      <div className="App">
        <header className="App-header">
          <div style={{width:'50%',textAlign:'left',paddingLeft:'10px'}}>
              email web插件 富文本插件 对比
              <Segment
                  style={{margin:'0 20px'}}
                  rimless={false}
                  value={editType.toString()}
                  onChange={value => changeEditype(value)}
                  options={[
                      { text: "mjml", value: "mjml" },
                      { text: "unlayer", value: "unlayer" },
                      { text: "ckeditor inline html", value: "ckeditor" },
                  ]}
              />


              当前的插件类型：{editType}
          </div>
            <div style={{minWidth:'150px',fontWeight:'bold',fontSize:'18px'}}>在线编辑邮件</div>
            <div style={{width:'50%',textAlign:'right',paddingRight:'10px'}}>
                <section>
                    <InputAdornment before="邮箱：">
                        <Input  value={emailNumber} placeholder={'请输入邮箱'} onChange={(value:any)=>setEmailNumber(value)} />
                    </InputAdornment>
                    <Button style={{marginLeft:'20px'}} onClick={()=>sendEmailAction()} type="primary"  loading={emailLoading}>发送邮件</Button>

                    <Button style={{marginLeft:'20px',lineHeight:'32px',background:'transparent',border:'none'}} onClick={()=>{window.open('https://github.com/yongma16/grapes-mjml-react','blank')}} type="primary" >
                            <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true">
                                <path fill={'#fff'}
                                    d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                            </svg>
                    </Button>
                </section>


            </div>
        </header>

        {/*{editType==='grapejs'&&<GrapesPage editInstance={grapesjs} ref={grapesRef}></GrapesPage>}*/}
        {editType==='mjml'&&<EmailPage editInstance={grapesjs} ref={emailRef}
        ></EmailPage>}
        {/*{editType==='preset'&&<PresetPage editInstance={grapesjs} ref={presetRef}></PresetPage>}*/}
        {editType==='unlayer'&&<UnlayerPage ref={unLayerRef}></UnlayerPage>}
        {editType==='ckeditor'&&<CkeditorPage ></CkeditorPage>}
      </div>
  );
}

export default App;

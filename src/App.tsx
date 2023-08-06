import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import grapesjs from 'grapesjs';
import { useState,useEffect,useRef } from 'react';
import PresetPage from './views/PresetPage'
import EmailPage from './views/EmailPage'
import GrapesPage from './views/GrapesPage'
import  {sendEmail} from './service/sendEmailApi'

function App() {
  const [editType,setEditType]=useState('mjml');
  const [emailNumber,setEmailNumber]=useState('1432448610@qq.com');
  const changeEditype=(val:string)=>{
    setEditType(val)
  };

  const emailRef:any=useRef();
  const grapesRef:any=useRef();
  const presetRef:any=useRef();


  const sendEmailAction=()=>{
      let content=''
      if(editType==='grapejs'){
          console.log(grapesRef)
          content=grapesRef.current.getHtml()
      }
      else if(editType==='mjml'){
          console.log(emailRef)
          content=emailRef.current.getHtml()
      }
      else{
          console.log(presetRef)
          content=presetRef.current.getHtml()
      }
      const data={
          "toUserEmail":emailNumber,
          "title":editType,
          "content":content
      };
      sendEmail(data)
  }

  useEffect(()=>{
      console.log('emailRef',emailRef)
  },[])

  return (
      <div className="App">
        <header className="App-header">
          <div style={{width:'50%',textAlign:'left',paddingLeft:'10px'}}>
              grapes web插件 对比
              <button style={{marginLeft:'20px'}} onClick={()=>changeEditype('grapejs')}>grapejs</button>
              <button style={{marginLeft:'20px'}} onClick={()=>changeEditype('mjml')}>mjml</button>
              <button style={{margin:'0 20px'}} onClick={()=>changeEditype('preset')}>preset newsletter</button>

              当前的插件类型：{editType}
          </div>
            <div style={{width:'50%',textAlign:'right',paddingRight:'10px'}}>
                邮箱：<input value={'143248610@qq.com'} placeholder={'请输入邮箱'} onChange={(value:any)=>setEmailNumber(value)}></input>
                <button style={{marginLeft:'20px'}} onClick={()=>sendEmailAction()}>发送邮件</button>
            </div>
        </header>

        {editType==='grapejs'&&<GrapesPage editInstance={grapesjs} ref={grapesRef}></GrapesPage>}
        {editType==='mjml'&&<EmailPage editInstance={grapesjs} ref={emailRef}
        ></EmailPage>}
        {editType==='preset'&&<PresetPage editInstance={grapesjs} ref={presetRef}></PresetPage>}
      </div>
  );
}

export default App;

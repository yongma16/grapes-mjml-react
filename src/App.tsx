import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
import "tea-component/dist/tea.css";
import { Button ,message,InputAdornment, Input,Segment, Switch, Badge} from "tea-component";
// @ts-ignore
import grapesjs from 'grapesjs';
import { useState,useEffect,useRef } from 'react';
import PresetPage from './views/PresetPage'
import EmailPage from './views/EmailPage'
import GrapesPage from './views/GrapesPage'
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


  const sendEmailAction=async ()=>{
      setEmailLoading(true)
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
  }

  useEffect(()=>{
      console.log('emailRef',emailRef)
  },[])

  return (
      <div className="App">
        <header className="App-header">
          <div style={{width:'50%',textAlign:'left',paddingLeft:'10px'}}>
              grapes web插件 对比
              <Segment
                  style={{margin:'0 20px'}}
                  rimless={false}
                  value={editType.toString()}
                  onChange={value => changeEditype(value)}
                  options={[
                      { text: "grapejs", value: "grapejs" },
                      { text: "mjml", value: "mjml" },
                      { text: "preset", value: "preset" }]}
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
                </section>


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

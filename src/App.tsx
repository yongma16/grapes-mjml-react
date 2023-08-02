import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import { useEffect,useState } from 'react';
import PresetPage from './views/PresetPage'
import EmailPage from './views/EmailPage'

function App() {
  const [editor,setEditor]=useState();
  const [domRef,setDomRef]=useState();
  const [editType,setEditType]=useState('grapejs');



  const renderGrape = () => {
    if(domRef&&!editor){
      const editorInstance:any = grapesjs.init({
        container: '#gjs',
        components: '<div class="txt-red">Hello world!</div>',
        style: '.txt-red{color: red}',

      });
      setEditor(editorInstance)
    }
  }

  useEffect(()=>{
    if(editType==='grapejs'){
      renderGrape()
    }
  },[domRef,editType])


  return (
      <div className="App">
        <header className="App-header">
          Learn grapes
          <button style={{marginLeft:'20px'}} onClick={()=>{
            setEditType('grapejs')
          }}>grapejs</button>
          <button style={{marginLeft:'20px'}} onClick={()=>{
            setEditType('mjml')
          }}>mjml</button>
          <button style={{margin:'0 20px'}} onClick={()=>{
            setEditType('preset')
          }}>preset</button>

          {editType}
        </header>
        {editType==='grapejs' &&<div id={'gjs'} style={{
          width:'800px',
          height:'800px'
        }}
          ref={(ref:any)=>{
          setDomRef(ref)
        }}
          ></div>
        }

        {editType==='mjml'&&<EmailPage editInstance={grapesjs}></EmailPage>}
        {editType==='preset'&&<PresetPage editInstance={grapesjs}></PresetPage>}
      </div>
  );
}

export default App;

import './App.css';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import { useState } from 'react';
import PresetPage from './views/PresetPage'
import EmailPage from './views/EmailPage'
import GrapesPage from './views/GrapesPage'

function App() {
  const [editType,setEditType]=useState('mjml');
  const changeEditype=(val:string)=>{
    setEditType(val)
  };

  return (
      <div className="App">
        <header className="App-header">
          Learn grapes
          <button style={{marginLeft:'20px'}} onClick={()=>changeEditype('grapejs')}>grapejs</button>
          <button style={{marginLeft:'20px'}} onClick={()=>changeEditype('mjml')}>mjml</button>
          <button style={{margin:'0 20px'}} onClick={()=>changeEditype('preset')}>preset</button>

          {editType}
        </header>

        {editType==='grapejs'&&<GrapesPage editInstance={grapesjs}></GrapesPage>}
        {editType==='mjml'&&<EmailPage editInstance={grapesjs}></EmailPage>}
        {editType==='preset'&&<PresetPage editInstance={grapesjs}></PresetPage>}
      </div>
  );
}

export default App;

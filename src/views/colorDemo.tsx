  // @ts-ignore
  import { Button ,message} from "tdesign-react";
  import {useRef} from 'react'
  const ColorDemo=()=>{

    const divRef=useRef(null)
    const openColorPicker=()=>{
      //@ts-ignore
      if (!window.EyeDropper) {
        message.warning("你的浏览器不支持 EyeDropper API")
        return;
      }
      //@ts-ignore
      const eyeDropper = new EyeDropper();

      eyeDropper
        .open()
        .then((result:any) => {
          console.log('result.sRGBHex',result.sRGBHex)
          //@ts-ignore
          divRef.current.style.background=result.sRGBHex
        })
        .catch((e:any) => {
          console.error(e)
        });
    };
    return <>
    color picker
  <div>

    <div ref={divRef} style={{width:'200px',height:'200px',background:'blue',border:'1px solid #dcdcdc',margin:'0 auto'}}>

    </div>
  <br/>
    <Button onClick={openColorPicker}>打开拾色器</Button>
  </div>
    </>
  }
  export default ColorDemo;

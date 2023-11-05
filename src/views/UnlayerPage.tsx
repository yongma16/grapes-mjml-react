// @ts-ignore
import EmailEditor from 'react-email-editor';
// @ts-ignore
import { useRef,forwardRef ,useImperativeHandle} from "react";
// @ts-ignore
import { Button} from "tdesign-react";
const downHtml=(html:any)=>{
    let fileName = 'unlayer-html文件';
    fileName = fileName + '_'+(new Date()).valueOf()
    const uri = 'data:application/vnd.ms-html;base64,';
    // 下载
    const template = html;
    const downloadLink = document.createElement("a");
    // 输出base64编码
    const base64 = (s:any) => window.btoa(unescape(encodeURIComponent(s)));
    downloadLink.href = uri + base64(template);
    downloadLink.download = fileName + '.html';
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
const UnlayerPage=(props:any,ref:any)=>{
    const emailEditorRef:any = useRef(null);

    const exportHtml = async () => {
        return new Promise(resolve=>{
            try{
                if(!emailEditorRef){
                    resolve('')
                }
                emailEditorRef.current.editor.exportHtml((data:any) => {
                    const { design, html } = data;
                    console.log('exportHtml', html);
                    resolve(html)
                });
            }
            catch(e){
                resolve(e)
            }
        })
    };

    const downHtmlVal=async ()=>{
        // @ts-ignore
        const html=await exportHtml()
        downHtml(html)
    }


    useImperativeHandle(ref, () => ({
        getHtml:exportHtml
    }));

    const onReady = () => {
        // editor is ready
        // you can load your template here;
        // const templateJson = {};
        // emailEditorRef.current.editor.loadDesign(templateJson);
    };
    // @ts-ignore
    return (<>
        <div style={{position:'relative',textAlign:'right',height:'40px',lineHeight:'40px'}}>
            <Button onClick={downHtmlVal}>导出 HTML</Button>
        </div>
        <EmailEditor ref={emailEditorRef} onReady={onReady} style={{height:'90vh',width:'100vw',}}/>
    </>)
};

export default forwardRef(UnlayerPage);

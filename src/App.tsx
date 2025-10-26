import "./App.css";
import "grapesjs/dist/css/grapes.min.css";
import "tdesign-react/es/style/index.css";
import { useState, useEffect } from "react";
import { message } from "tdesign-react";
import { EditorType, DEFAULT_EDITOR_TYPE } from "./constants/editorTypes";
import { useEditorManager } from "./hooks/useEditorManager";
import { sendEmail } from "./service/sendEmailApi";
import AppHeader from "./components/AppHeader";
import EditorSelector from "./components/EditorSelector";
import EditorContainer from "./components/EditorContainer";

function App() {
  const [editType, setEditType] = useState<EditorType>(DEFAULT_EDITOR_TYPE);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailNumber, setEmailNumber] = useState("1432448610@qq.com");
  const [emailTitle, setEmailTitle] = useState<string>(DEFAULT_EDITOR_TYPE);

  const { refs, getEditorHtml, captureEditorScreenshot } = useEditorManager();

  // 更新邮件标题当编辑器类型改变时
  useEffect(() => {
    setEmailTitle(editType);
  }, [editType]);

  /**
   * 发送邮件
   */
  const handleSendEmail = async () => {
    setEmailLoading(true);
    try {
      const content = await getEditorHtml(editType);
      
      console.log("editType", editType);
      console.log("content", content);

      const data = {
        toUserEmail: emailNumber,
        title: emailTitle,
        content: content,
      };

      const res = await sendEmail(data);
      
      if (res?.data?.code) {
        message.success({
          content: res.data.msg,
        });
      } else {
        message.warning({
          content: res.data.msg,
        });
      }
    } catch (e) {
      message.error({
        content: JSON.stringify(e),
      });
    } finally {
      setEmailLoading(false);
    }
  };

  /**
   * 截图
   */
  const handleScreenshot = async () => {
    setEmailLoading(true);
    try {
      await captureEditorScreenshot(editType);
    } catch (e) {
      console.error("截图失败:", e);
      message.error({
        content: "截图失败，请重试",
      });
    } finally {
      setTimeout(() => {
        setEmailLoading(false);
      }, 200);
    }
  };

  return (
    <div className="App">
      <AppHeader
        emailTitle={emailTitle}
        emailNumber={emailNumber}
        loading={emailLoading}
        onEmailTitleChange={setEmailTitle}
        onEmailNumberChange={setEmailNumber}
        onSendEmail={handleSendEmail}
        onScreenshot={handleScreenshot}
      />
      
      <EditorSelector
        currentType={editType}
        onTypeChange={setEditType}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <EditorContainer editType={editType} refs={refs} />
      </div>
    </div>
  );
}

export default App;

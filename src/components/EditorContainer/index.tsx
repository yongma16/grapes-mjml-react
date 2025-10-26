/**
 * 编辑器容器组件
 */
import React from "react";
import { EditorType } from "../../constants/editorTypes";
import { EditorRefs } from "../../hooks/useEditorManager";
import EmailPage from "../../views/EmailPage";
import VideoCover from "../../views/videoCover/index";
import UnlayerPage from "../../views/UnlayerPage";
import MonacoHtmlEditor from "../../views/monacoEditor/MonacoHtmlEditor";
import ReacrDragDemo from "../../views/drag-box/index";
import ColorDemo from "../../views/colorDemo";
import ScrollDemo from "../../views/scrollDemo";
import grapesjs from "grapesjs";
import "./styles.css";

interface EditorContainerProps {
  editType: EditorType;
  refs: EditorRefs;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ editType, refs }) => {
  const renderEditor = () => {
    switch (editType) {
      case EditorType.SCROLL_DEMO:
        return <ScrollDemo />;
      case EditorType.VIDEO_COVER:
        return <VideoCover />;
      case EditorType.COLOR_DEMO:
        return <ColorDemo />;
      case EditorType.REACT_DRAG:
        return <ReacrDragDemo />;
      case EditorType.MONACO:
        return <MonacoHtmlEditor ref={refs.monacoHtmlRef} />;
      case EditorType.MJML:
        return <EmailPage editInstance={grapesjs} ref={refs.emailRef} />;
      case EditorType.UNLAYER:
        return <UnlayerPage ref={refs.unLayerRef} />;
      // case EditorType.CKEDITOR_INLINE:
      //   return <CkeditorPage ref={refs.ckeditorInline} />;
      // case EditorType.CKEDITOR_URL:
      //   return <CkeditorClassic ref={refs.ckeditorUrl} />;
      // case EditorType.CKEDITOR_MODULE:
      //   return <CkeditorRender ref={refs.ckeditorModule} />;
      default:
        return null;
    }
  };

  return <div className="editor-container">{renderEditor()}</div>;
};

export default EditorContainer;


/**
 * 编辑器管理器 Hook
 * 统一管理不同编辑器的引用和操作
 */
import { useRef, RefObject } from "react";
import { EditorType } from "../constants/editorTypes";
import { captureScreenshot } from "../utils/screenshotUtils";

export interface EditorRef {
  getHtml: () => string | Promise<string>;
}

export interface EditorRefs {
  emailRef: RefObject<EditorRef>;
  grapesRef: RefObject<EditorRef>;
  presetRef: RefObject<EditorRef>;
  unLayerRef: RefObject<EditorRef>;
  ckeditorUrl: RefObject<EditorRef>;
  ckeditorInline: RefObject<EditorRef>;
  ckeditorModule: RefObject<EditorRef>;
  monacoHtmlRef: RefObject<EditorRef>;
}

/**
 * 获取编辑器的 DOM 元素用于截图
 */
function getEditorDom(editType: EditorType): HTMLElement | null {
  switch (editType) {
    case EditorType.MJML:
      // @ts-ignore
      return document.getElementsByClassName("gjs-frame")?.[0]?.contentWindow?.document.body || null;
    case EditorType.UNLAYER:
      // @ts-ignore
      return document.getElementById("editor-2");
    case EditorType.MONACO:
      // @ts-ignore
      return document.getElementById("monaco_html_id");
    // case EditorType.CKEDITOR_INLINE:
    //   // @ts-ignore
    //   return document.getElementById("editor-inline");
    // case EditorType.CKEDITOR_URL:
    //   // @ts-ignore
    //   return document.getElementById("cke_editor-classic");
    // case EditorType.CKEDITOR_MODULE:
    //   // @ts-ignore
    //   return document.getElementById("cke_editor1");
    default:
      return null;
  }
}

/**
 * 编辑器管理器 Hook
 */
export function useEditorManager() {
  const emailRef = useRef<EditorRef>(null);
  const grapesRef = useRef<EditorRef>(null);
  const presetRef = useRef<EditorRef>(null);
  const unLayerRef = useRef<EditorRef>(null);
  const ckeditorUrl = useRef<EditorRef>(null);
  const ckeditorInline = useRef<EditorRef>(null);
  const ckeditorModule = useRef<EditorRef>(null);
  const monacoHtmlRef = useRef<EditorRef>(null);

  const refs: EditorRefs = {
    emailRef,
    grapesRef,
    presetRef,
    unLayerRef,
    ckeditorUrl,
    ckeditorInline,
    ckeditorModule,
    monacoHtmlRef,
  };

  /**
   * 根据编辑器类型获取 HTML 内容
   */
  const getEditorHtml = async (editType: EditorType): Promise<string> => {
    const refMap: Record<EditorType, RefObject<EditorRef> | null> = {
      [EditorType.MONACO]: monacoHtmlRef,
      [EditorType.MJML]: emailRef,
      [EditorType.UNLAYER]: unLayerRef,
      // [EditorType.CKEDITOR_INLINE]: ckeditorInline,
      // [EditorType.CKEDITOR_URL]: ckeditorUrl,
      // [EditorType.CKEDITOR_MODULE]: ckeditorModule,
      [EditorType.SCROLL_DEMO]: null,
      [EditorType.VIDEO_COVER]: null,
      [EditorType.COLOR_DEMO]: null,
      [EditorType.REACT_DRAG]: null,
    };

    const ref = refMap[editType];
    if (!ref?.current) {
      return "";
    }

    const html = ref.current.getHtml();
    return html instanceof Promise ? await html : html;
  };

  /**
   * 对当前编辑器进行截图
   */
  const captureEditorScreenshot = async (editType: EditorType): Promise<void> => {
    const dom = getEditorDom(editType);
    if (!dom) {
      console.warn(`无法找到编辑器 ${editType} 的 DOM 元素`);
      return;
    }
    await captureScreenshot(dom);
  };

  return {
    refs,
    getEditorHtml,
    captureEditorScreenshot,
  };
}


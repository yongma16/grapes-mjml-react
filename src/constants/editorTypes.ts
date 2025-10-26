/**
 * 编辑器类型定义和配置
 */

export enum EditorType {
  SCROLL_DEMO = "scroll-demo",
  VIDEO_COVER = "VideoCover",
  COLOR_DEMO = "color-demo",
  REACT_DRAG = "react-drag",
  MONACO = "monaco",
  MJML = "mjml",
  UNLAYER = "unlayer",
  // CKEDITOR_INLINE = "ckeditor inline",
  // CKEDITOR_URL = "ckeditor url",
  // CKEDITOR_MODULE = "ckeditor module",
}

export interface EditorOption {
  text: string;
  value: EditorType;
}

export const EDITOR_OPTIONS: EditorOption[] = [
  { text: "scroll-demo", value: EditorType.SCROLL_DEMO },
  { text: "youtube tiktok video cover", value: EditorType.VIDEO_COVER },
  { text: "color-demo", value: EditorType.COLOR_DEMO },
  { text: "react-drag", value: EditorType.REACT_DRAG },
  { text: "monaco editor", value: EditorType.MONACO },
  { text: "mjml", value: EditorType.MJML },
  { text: "unlayer", value: EditorType.UNLAYER },
];

export const DEFAULT_EDITOR_TYPE = EditorType.MONACO;


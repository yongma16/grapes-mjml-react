/**
 * 截图工具函数
 */
import html2canvas from "html2canvas";
import { downloadBase64 } from "./imageUtils";

/**
 * 截图配置
 */
const SCREENSHOT_CONFIG = {
  allowTaint: true,
  useCORS: true,
  proxy: "localhost",
  scale: 2,
} as const;

/**
 * 对指定 DOM 元素进行截图
 */
export async function captureScreenshot(dom: HTMLElement, fileName: string = "邮件"): Promise<void> {
  try {
    const canvas = await html2canvas(dom, SCREENSHOT_CONFIG);
    const base64 = canvas
      .toDataURL()
      .replace(/^data:image\/(png|jpg);base64,/, "");
    const base64img = `data:image/png;base64,${base64}`;
    downloadBase64(base64img, fileName);
  } catch (error) {
    console.error("截图失败:", error);
    throw error;
  }
}


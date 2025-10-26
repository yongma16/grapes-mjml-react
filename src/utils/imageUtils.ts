/**
 * 图片处理工具函数
 */

/**
 * 将 base64 转换为 Blob
 */
function base64ToBlob(code: string): Blob {
  const parts = code.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType,
  });
}

/**
 * 下载 base64 图片
 */
export function downloadBase64(content: string, fileName: string): void {
  const aLink = document.createElement("a");
  const blob = base64ToBlob(content);
  aLink.download = `${fileName}.png`;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
}


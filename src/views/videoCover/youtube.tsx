import { useState } from "react";
import { BrowseIcon } from "tdesign-icons-react";
import {
  Input,
  InputAdornment,
  ImageViewer,
  Image,
  Space,
  Button,
} from "tdesign-react";

function mergeCoverWithButton(coverUrl: string, buttonUrl: string) {
  return new Promise((resolve, reject) => {
    // 创建 Canvas 元素
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");

    //@ts-ignore 加载图片资源
    const coverImg = document.createElement("img");
    //@ts-ignore
    const buttonImg = document.createElement("img");
    coverImg.crossOrigin = buttonImg.crossOrigin = "anonymous"; // 处理跨域[2,4](@ref)

    // 封面加载完成
    coverImg.onload = () => {
      // 设置 Canvas 尺寸匹配封面
      canvas.width = coverImg.naturalWidth;
      canvas.height = coverImg.naturalHeight;

      // 绘制封面
      ctx.drawImage(coverImg, 0, 0);

      // 播放按钮加载完成
      buttonImg.onload = () => {
        // 计算居中坐标
        const x = (canvas.width - buttonImg.width) / 2;
        const y = (canvas.height - buttonImg.height) / 2;

        // 绘制播放按钮（带透明度）
        ctx.globalAlpha = 0.8; // 设置透明度[1](@ref)
        ctx.drawImage(buttonImg, x, y);

        // 输出合并后的图片
        resolve(canvas.toDataURL("image/png"));
      };

      buttonImg.onerror = () => reject("播放按钮加载失败");
      buttonImg.src = buttonUrl;
    };

    coverImg.onerror = () => reject("封面加载失败");
    coverImg.src = coverUrl;
  });
}

const Youtube = () => {
  const [youtubeVideoSrc, setyoutubeVideSrc] = useState("");
  const [youtubeVideoCoverUrl, setYoutubeVideoCoverUrl] = useState("");
  const [youtubeVideoMergeCoverUrl, setYoutubeVideoMergeCoverUrl] =
    useState("");

  // 获取 YouTube 封面
  const getYouTubeCover = (videoUrl: string) => {
    try {
      let videoId: any = "";
      // https://youtu.be/ERZBOxBoBCo?si=VIc6I0RLC7ucmfUq  分享链接
      if (videoUrl.startsWith("https://youtu.be/")) {
        videoId = videoUrl.split("https://youtu.be/")[1].split("?")[0];
      } else if (videoUrl.startsWith("https://www.youtube.com/watch?")) {
        //https://www.youtube.com/watch?v=ERZBOxBoBCo
        videoId = videoUrl.match(/v=([^&]+)/)?.[1] || videoUrl.split("/").pop();
      } else if (videoUrl.startsWith("https://www.youtube.com/shorts/")) {
        // https://www.youtube.com/shorts/iYKfzQw_zVM
        videoId = videoUrl
          .split("https://www.youtube.com/shorts/")[1]
          .split("?")[0];
      }
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setYoutubeVideoCoverUrl(thumbnailUrl);
      return thumbnailUrl;
    } catch (error) {
      setYoutubeVideoCoverUrl("");
      throw new Error(`YouTube Error: ${error}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div>
        <InputAdornment prepend="youtube视频地址">
          <Input
            placeholder="请输入youtube地址"
            value={youtubeVideoSrc}
            onChange={(value) => {
              setyoutubeVideSrc(value);
              getYouTubeCover(value);
            }}
          />
        </InputAdornment>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Image
            alt={"test"}
            src={youtubeVideoCoverUrl}
            overlayTrigger="hover"
            fit="contain"
            style={{
              width: 160,
              height: 160,
              border: "4px solid var(--td-bg-color-secondarycontainer)",
              borderRadius: "var(--td-radius-medium)",
              backgroundColor: "#fff",
            }}
          />
          <div>+</div>
          <Image
            alt={"test"}
            src={"/video_play.png"}
            overlayTrigger="hover"
            fit="contain"
            style={{
              width: 160,
              height: 160,
              border: "4px solid var(--td-bg-color-secondarycontainer)",
              borderRadius: "var(--td-radius-medium)",
              backgroundColor: "#fff",
            }}
          />
          <div>
            <Button
              onClick={async () => {
                const res = await mergeCoverWithButton(
                  youtubeVideoCoverUrl,
                  "/video_play.png"
                );
                // @ts-ignore
                setYoutubeVideoMergeCoverUrl(res);
              }}
            >
              点击合并=&gt;
            </Button>
          </div>
          <div>
            <Image
              alt={"test"}
              src={youtubeVideoMergeCoverUrl}
              overlayTrigger="hover"
              fit="contain"
              style={{
                width: 160,
                height: 160,
                border: "4px solid var(--td-bg-color-secondarycontainer)",
                borderRadius: "var(--td-radius-medium)",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Youtube;

import axios from "axios";
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

const Tiktok = () => {
  const [tiktokVideoSrc, setTiktokVideSrc] = useState("");
  const [tiktokVideoCoverUrl, setTiktokVideoCoverUrl] = useState("");
  const [tiktokVideoMergeCoverUrl, setTiktokVideoMergeCoverUrl] = useState("");

  // 获取 tiktok 封面
  const gettiktokCover = async (videoUrl: string) => {
    try {
      // 拼接oEmbed请求地址
      const apiUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;

      // 发送跨域请求（需后端代理或启用CORS）
      const response = await axios.get(apiUrl);
      const data = response.data;

      // 返回封面图URL[1](@ref)
      setTiktokVideoCoverUrl(data.thumbnail_url);
      return data.thumbnail_url;
    } catch (error) {
      setTiktokVideoCoverUrl("");
      throw new Error(`tiktok Error: ${error}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div>
        <InputAdornment prepend="tiktok视频地址">
          <Input
            placeholder="请输入tiktok地址"
            value={tiktokVideoSrc}
            onChange={(value) => {
              setTiktokVideSrc(value);
              gettiktokCover(value);
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
            src={tiktokVideoCoverUrl}
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
                  tiktokVideoCoverUrl,
                  "/video_play.png"
                );
                // @ts-ignore
                setTiktokVideoMergeCoverUrl(res);
              }}
            >
              点击合并=&gt;
            </Button>
          </div>
          <div>
            <Image
              alt={"test"}
              src={tiktokVideoMergeCoverUrl}
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

export default Tiktok;

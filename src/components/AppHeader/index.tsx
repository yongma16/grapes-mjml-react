/**
 * 应用头部组件
 */
import React from "react";
import { Button, message, InputAdornment, Input } from "tdesign-react";
import "./styles.css";

interface AppHeaderProps {
  emailTitle: string;
  emailNumber: string;
  loading: boolean;
  onEmailTitleChange: (value: string) => void;
  onEmailNumberChange: (value: string) => void;
  onSendEmail: () => void;
  onScreenshot: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  emailTitle,
  emailNumber,
  loading,
  onEmailTitleChange,
  onEmailNumberChange,
  onSendEmail,
  onScreenshot,
}) => {
  const handleGithubClick = () => {
    window.open("https://github.com/yongma16/grapes-mjml-react", "_blank");
  };

  return (
    <header className="app-header">
      <div className="app-header__title">
        email web插件 富文本插件 对比
      </div>
      <div className="app-header__center">
        在线编辑邮件
      </div>
      <div className="app-header__actions">
        <div className="app-header__input-group">
          <InputAdornment prepend="邮件标题：">
            <Input
              value={emailTitle}
              placeholder="请输入邮件标题"
              onChange={onEmailTitleChange}
            />
          </InputAdornment>
        </div>
        <div className="app-header__input-group">
          <InputAdornment prepend="邮箱：">
            <Input
              value={emailNumber}
              placeholder="请输入邮箱"
              onChange={onEmailNumberChange}
            />
          </InputAdornment>
        </div>
        <Button
          className="app-header__button"
          onClick={onSendEmail}
          type="button"
          loading={loading}
        >
          发送邮件
        </Button>
        <Button
          className="app-header__button"
          onClick={onScreenshot}
          type="button"
          loading={loading}
        >
          截图
        </Button>
        <Button
          className="app-header__button app-header__button--icon"
          onClick={handleGithubClick}
          type="button"
        >
          <svg
            height="24"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="24"
            data-view-component="true"
          >
            <path
              fill="#fff"
              d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;


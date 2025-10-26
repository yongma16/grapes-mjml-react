/**
 * 编辑器选择器组件
 */
import React from "react";
import { Radio } from "tdesign-react";
import { EditorType, EDITOR_OPTIONS } from "../../constants/editorTypes";
import "./styles.css";

interface EditorSelectorProps {
  currentType: EditorType;
  onTypeChange: (type: EditorType) => void;
}

const EditorSelector: React.FC<EditorSelectorProps> = ({
  currentType,
  onTypeChange,
}) => {
  return (
    <div className="editor-selector">
      <Radio.Group
        variant="default-filled"
        value={currentType}
        onChange={(value: any) => onTypeChange(value as EditorType)}
      >
        {EDITOR_OPTIONS.map((option) => (
          <Radio.Button value={option.value} key={option.value}>
            {option.text}
          </Radio.Button>
        ))}
      </Radio.Group>
      <div className="editor-selector__current">
        当前的插件类型：{currentType}
      </div>
    </div>
  );
};

export default EditorSelector;


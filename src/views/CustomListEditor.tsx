import React, { useState, useRef, useEffect } from 'react';

const RichTextEditor = () => {
    const editorRef = useRef(null);
    const [content, setContent] = useState('<p>这是一个简单的富文本编辑器示例。尝试创建有序列表！</p>');
    const [isOrderedListActive, setIsOrderedListActive] = useState(false);
    const selectionRef = useRef(null);

    // 保存当前选区
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selectionRef.current = selection.getRangeAt(0);
        }
    };

    // 恢复选区
    const restoreSelection = () => {
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRef.current);
        }
    };

    // 处理有序列表命令
    const handleOrderedList = () => {
        saveSelection();

        if (isOrderedListActive) {
            removeOrderedList();
        } else {
            createOrderedList();
        }

        setIsOrderedListActive(!isOrderedListActive);
        restoreSelection();
    };

    // 创建有序列表
    const createOrderedList = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        // 检查是否在列表项中
        const listItem = findClosestListItem(container);
        if (listItem) {
            // 如果已经在列表中，则切换列表类型
            const list = listItem.parentNode;
            if (list.tagName === 'UL') {
                // 将无序列表转换为有序列表
                const newList = document.createElement('ol');
                Array.from(list.childNodes).forEach(child => {
                    newList.appendChild(child.cloneNode(true));
                });
                list.parentNode.replaceChild(newList, list);
            }
            return;
        }

        // 创建新的有序列表
        const newList = document.createElement('ol');
        const listItemElement = document.createElement('li');

        // 处理选区内容
        if (range.collapsed) {
            // 如果选区是空的，添加示例文本
            listItemElement.textContent = '列表项';
        } else {
            // 将选区内容移动到列表项中
            const fragment = range.extractContents();
            listItemElement.appendChild(fragment);
        }

        newList.appendChild(listItemElement);

        // 插入新列表
        range.deleteContents();
        range.insertNode(newList);

        // 更新内容状态
        setContent(editorRef.current.innerHTML);
    };

    // 移除有序列表
    const removeOrderedList = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        const listItem = findClosestListItem(container);
        if (!listItem) return;

        const list = listItem.parentNode;
        if (list.tagName !== 'OL') return;

        // 将列表项转换为段落
        const paragraph = document.createElement('p');
        Array.from(listItem.childNodes).forEach(child => {
            paragraph.appendChild(child.cloneNode(true));
        });

        // 替换列表项
        listItem.parentNode.replaceChild(paragraph, listItem);

        // 如果列表为空，移除整个列表
        if (list.children.length === 0) {
            list.parentNode.removeChild(list);
        }

        // 更新内容状态
        setContent(editorRef.current.innerHTML);
    };

    // 查找最近的列表项
    const findClosestListItem = (node) => {
        while (node && node !== editorRef.current) {
            if (node.tagName === 'LI') {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    };

    // 处理内容变化
    const handleContentChange = () => {
        setContent(editorRef.current.innerHTML);

        // 检查是否在有序列表中
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const listItem = findClosestListItem(container);
            setIsOrderedListActive(!!(listItem && listItem.parentNode.tagName === 'OL'));
        }
    };

    // 处理按键事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // 在列表项中按Enter键时创建新列表项
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const listItem = findClosestListItem(container);

                if (listItem && listItem.parentNode.tagName === 'OL') {
                    e.preventDefault();

                    const newListItem = document.createElement('li');
                    listItem.parentNode.insertBefore(newListItem, listItem.nextSibling);

                    // 移动光标到新列表项
                    const range = document.createRange();
                    range.selectNodeContents(newListItem);
                    range.collapse(true);

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        } else if (e.key === 'Backspace') {
            // 处理在空列表项中按退格键
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const listItem = findClosestListItem(container);

                if (listItem && listItem.parentNode.tagName === 'OL' &&
                    listItem.textContent === '' && range.collapsed) {
                    e.preventDefault();
                    removeOrderedList();
                }
            }
        }
    };

    return (
        <div className="rich-text-editor">
            <div className="toolbar">
                <button
                    className={`toolbar-button ${isOrderedListActive ? 'active' : ''}`}
                    onClick={handleOrderedList}
                    title="有序列表"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 4h12v1H2zm0 4h12v1H2zm0 4h12v1H2z" />
                        <path d="M1 2h1v1H1zm0 4h1v1H1zm0 4h1v1H1z" />
                    </svg>
                </button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                className="editor"
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={handleContentChange}
                onKeyDown={handleKeyDown}
                onBlur={saveSelection}
            />
        </div>
    );
};

export default RichTextEditor;
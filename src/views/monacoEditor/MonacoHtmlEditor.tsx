
// @ts-ignore
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { htmlLangConfig } from '../const'
import { htmlString } from './html'
import './index.css'

import MonacoEditor, { monaco } from 'react-monaco-editor';
// monaco.languages.register({id:'html'})
// // @ts-ignore
// monaco.languages.setMonarchTokensProvider('html',{...htmlLangConfig});

// 默认变量列表
const DEFAULT_VARIABLES = [
    { label: 'userName', insertText: 'userName', detail: '用户名', kind: 'variable' },
    { label: 'userEmail', insertText: 'userEmail', detail: '用户邮箱', kind: 'variable' },
    { label: 'orderNumber', insertText: 'orderNumber', detail: '订单号', kind: 'variable' },
    { label: 'orderDate', insertText: 'orderDate', detail: '订单日期', kind: 'variable' },
    { label: 'productName', insertText: 'productName', detail: '产品名称', kind: 'variable' },
    { label: 'productPrice', insertText: 'productPrice', detail: '产品价格', kind: 'variable' },
    { label: 'totalAmount', insertText: 'totalAmount', detail: '总金额', kind: 'variable' },
    { label: 'companyName', insertText: 'companyName', detail: '公司名称', kind: 'variable' },
];

function MonacoHtmlEditor(props: any, ref: any) {
    const [content, setContent] = useState(localStorage.getItem('html_editor_content') || htmlString)
    const [splitRatio, setSplitRatio] = useState(() => {
        const saved = localStorage.getItem('monaco_split_ratio');
        return saved ? parseFloat(saved) : 50; // 默认 50%
    });
    const [isDragging, setIsDragging] = useState(false);

    const iframeRef = useRef<HTMLElement | any>(null)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const options = {
        disableLayerHinting: true
    }
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<any | null>(null);
    const [isInBrackets, setIsInBrackets] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<{ line: number; column: number } | null>(null);
    const [highlightedRanges, setHighlightedRanges] = useState<any[]>([]);
    const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
    const isApplyingHighlightsRef = useRef<boolean>(false); // 防止递归调用的标志位
    const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 防抖定时器
    
    // 从 props 获取变量列表，如果没有则使用默认列表
    const variables = props.variables || DEFAULT_VARIABLES;

    // 解析内容并高亮 {{}} 表达式
    const parseAndHighlight = (text: string): any[] => {
        const ranges: any[] = [];
        const regex = /\{\{([^}]*)\}\}/g;
        let match;
        console.log('parsing text', text)

        while ((match = regex.exec(text)) !== null) {
            console.log('parseAndHighlight match', match)
            const start = match.index;
            const end = match.index + match[0].length;
            const content = match[1];

            let color = 'green'; // 默认绿色，表示空的 {{}}

            if (content.trim() === '') {
                color = 'green'; // 空的 {{}} 显示绿色
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(content)) {
                color = 'blue'; // 英文变量名显示蓝色
            } else if (/[\u4e00-\u9fa5]/.test(content)) {
                color = 'red'; // 包含中文显示红色
            }

            ranges.push({ start, end, color });
        }

        return ranges;
    };

    // 应用高亮
    const applyHighlights = (ranges: any[]) => {
        if (!editorRef.current || !monacoRef.current || !decorationsRef.current) return;
        
        // 防止递归调用
        if (isApplyingHighlightsRef.current) return;
        isApplyingHighlightsRef.current = true;

        try {
            const monacoInstance = monacoRef.current;
            const decorations: monaco.editor.IModelDeltaDecoration[] = [];

            ranges.forEach(range => {
                const startPos = editorRef.current!.getModel()!.getPositionAt(range.start);
                const endPos = editorRef.current!.getModel()!.getPositionAt(range.end);

                let className = '';
                switch (range.color) {
                    case 'green':
                        className = 'highlight-green';
                        break;
                    case 'blue':
                        className = 'highlight-blue';
                        break;
                    case 'red':
                        className = 'highlight-red';
                        break;
                }

                decorations.push({
                    range: new monacoInstance.Range(
                        startPos.lineNumber,
                        startPos.column,
                        endPos.lineNumber,
                        endPos.column
                    ),
                    options: {
                        inlineClassName: className,
                        hoverMessage: {
                            value: `表达式: {{${editorRef.current!.getModel()!.getValueInRange(
                                new monacoInstance.Range(
                                    startPos.lineNumber,
                                    startPos.column + 2, // 跳过 {{
                                    endPos.lineNumber,
                                    endPos.column - 2    // 跳过 }}
                                )
                            )}}}`
                        }
                    }
                });
            });

            // 只使用 decorationsRef.current.set() 来更新装饰器，避免递归调用
            decorationsRef.current.set(decorations);
        } finally {
            isApplyingHighlightsRef.current = false;
        }
    };

    // 获取当前位置在 {{}} 内的内容范围
    const getBracketRange = (model: any, position: any): { start: any; end: any; content: string, fullRange?: { start: any; end: any } } | null => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilCursor = lineContent.substring(0, position.column - 1);
        const textAfterCursor = lineContent.substring(position.column - 1);

        // 查找最近的 {{
        const lastOpenBracket = textUntilCursor.lastIndexOf('{{');
        if (lastOpenBracket === -1) return null;

        // 检查在 {{ 之后是否已经有 }}
        const nextCloseBracket = textUntilCursor.indexOf('}}', lastOpenBracket);
        if (nextCloseBracket !== -1 && nextCloseBracket > lastOpenBracket) return null;

        // 检查后面是否有 }}
        const futureCloseBracket = textAfterCursor.indexOf('}}');
        if (futureCloseBracket === -1) return null;

        // 计算变量内容的起始和结束位置
        const contentStart = lastOpenBracket + 2;
        const contentEnd = position.column - 1;
        const content = lineContent.substring(contentStart, contentEnd);
        
        // 计算完整的 {{}} 范围（包括大括号）
        const fullBracketEnd = position.column - 1 + futureCloseBracket + 2;

        return {
            start: {
                lineNumber: position.lineNumber,
                column: contentStart + 1
            },
            end: {
                lineNumber: position.lineNumber,
                column: contentEnd + 1
            },
            content: content,
            fullRange: {
                start: {
                    lineNumber: position.lineNumber,
                    column: lastOpenBracket + 1
                },
                end: {
                    lineNumber: position.lineNumber,
                    column: fullBracketEnd + 1
                }
            }
        };
    };

    // 设置自动完成
    const setupCompletions = (monaco: any) => {
        // 为 HTML 语言注册补全提供者
        monaco.languages.registerCompletionItemProvider('html', {
            provideCompletionItems: (model: any, position: any) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });

                // 检查是否在 {{}} 内
                const bracketRange = getBracketRange(model, position);
                if (bracketRange && bracketRange.fullRange) {
                    const inputContent = bracketRange.content.toLowerCase();
                    
                    // 过滤变量列表，根据已输入的内容进行匹配
                    const filteredVariables = variables.filter((varItem: any) => {
                        const label = varItem.label.toLowerCase();
                        return label.includes(inputContent);
                    });

                    // 构建补全建议
                    const suggestions = filteredVariables.map((varItem: any) => {
                        const variableName = varItem.insertText || varItem.label;
                        // 插入格式：类型:{{变量内容}}concat:{{}}
                        const insertText = `类型:{{${variableName}}}concat:{{}}`;
                        
                        return {
                            label: varItem.label,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: insertText,
                            detail: varItem.detail || varItem.label,
                            documentation: varItem.documentation || varItem.detail || `变量: ${varItem.label}`,
                            range: {
                                startLineNumber: bracketRange.fullRange!.start.lineNumber,
                                endLineNumber: bracketRange.fullRange!.end.lineNumber,
                                startColumn: bracketRange.fullRange!.start.column,
                                endColumn: bracketRange.fullRange!.end.column
                            },
                            sortText: varItem.label.startsWith(inputContent) ? '0' : '1' // 完全匹配的排在前面
                        };
                    });

                    return { suggestions };
                }

                // 如果用户输入了单个 {，提供 {{}} 模板
                if (textUntilPosition.endsWith('{') && !textUntilPosition.endsWith('{{')) {
                    return {
                        suggestions: [
                            {
                                label: '{{}}',
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: '{{$1}}',
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column - 1,
                                    endColumn: position.column
                                },
                                documentation: '插入变量模板'
                            }
                        ]
                    };
                }

                // 如果用户输入了 {{，但没有 }}，提供变量列表
                if (textUntilPosition.endsWith('{{')) {
                    const suggestions = variables.map((varItem: any) => {
                        const variableName = varItem.insertText || varItem.label;
                        // 插入格式：类型:{{变量内容}}concat:{{}}
                        const insertText = `类型:{{${variableName}}}concat:{{}}`;
                        
                        return {
                            label: varItem.label,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: insertText,
                            detail: varItem.detail || varItem.label,
                            documentation: varItem.documentation || varItem.detail || `变量: ${varItem.label}`,
                            range: {
                                startLineNumber: position.lineNumber,
                                endLineNumber: position.lineNumber,
                                startColumn: position.column - 2, // 包含 {{
                                endColumn: position.column
                            }
                        };
                    });

                    return { suggestions };
                }

                return { suggestions: [] };
            },
            triggerCharacters: ['{', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        });

        // 同时为 plaintext 注册（兼容性）
        monaco.languages.registerCompletionItemProvider('plaintext', {
            provideCompletionItems: (model: any, position: any) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });

                // 检查是否在 {{}} 内
                const bracketRange = getBracketRange(model, position);
                if (bracketRange && bracketRange.fullRange) {
                    const inputContent = bracketRange.content.toLowerCase();
                    const filteredVariables = variables.filter((varItem: any) => {
                        const label = varItem.label.toLowerCase();
                        return label.includes(inputContent);
                    });

                    const suggestions = filteredVariables.map((varItem: any) => {
                        const variableName = varItem.insertText || varItem.label;
                        // 插入格式：类型:{{变量内容}}concat:{{}}
                        const insertText = `类型:{{${variableName}}}concat:{{}}`;
                        
                        return {
                            label: varItem.label,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: insertText,
                            detail: varItem.detail || varItem.label,
                            documentation: varItem.documentation || varItem.detail || `变量: ${varItem.label}`,
                            range: {
                                startLineNumber: bracketRange.fullRange!.start.lineNumber,
                                endLineNumber: bracketRange.fullRange!.end.lineNumber,
                                startColumn: bracketRange.fullRange!.start.column,
                                endColumn: bracketRange.fullRange!.end.column
                            },
                            sortText: varItem.label.startsWith(inputContent) ? '0' : '1'
                        };
                    });

                    return { suggestions };
                }

                // 如果用户输入了单个 {，提供 {{}} 模板
                if (textUntilPosition.endsWith('{') && !textUntilPosition.endsWith('{{')) {
                    return {
                        suggestions: [
                            {
                                label: '{{}}',
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: '{{$1}}',
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                range: {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: position.column - 1,
                                    endColumn: position.column
                                },
                                documentation: '插入变量模板'
                            }
                        ]
                    };
                }

                // 如果用户输入了 {{，但没有 }}，提供变量列表
                if (textUntilPosition.endsWith('{{')) {
                    const suggestions = variables.map((varItem: any) => {
                        const variableName = varItem.insertText || varItem.label;
                        // 插入格式：类型:{{变量内容}}concat:{{}}
                        const insertText = `类型:{{${variableName}}}concat:{{}}`;
                        
                        return {
                            label: varItem.label,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: insertText,
                            detail: varItem.detail || varItem.label,
                            documentation: varItem.documentation || varItem.detail || `变量: ${varItem.label}`,
                            range: {
                                startLineNumber: position.lineNumber,
                                endLineNumber: position.lineNumber,
                                startColumn: position.column - 2, // 包含 {{
                                endColumn: position.column
                            }
                        };
                    });

                    return { suggestions };
                }

                return { suggestions: [] };
            },
            triggerCharacters: ['{', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        });
    };

    const renderIframe = (htmlContent: string) => {
        if (iframeRef?.current?.contentDocument?.body) {
            //@ts-ignore
            iframeRef.current.contentDocument.body.innerHTML = htmlContent
        }

    }
    // 检查光标是否在 {{}} 内部
    const checkIfInBrackets = (position: monaco.Position): boolean => {
        if (!editorRef.current) return false;

        const model = editorRef.current.getModel();
        if (!model) return false;

        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilCursor = lineContent.substring(0, position.column - 1);
        const textAfterCursor = lineContent.substring(position.column - 1);

        // 查找最近的 {{
        const lastOpenBracket = textUntilCursor.lastIndexOf('{{');
        if (lastOpenBracket === -1) return false;

        // 检查在 {{ 之后是否有 }}
        const nextCloseBracket = textUntilCursor.indexOf('}}', lastOpenBracket);
        if (nextCloseBracket !== -1 && nextCloseBracket > lastOpenBracket) return false;

        // 检查后面是否有 }}
        const futureCloseBracket = textAfterCursor.indexOf('}}');
        if (futureCloseBracket === -1) return false;

        return true;
    };

    // 监听光标位置变化
    const setupCursorListener = () => {
        if (!editorRef.current) return;

        editorRef.current.onDidChangeCursorPosition((e) => {
            const position = e.position;
            setCursorPosition({ line: position.lineNumber, column: position.column });

            const inBrackets = checkIfInBrackets(position);
            setIsInBrackets(inBrackets);
        });
    };

    // 获取当前 {{}} 内的内容
    const getCurrentBracketContent = (position: monaco.Position): string => {
        if (!editorRef.current) return '';

        const model = editorRef.current.getModel();
        if (!model) return '';

        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilCursor = lineContent.substring(0, position.column - 1);

        const lastOpenBracket = textUntilCursor.lastIndexOf('{{');
        if (lastOpenBracket === -1) return '';

        return textUntilCursor.substring(lastOpenBracket + 2);
    };

    const onChange = (value: string) => {
        localStorage.setItem('html_editor_content', value)
        setContent(value)
        renderIframe(value)
    }

    const onEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // 格式化（需要在编辑器完全初始化后执行）
        setTimeout(() => {
            const formatAction = editor.getAction('editor.action.formatDocument');
            if (formatAction) {
                formatAction.run().catch((err: any) => {
                    console.warn('格式化失败:', err);
                });
            }
        }, 100);

        // 创建装饰器集合
        decorationsRef.current = editor.createDecorationsCollection();

        // 初始高亮
        const initialRanges = parseAndHighlight(editor.getValue());
        applyHighlights(initialRanges);

        // 监听内容变化（添加防抖避免频繁调用）
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            setContent(value);

            // 清除之前的定时器
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            // 使用防抖来延迟应用高亮，避免频繁调用
            highlightTimeoutRef.current = setTimeout(() => {
                const newRanges = parseAndHighlight(value);
                setHighlightedRanges(newRanges);
                applyHighlights(newRanges);
            }, 100);

            // 检查是否刚输入了 {{，如果是则触发补全
            const position = editor.getPosition();
            if (position) {
                const model = editor.getModel();
                if (model) {
                    const lineContent = model.getLineContent(position.lineNumber);
                    const textUntilCursor = lineContent.substring(0, position.column - 1);

                    // 如果刚输入了 {{，延迟触发补全
                    if (textUntilCursor.endsWith('{{')) {
                        setTimeout(() => {
                            editor.trigger('', 'editor.action.triggerSuggest', {});
                        }, 100);
                    }
                }
            }
        });

        // 添加输入建议
        setupCompletions(monaco);
        // 监听选取
        setupCursorListener();
    }

    useEffect(() => {
        if (iframeRef && iframeRef.current) {
            console.log('iframeRef.current', iframeRef.current)
            console.log('iframeRef.current.contentWindow', iframeRef.current.contentWindow)
            renderIframe(htmlString)
        }

        // 清理定时器
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, [])


    // 拖拽优化：使用 requestAnimationFrame 提升性能
    const rafRef = useRef<number | null>(null);

    // 处理分割条拖拽
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;
            
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            
            // 限制在 20% 到 80% 之间
            const newRatio = Math.max(20, Math.min(80, percentage));
            
            // 使用 requestAnimationFrame 优化性能，但不要限制太严格
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setSplitRatio(newRatio);
                
                // 更新编辑器布局（使用 debounce）
                if (editorRef.current) {
                    editorRef.current.layout();
                }
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            
            // 取消待处理的动画帧
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            
            // 保存到 localStorage
            localStorage.setItem('monaco_split_ratio', splitRatio.toString());
            
            // 最终触发布局更新
            requestAnimationFrame(() => {
                if (editorRef.current) {
                    editorRef.current.layout();
                }
            });
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isDragging]);

    // 监听窗口大小变化，更新编辑器布局
    useEffect(() => {
        const handleResize = () => {
            if (editorRef.current) {
                setTimeout(() => {
                    editorRef.current?.layout();
                }, 100);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useImperativeHandle(ref, () => ({
        getHtml: () => content
    }))

    // @ts-ignore
    return <>
        <div 
            ref={containerRef}
            style={{ 
                display: 'flex', 
                height: '100%',
                minHeight: '600px',
                position: 'relative',
                '--split-ratio': `${splitRatio}%`
            } as React.CSSProperties}
            id='monaco_html_id'
        >
            <div style={{ 
                width: `${splitRatio}%`, 
                textAlign: "left",
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #e0e0e0',
                boxSizing: 'border-box',
                transition: isDragging ? 'none' : 'width 0.2s ease',
                flexShrink: 0
            }}>
                <MonacoEditor
                    width="100%"
                    height="600"
                    language="html"
                    value={content}
                    onChange={onChange}
                    options={options}
                    editorDidMount={onEditorDidMount}
                />

                <div style={{ 
                    padding: '10px',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5'
                }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        检测到 {highlightedRanges.length} 个表达式
                        {highlightedRanges.length > 0 && (
                            <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {highlightedRanges.map((range, index) => {
                                    const contentSlice = content.slice(range.start + 2, range.end - 2);
                                    return (
                                        <span 
                                            key={index}
                                            style={{
                                                padding: '2px 6px',
                                                backgroundColor: range.color === 'green' ? 'rgba(0, 255, 0, 0.2)' : 
                                                               range.color === 'blue' ? 'rgba(0, 0, 255, 0.2)' : 
                                                               'rgba(255, 0, 0, 0.2)',
                                                borderRadius: '3px',
                                                fontSize: '11px'
                                            }}
                                        >
                                            {contentSlice}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* 可拖拽的分割条 */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    width: '4px',
                    cursor: 'col-resize',
                    backgroundColor: isDragging ? '#1890ff' : '#d0d0d0',
                    position: 'relative',
                    transition: isDragging ? 'none' : 'background-color 0.2s',
                    flexShrink: 0,
                    zIndex: 10,
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
                title="拖拽调整宽度"
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '40px',
                    borderRadius: '2px',
                    backgroundColor: isDragging ? '#1890ff' : '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                    }}>
                        <div style={{ width: '12px', height: '2px', backgroundColor: '#999' }}></div>
                        <div style={{ width: '12px', height: '2px', backgroundColor: '#999' }}></div>
                        <div style={{ width: '12px', height: '2px', backgroundColor: '#999' }}></div>
                    </div>
                </div>
            </div>
            
            <div style={{ 
                width: `${100 - splitRatio}%`,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                transition: isDragging ? 'none' : 'width 0.2s ease',
                flexShrink: 0
            }}>
                <div style={{
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    预览区域
                </div>
                <iframe 
                    ref={iframeRef} 
                    style={{
                        width: '100%',
                        height: '600px',
                        border: 'none',
                        flex: 1
                    }} 
                />
            </div>
        </div>
    </>
}

export default forwardRef(MonacoHtmlEditor)

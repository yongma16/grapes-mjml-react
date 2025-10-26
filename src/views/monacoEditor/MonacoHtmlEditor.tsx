
// @ts-ignore
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { htmlLangConfig } from '../const'
import { htmlString } from './html'
import './index.css'

import MonacoEditor, { monaco } from 'react-monaco-editor';
// monaco.languages.register({id:'html'})
// // @ts-ignore
// monaco.languages.setMonarchTokensProvider('html',{...htmlLangConfig});

function MonacoHtmlEditor(props: any, ref: any) {
    const [content, setContent] = useState(localStorage.getItem('html_editor_content') || htmlString)

    const iframeRef = useRef<HTMLElement | any>(null)
    const options = {
        disableLayerHinting: true
    }
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<any | null>(null);
    const [isInBrackets, setIsInBrackets] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<{ line: number; column: number } | null>(null);
    const [highlightedRanges, setHighlightedRanges] = useState<any[]>([]);
    const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

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
        if (!editorRef.current || !monacoRef.current) return;

        const monacoInstance = monacoRef.current;
        const decorations: monaco.editor.IModelDeltaDecoration[] = [];

        console.log('ranges', ranges)
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

        // 清除旧的高亮并应用新的
        const decorationIds = editorRef.current.deltaDecorations([], decorations);

        // 保存装饰器引用以便后续清理
        if (decorationsRef.current) {
            decorationsRef.current.clear();
            decorationsRef.current.set(decorations);
        }
    };

    // 设置自动完成
    const setupCompletions = (monaco: any) => {
        monaco.languages.registerCompletionItemProvider('plaintext', {
            provideCompletionItems: (model: any, position: any) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });

                // 如果用户输入了 { 或 {{，提供自动完成
                if (textUntilPosition.endsWith('{') || textUntilPosition.endsWith('{{')) {
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
                                }
                            }
                        ]
                    };
                }

                return { suggestions: [] };
            },
            triggerCharacters: ['{']
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

            // 如果在括号内，触发自动完成
            if (inBrackets) {
                setTimeout(() => {
                    editorRef.current?.trigger('', 'editor.action.triggerSuggest', {});
                }, 300);
            }
        });

        // 监听内容变化
        editorRef.current.onDidChangeModelContent(() => {
            if (!editorRef.current) return;

            const value = editorRef.current.getValue();
            const newRanges = parseAndHighlight(value);
            setHighlightedRanges(newRanges);
            applyHighlights(newRanges);

            // 更新光标位置状态
            const position = editorRef.current.getPosition();
            if (position) {
                const inBrackets = checkIfInBrackets(position);
                setIsInBrackets(inBrackets);
                setCursorPosition({ line: position.lineNumber, column: position.column });
            }
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
        // 格式化
        editor.getAction('editor.action.formatDocument').run()
        console.log('format')

        editorRef.current = editor;
        monacoRef.current = monaco;

        // 创建装饰器集合
        decorationsRef.current = editor.createDecorationsCollection();

        // 初始高亮
        const initialRanges = parseAndHighlight(editor.getValue());
        applyHighlights(initialRanges);

        // 监听内容变化
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            setContent(value);

            const newRanges = parseAndHighlight(value);
            setHighlightedRanges(newRanges);
            applyHighlights(newRanges);
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

    }, [])


    useImperativeHandle(ref, () => ({
        getHtml: () => content
    }))

    // @ts-ignore
    return <>
        <div style={{ display: 'flex' }} id='monaco_html_id'>
            <div style={{ flex: 1, textAlign: "left" }}>
                <MonacoEditor
                    width="100%"
                    height="600"
                    language="html"
                    value={content}
                    onChange={onChange}
                    options={options}
                    editorDidMount={onEditorDidMount}
                />

                <div>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        检测到 {highlightedRanges.length} 个表达式
                        {highlightedRanges.map((range, index) => {
                            const contentSlice = content.slice(range.start + 2, range.end - 2);
                            return (
                                <div key={index}>
                                    [{range.color}]
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <iframe ref={iframeRef} style={{
                    width: '100%',
                    height: '600px'
                }} />
            </div>
        </div>
    </>
}

export default forwardRef(MonacoHtmlEditor)

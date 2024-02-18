"use client";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from 'react';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { Check, Cloud, Loader2 } from 'lucide-react';

export default function Editor() {
    const darkTheme = {
        background: "hsl(222.2 84% 4.9%)",
        foreground: "#f1f5f9",
        caret: "#f87171",
        selection: "#f87171",
        selectionMatch: "#f87171",
        lineHighlight: "#374151",
        gutterBackground: "hsl(222.2 84% 4.9%)",
        gutterForeground: "#f1f5f9",
    }

    const [htmlValue, setHtmlValue] = useState(``);
    const [cssValue, setCssValue] = useState(``);
    const [jsValue, setJsValue] = useState(``);

    const iframeRef = useRef();
    const [srcDocsT, setSrcDocs] = useState(``);
    const [isCompiled, setIsCompiled] = useState(false);
    useEffect(() => {
        setIsCompiled(false);
        setTimeout(() => {
            setSrcDocs(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
              </head>
              <style>${cssValue}</style>
              <body>
              <div>${htmlValue}</div>
              <script>${jsValue}</script>
              </body>
            </html>
            `);
            setIsCompiled(true);
        },1000);
    },[htmlValue, cssValue, jsValue]);

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: {
                                background: "hsl(222.2 84% 4.9%)",
                                foreground: "#f1f5f9",
                                caret: "#f87171",
                                selection: "#f87171",
                                selectionMatch: "#f87171",
                                lineHighlight: "hsl(0, 0%, 100% / .1)",
                                gutterBackground: "hsl(222.2 84% 4.9%)",
                                gutterForeground: "#f1f5f9",
                            }
                        })} value={htmlValue} placeholder="HTML" onChange={(val, viewUpdate) => { setHtmlValue(val); }} extensions={[html()]} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: {
                                background: "hsl(222.2 84% 4.9%)",
                                foreground: "#f1f5f9",
                                caret: "#f87171",
                                selection: "#f87171",
                                selectionMatch: "#f87171",
                                lineHighlight: "hsl(0, 0%, 100% / .1)",
                                gutterBackground: "hsl(222.2 84% 4.9%)",
                                gutterForeground: "#f1f5f9",
                            }
                        })} value={cssValue} placeholder="CSS" onChange={(val, viewUpdate) => { setCssValue(val); }} extensions={[css()]} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: {
                                background: "hsl(222.2 84% 4.9%)",
                                foreground: "#f1f5f9",
                                caret: "#f87171",
                                selection: "#f87171",
                                selectionMatch: "#f87171",
                                lineHighlight: "hsl(0, 0%, 100% / .1)",
                                gutterBackground: "hsl(222.2 84% 4.9%)",
                                gutterForeground: "#f1f5f9",
                            }
                        })} value={jsValue} placeholder="JavaScript" onChange={(val, viewUpdate) => { setJsValue(val); }} extensions={[javascript({ jsx: true })]} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30} className='p-0 m-0'>
                <iframe ref={iframeRef} className={'h-full w-full p-0 m-0 bg-white'} srcDoc={srcDocsT} />
            </ResizablePanel>
            <Footer onClear={() => { setHtmlValue(""); setCssValue(""); setJsValue(""); }} >
                <Button size="icon" variant="secondary">{!isCompiled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</Button>
            </Footer>
        </ResizablePanelGroup>
    )
};
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
import { useRef, useState } from 'react';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import Footer from '@/components/Footer';

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

    const [htmlValue, setHtmlValue] = useState(`<div class="demo">
  <h1>Hello World</h1>
</div>`);
    const [cssValue, setCssValue] = useState(`body{
    background:#525fe1;
    color:#000;
    font-family:system-ui,-apple-system;
    display:flex;
    align-items:center;
    justify-content:center;
  }`);
    const [jsValue, setJsValue] = useState(``);

    const iframeRef = useRef();

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
                        })} value={htmlValue} placeholder="Write html" onChange={(val, viewUpdate) => { setHtmlValue(val); }} extensions={[html()]} />
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
                        })} value={cssValue} placeholder="Write css" onChange={(val, viewUpdate) => { setCssValue(val); }} extensions={[css()]} />
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
                        })} value={jsValue} placeholder="Write javascript" onChange={(val, viewUpdate) => { setJsValue(val); }} extensions={[javascript({ jsx: true })]} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30} className='p-0 m-0'>
                <iframe ref={iframeRef} className={'h-full w-full p-0 m-0'} srcDoc={`
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
          `} />
            </ResizablePanel>
            <Footer onClear={() => { setHtmlValue(""); setCssValue(""); setJsValue(""); }} />
        </ResizablePanelGroup>
    )
};
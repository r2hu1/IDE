"use client";
import CodeMirror from '@uiw/react-codemirror';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from 'react';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { Check, Loader2, Save } from 'lucide-react';
import { dark } from '@/theme/dark';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

export default function Editor() {
    const [htmlValue, setHtmlValue] = useState(`<button onClick="handleClick()">
  Click Me
</button>`);
    const [cssValue, setCssValue] = useState(`button{
  height:45px;
  border:none;
  padding: 0 30px;
  border-radius:8px;
  margin: 10px;
  color:#fff;
  background:#525fe1;
}`);
    const [jsValue, setJsValue] = useState(`const handleClick = () => {
        alert("button clicked");
    }`);
    const [srcDocsT, setSrcDocs] = useState(``);
    const [isCompiled, setIsCompiled] = useState(false);

    const handleDownload = () => {
        download({ src: srcDocsT });
        toast.success("Downloaded!");
    }

    const darkTheme = dark;

    useEffect(() => {
        setIsCompiled(false);
        setSrcDocs(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
              </head>
              <style>*{margin:0;padding:0;box-sizing:border-box;}${cssValue}</style>
              <body>
              <div>${htmlValue}</div>
              <script>${jsValue}</script>
              </body>
            </html>
            `);
        setIsCompiled(true);
    }, [htmlValue, cssValue, jsValue]);

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <ResizablePanel defaultSize={60}>
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: darkTheme
                        })} value={htmlValue} placeholder="HTML" onChange={(val, viewUpdate) => { setHtmlValue(val); }} extensions={[loadLanguage("html")]} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: darkTheme
                        })} value={cssValue} placeholder="CSS" onChange={(val, viewUpdate) => { setCssValue(val); }} extensions={[loadLanguage("css")]} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={32}>
                        <CodeMirror className='codeScrollbar' maxHeight='100vh' minHeight='400px' height='100%' theme={vscodeDarkInit({
                            settings: darkTheme
                        })} value={jsValue} placeholder="JavaScript" onChange={(val, viewUpdate) => { setJsValue(val); }} extensions={[loadLanguage("javascript")]} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40} className='p-0 m-0'>
                <iframe className={'h-full w-full p-0 m-0 bg-white'} srcDoc={srcDocsT} />
            </ResizablePanel>
            <Footer onClear={() => { setHtmlValue(""); setCssValue(""); setJsValue(""); setSrcDocs(""); }} >
                <Button size="icon" variant="secondary">{!isCompiled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</Button>
                <Button size="icon" variant="secondary" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
            </Footer>
        </ResizablePanelGroup>
    )
};

"use client";
import { useState, useEffect, Fragment } from 'react';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from '@uiw/react-codemirror';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { Check, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cmOptions } from '@/lib/cmOptions';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function Editor() {
    const [htmlValue, setHtmlValue] = useState(`<button onClick="handleClick()">
    Click Me
</button>`);
    const [cssValue, setCssValue] = useState(`button{
    height: 45px; 
    border: none; 
    padding: 0 30px; 
    border-radius: 8px; 
    margin: 10px; 
    color: #fff; 
    background: #525fe1; 
}`);
    const [jsValue, setJsValue] = useState(`const handleClick = () => {
    alert("button clicked"); 
}`);
    const [srcDocsT, setSrcDocs] = useState('');
    const [isCompiled, setIsCompiled] = useState(false);


    useEffect(() => {
        setIsCompiled(false);
        setSrcDocs(`
            <!DOCTYPE html>
            <html lang="en">
              <head></head>
              <style>* { margin: 0; padding: 0; box-sizing: border-box; }${cssValue}</style>
              <body>
                <div>${htmlValue}</div>
                <script>${jsValue}</script>
              </body>
            </html>
        `);
        setIsCompiled(true);
    }, [htmlValue, cssValue, jsValue]);

    const handleDownload = () => {
        download({ src: srcDocsT });
        toast.success("Downloaded!");
    }

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <ResizablePanel defaultSize={60}>
                <ResizablePanelGroup direction="horizontal">
                    {['html', 'css', 'javascript'].map((type) => (
                        <Fragment key={type}>
                            <ResizablePanel defaultSize={32}>
                                <ScrollArea className="h-full w-full">
                                    <ScrollArea className="h-full w-full">
                                        <CodeMirror
                                            {...cmOptions}
                                            value={type === 'html' ? htmlValue : (type === 'css' ? cssValue : jsValue)}
                                            placeholder={type.toUpperCase()}
                                            onChange={(val, viewUpdate) => {
                                                if (type === 'html') setHtmlValue(val);
                                                else if (type === 'css') setCssValue(val);
                                                else setJsValue(val);
                                            }}
                                            extensions={[loadLanguage(type)]}
                                        />
                                    </ScrollArea>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                        </Fragment>
                    ))}

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

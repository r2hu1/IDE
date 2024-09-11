"use client";
import { useEffect, useCallback, memo, Fragment, useContext, useMemo } from 'react';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from '@uiw/react-codemirror';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { cmOptions } from '@/lib/cmOptions';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { CodeContext } from '@/app/page';
import { debounced } from '@/lib/debounced';

const codeTypes = ['html', 'css', 'javascript'];

const Editor = () => {
    const codeH = useContext(CodeContext);
    const codeC = useContext(CodeContext);
    const codeJ = useContext(CodeContext);
    const values = useContext(CodeContext);

    const handleDownload = useCallback(() => {
        download({ src: values.codes });
        toast.success("Downloaded!");
    }, [values.codes]);

    const compileCode = useMemo(
        () => debounced(() => {
            values.setCodes(`<!DOCTYPE html><html lang="en"><head></head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style><body><div>${codeH.html}</div><script>${codeJ.js}</script></body></html>`);
        }, 200),
        [codeH.html, codeC.css, codeJ.js, values.setCodes]
    );

    useEffect(() => {
        compileCode();
    }, [codeH.html, codeH.css, codeJ.js, compileCode]);

    const handleChange = useCallback((val, type) => {
        if (type === 'html') codeH.setHtml(val);
        else if (type === 'css') codeC.setCss(val);
        else codeJ.setJs(val);
    }, [codeH.setHtml, codeC.setCss, codeJ.setJs]);

    const renderCodePanel = useCallback((type) => (
        <ResizablePanel key={type} defaultSize={32}>
            <ScrollArea className="h-full w-full">
                <ScrollArea className="h-full w-full">
                    <CodeMirror
                        {...cmOptions}
                        value={type === 'html' ? codeH.html : (type === 'css' ? codeC.css : codeJ.js)}
                        placeholder={type.toUpperCase()}
                        onChange={(val) => handleChange(val, type)}
                        extensions={[loadLanguage(type)]}
                    />
                </ScrollArea>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </ResizablePanel>
    ), [codeH.html, codeC.css, codeJ.js, handleChange]);

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <ResizablePanel defaultSize={60}>
                <ResizablePanelGroup direction="horizontal">
                    {renderCodePanel("html")}
                    <ResizableHandle withHandle />
                    {renderCodePanel("css")}
                    <ResizableHandle withHandle />
                    {renderCodePanel("javascript")}
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40} className='p-0 m-0'>
                <iframe className={'h-full w-full p-0 m-0 bg-white'} srcDoc={values.codes} />
            </ResizablePanel>
            <Footer onClear={() => { codeH.setHtml(""); codeC.setCss(""); codeJ.setJs(""); values.setCodes(""); }} >
                <Button size="icon" variant="secondary" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
            </Footer>
        </ResizablePanelGroup>
    );
};

export default memo(Editor);

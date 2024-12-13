"use client";
import { useEffect, useCallback, memo, Fragment, useContext, useMemo, useState } from 'react';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from '@uiw/react-codemirror';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { GitFork, Save, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cmOptions } from '@/lib/cmOptions';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { CodeContext } from '@/app/page';
import { debounced } from '@/lib/debounced';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const codeTypes = ['html', 'css', 'javascript'];

const Editor = () => {
    const codeH = useContext(CodeContext);
    const codeC = useContext(CodeContext);
    const codeJ = useContext(CodeContext);
    const values = useContext(CodeContext);
    const [currTab, setCurrTab] = useState('html');

    const handleDownload = useCallback(() => {
        download({ src: values.codes });
        toast.success("Downloaded!");
    }, [values.codes]);

    const compileCode = useMemo(
        () => debounced(() => {
            values.setCodes(`<!DOCTYPE html><html lang="en"><head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style></head><body><div>${codeH.html}</div><script>${codeJ.js}</script></body></html>`);
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
        <CodeMirror
            {...cmOptions}
            value={type === 'html' ? codeH.html : (type === 'css' ? codeC.css : codeJ.js)}
            placeholder={`Write your ${type.toUpperCase()}`}
            onChange={(val) => handleChange(val, type)}
            extensions={[loadLanguage(type)]}
        />
    ), [codeH.html, codeC.css, codeJ.js, handleChange]);

    return (
        <div>
            <div className="w-full flex items-center justify-between p-2.5 border-b">
                <ToggleGroup className="w-fit" size="sm" type="single" defaultValue={currTab} onValueChange={setCurrTab}>
                    <ToggleGroupItem disabled={currTab === "html"} value="html">HTML</ToggleGroupItem>
                    <ToggleGroupItem disabled={currTab === "css"} value="css">CSS</ToggleGroupItem>
                    <ToggleGroupItem disabled={currTab == "javascript"} value="javascript">JavaScript</ToggleGroupItem>
                </ToggleGroup>
                <div className='flex gap-1'>
                    <Button size="sm" onClick={() => { codeH.setHtml(""); codeC.setCss(""); codeJ.setJs(""); values.setCodes(""); }}>Clear</Button>
                    <Button size="icon" variant="secondary" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={20} defaultSize={50}>
                    <ScrollArea className="w-full">
                        <ScrollArea className="h-[calc(100vh-57px)] w-full">
                            {renderCodePanel(currTab)}
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={20} defaultSize={50}>
                    <iframe className={'h-[calc(100vh-57px)] w-full p-0 m-0 bg-white'} srcDoc={values.codes} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default memo(Editor);

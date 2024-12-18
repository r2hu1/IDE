"use client";
import { useEffect, useCallback, memo, Fragment, useContext, useMemo, useState } from 'react';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from '@uiw/react-codemirror';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FaHtml5 } from "react-icons/fa";
import { BiSolidFileCss } from "react-icons/bi";
import { IoLogoJavascript } from "react-icons/io5";
import { Button } from './ui/button';
import { CheckCircle2, ExternalLink, Loader, Loader2, Play, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cmOptions } from '@/lib/cmOptions';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { CodeContext } from '@/app/page';
import { debounced } from '@/lib/debounced';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { placeholderSwitch } from '@/lib/placeholder';

const codeTypes = ['html', 'css', 'javascript'];

const Editor = () => {
    const codeH = useContext(CodeContext);
    const codeC = useContext(CodeContext);
    const codeJ = useContext(CodeContext);
    const values = useContext(CodeContext);
    const [currTab, setCurrTab] = useState('html');
    const [isCompiling, setIsCompiling] = useState(null);

    const handleDownload = useCallback(() => {
        download({ src: `<!DOCTYPE html><html lang="en"><head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style></head><body><div>${codeH.html}</div><script>${codeJ.js}</script></body></html>` });
        toast.success("Downloaded!");
    }, [values.codes]);

    const compileCode = useMemo(
        () => debounced(() => {
            localStorage.setItem('html', codeH.html);
            localStorage.setItem('css', codeC.css);
            localStorage.setItem('js', codeJ.js);
            values.setCodes(`<!DOCTYPE html><html lang="en"><head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style></head><body><div>${codeH.html}</div><script>/*remove this code */ document.addEventListener('click', function(event) {const target = event.target;if (target.tagName === 'A') {event.preventDefault();const href = target.getAttribute('href');if (href && href.startsWith('#')) {const targetElement = document.querySelector(href);if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });} else if (href) {window.open(href, '_blank');}}}); /*remove this code */ ${codeJ.js}</script></body></html>`);
            setIsCompiling(false);
        }, 300),
        [codeH.html, codeC.css, codeJ.js]
    );

    const openInNewTab = () => {
        const blob = new Blob([values.codes], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    useEffect(() => {
        setIsCompiling(true);
        compileCode();
    }, [codeH.html, codeH.css, codeJ.js]);

    const handleChange = useCallback((val, type) => {
        if (type === 'html') codeH.setHtml(val);
        else if (type === 'css') codeC.setCss(val);
        else codeJ.setJs(val);
    }, [codeH.setHtml, codeC.setCss, codeJ.setJs]);


    const renderCodePanel = useCallback((type) => (
        <CodeMirror
            {...cmOptions}
            value={type === 'html' ? codeH.html : (type === 'css' ? codeC.css : codeJ.js)}
            placeholder={placeholderSwitch(type)}
            onChange={(val) => handleChange(val, type)}
            extensions={[loadLanguage(type)]}
        />
    ), [codeH.html, codeC.css, codeJ.js, handleChange]);

    return (
        <div>
            <ResizablePanelGroup direction="horizontal" className="h-full absolute w-full">
                <ResizablePanel minSize={28} defaultSize={75}>
                    <div className="relative w-full flex items-center justify-between gap-2 overflow-hidden p-2 border-b">
                        <div className='absolute left-0 top-0 bg-purple-700 h-14 w-14 -z-10 blur-3xl'></div>
                        <ToggleGroup className="w-fit" size="sm" type="single" defaultValue={currTab} onValueChange={setCurrTab}>
                            <ToggleGroupItem className="h-8 text-sm font-normal flex items-center justify-center gap-1" disabled={currTab === "html"} value="html"><FaHtml5 className="h-4 w-4" /> index.html</ToggleGroupItem>
                            <ToggleGroupItem className="h-8 text-sm font-normal flex items-center justify-center gap-1" disabled={currTab === "css"} value="css"><BiSolidFileCss className='h-4 w-4' />style.css</ToggleGroupItem>
                            <ToggleGroupItem className="h-8 text-sm font-normal flex items-center justify-center gap-1" disabled={currTab == "javascript"} value="javascript"><IoLogoJavascript className='h-4 w-4' />script.js</ToggleGroupItem>
                        </ToggleGroup>
                        <div className='flex gap-1'>
                            <Button size="icon" variant="secondary" className="p-0 h-8 !max-w-8" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <ScrollArea className="w-full">
                        <ScrollArea className="h-[calc(100vh-57px)] w-full">
                            {renderCodePanel(currTab)}
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={25} defaultSize={25}>
                    <div className='relative w-full h-full'>
                        <div className='flex items-center shadow-sm justify-center gap-2 py-1 px-2'>
                            <Button size="icon" variant="ghost" onClick={compileCode} className="p-0 h-7 !max-w-7">{isCompiling ? <Loader2 className='h-3.5 w-3.5 animate-spin' /> : <Play className="h-3.5 w-3.5" />}</Button>
                            <div className='bg-secondary px-4 text-xs py-0.5 rounded-full w-full text-gray-200'>output:\\index.html\</div>
                            <Button size="icon" variant="ghost" onClick={openInNewTab} className="p-0 h-7 !max-w-7"><ExternalLink className="h-3.5 w-3.5" /></Button>
                        </div>
                        <div className='absolute z-10 bottom-4 right-4 bg-background rounded-full py-2 px-2 group transition-all cursor-pointer'>
                            {!isCompiling ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <span className='text-xs transition hidden group-hover:block'>Saved</span> <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span className='text-xs transition hidden group-hover:block'>Compiled</span> <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>
                            ) : (
                                <div className='flex items-center justify-center gap-2'>
                                    <span className='text-xs transition hidden group-hover:block'>Saving</span> <Loader className="h-3.5 w-3.5 animate-spin" />
                                    <span className='text-xs transition hidden group-hover:block'>Compiling</span> <Loader className="h-3.5 w-3.5 animate-spin" />
                                </div>
                            )}
                        </div>
                        <iframe className={'absolute h-[calc(100%-36px)] w-full p-0 m-0 bg-white'} srcDoc={values.codes} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default memo(Editor);

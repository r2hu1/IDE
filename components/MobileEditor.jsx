"use client";
import { useState, useEffect, useMemo, useCallback, memo, useContext } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from 'sonner';
import { download } from '@/lib/download';
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror from '@uiw/react-codemirror';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Footer from '@/components/Footer';
import { Button } from './ui/button';
import { FaHtml5 } from "react-icons/fa";
import { BiSolidFileCss } from "react-icons/bi";
import { IoLogoJavascript } from "react-icons/io5";
import { Check, Copy, Loader2, Save } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cmOptions } from '@/lib/cmOptions';
import { debounced } from '@/lib/debounced';
import { CodeContext } from '@/app/page';
import { placeholderSwitch } from '@/lib/placeholder';

function MobileEditor() {
    const codeH = useContext(CodeContext);
    const codeC = useContext(CodeContext);
    const codeJ = useContext(CodeContext);
    const [currTab, setCurrTab] = useState("html");
    const values = useContext(CodeContext);
    const [isCompiling, setIsCompiling] = useState(false);

    const handleDownload = useCallback(() => {
        download({ src: `<!DOCTYPE html><html lang="en"><head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style></head><body><div>${codeH.html}</div><script>${codeJ.js}</script></body></html>` });
        toast.success("Downloaded!");
    }, []);

    const compileCode = useMemo(
        () => debounced(() => {
            localStorage.setItem('html', codeH.html);
            localStorage.setItem('css', codeC.css);
            localStorage.setItem('js', codeJ.js);
            values.setCodes(`<!DOCTYPE html><html lang="en"><head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style></head><body><div>${codeH.html}</div><script>/*remove this code */ document.addEventListener('click', function(event) {const target = event.target;if (target.tagName === 'A') {event.preventDefault();const href = target.getAttribute('href');if (href && href.startsWith('#')) {const targetElement = document.querySelector(href);if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });} else if (href) {window.open(href, '_blank');}}}); /*remove this code */ ${codeJ.js}</script></body></html>`);
            setIsCompiling(false);
        }, 200),
        [codeH.html, codeC.css, codeJ.js]
    );

    useEffect(() => {
        setIsCompiling(true);
        compileCode();
    }, [codeH.html, codeH.css, codeJ.js]);

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <div className="relative border-b py-2 px-2 md:px-20">
                <div className='absolute left-0 top-0 bg-purple-700 h-14 w-14 -z-10 blur-3xl'></div>
                <ToggleGroup className="w-full" size="sm" type="single" defaultValue={currTab} onValueChange={setCurrTab}>
                    <ToggleGroupItem className="h-8 w-full text-sm font-normal flex items-center justify-center gap-1" disabled={currTab === "html"} value="html"><FaHtml5 className="h-4 w-4" /> index.html</ToggleGroupItem>
                    <ToggleGroupItem className="h-8 w-full text-sm font-normal flex items-center justify-center gap-1" disabled={currTab === "css"} value="css"><BiSolidFileCss className='h-4 w-4' />style.css</ToggleGroupItem>
                    <ToggleGroupItem className="h-8 w-full text-sm font-normal flex items-center justify-center gap-1" disabled={currTab == "javascript"} value="javascript"><IoLogoJavascript className='h-4 w-4' />script.js</ToggleGroupItem>
                </ToggleGroup>
                {/* <div>
                    <Button size="icon" variant="secondary" onClick={() => { navigator.clipboard.writeText(currTab === "html" ? codeH.html : (currTab === "css" ? codeC.css : codeJ.js)).then(() => { toast.success(`Copied ${currTab} code`) }); }}><Copy className="h-3.5 w-3.5" /></Button>
                </div> */}
            </div>
            <ResizablePanel defaultSize={60}>
                <ScrollArea className="h-full w-full">
                    <ScrollArea className="h-full w-full">
                        <CodeMirror
                            value={currTab === "html" ? codeH.html : (currTab === "css" ? codeC.css : codeJ.js)}
                            placeholder={placeholderSwitch(currTab)}
                            onChange={(val) => { currTab === "html" ? codeH.setHtml(val) : (currTab === "css" ? codeC.setCss(val) : codeJ.setJs(val)); }}
                            extensions={[loadLanguage(currTab)]}
                            {...cmOptions}
                        />
                    </ScrollArea>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40} className='p-0 m-0'>
                <iframe className={'h-full w-full p-0 m-0 bg-white'} srcDoc={values.codes} />
            </ResizablePanel>
            <Footer isLoading={isCompiling} runCode={() => { compileCode(); }} onClear={() => { values.setHtml(""); values.setCss(""); values.setJs(""); values.setCodes(""); }} >
                <Button size="icon" variant="secondary" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
            </Footer>
        </ResizablePanelGroup>
    );
}

export default memo(MobileEditor);

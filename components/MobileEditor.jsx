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
import { Check, Copy, Loader2, Save } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cmOptions } from '@/lib/cmOptions';
import { debounced } from '@/lib/debounced';
import { CodeContext } from '@/app/page';

function MobileEditor() {
    const codeH = useContext(CodeContext);
    const codeC = useContext(CodeContext);
    const codeJ = useContext(CodeContext);
    const [currTab, setCurrTab] = useState("html");
    const values = useContext(CodeContext);

    const handleDownload = useCallback(() => {
        download({ src: values.codes });
        toast.success("Downloaded!");
    }, []);

    const compileCode = useMemo(
        () => debounced(() => {
            values.setCodes(`<!DOCTYPE html><html lang="en"><head></head><style>* { margin: 0; padding: 0; box-sizing: border-box; }${codeC.css}</style><body><div>${codeH.html}</div><script>${codeJ.js}</script></body></html>`);
        }, 0),
        [codeH.html, codeC.css, codeJ.js, values.setCodes]
    );

    useEffect(() => {
        compileCode();
    }, [compileCode]);

    return (
        <ResizablePanelGroup direction="vertical" className="absolute h-full w-full top-0 left-0 right-0">
            <div className="flex py-2 px-2 md:px-20 items-center justify-between">
                <ToggleGroup size="sm" type="single" defaultValue={currTab} onValueChange={setCurrTab}>
                    <ToggleGroupItem disabled={currTab === "html"} value="html">HTML</ToggleGroupItem>
                    <ToggleGroupItem disabled={currTab === "css"} value="css">CSS</ToggleGroupItem>
                    <ToggleGroupItem disabled={currTab == "javascript"} value="javascript">JavaScript</ToggleGroupItem>
                </ToggleGroup>
                <div>
                    <Button size="icon" variant="secondary" onClick={() => { navigator.clipboard.writeText(currTab === "html" ? codeH.html : (currTab === "css" ? codeC.css : codeJ.js)).then(() => { toast.success(`Copied ${currTab} code`) }); }}><Copy className="h-[15px] w-[15px]" /></Button>
                </div>
            </div>
            <ResizablePanel defaultSize={60}>
                <ScrollArea className="h-full w-full">
                    <ScrollArea className="h-full w-full">
                        <CodeMirror
                            value={currTab === "html" ? codeH.html : (currTab === "css" ? codeC.css : codeJ.js)}
                            placeholder={currTab.toUpperCase()}
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
            <Footer onClear={() => { setHtmlValue(""); setCssValue(""); setJsValue(""); values.setCodes(""); }} >
                <Button size="icon" variant="secondary" onClick={handleDownload}><Save className="h-4 w-4" /></Button>
            </Footer>
        </ResizablePanelGroup>
    );
}

export default memo(MobileEditor);

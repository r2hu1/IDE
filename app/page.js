"use client";
import Editor from "@/components/Editor";
import MobileEditor from "@/components/MobileEditor";
import useMediaQuery from '../hooks/useMediaQuery';
import { Code2, Loader2 } from "lucide-react";
import { useState, useEffect, Fragment, createContext } from "react";
import { download } from "@/lib/download";

export const CodeContext = createContext(null);
export default function Page() {
  const screenSize = useMediaQuery("768");
  const [preload, setPreload] = useState(true);
  const [codes, setCodes] = useState(null);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  useEffect(() => {
    setPreload(false);
    const preventDefaultSave = (e) => {
      if ((e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) || e.button === 2) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", preventDefaultSave, false);
    document.addEventListener("contextmenu", preventDefaultSave, false);
    return () => {
      document.removeEventListener("keydown", preventDefaultSave, false);
      document.removeEventListener("contextmenu", preventDefaultSave, false);
    };

  }, []);

  return (
    <>
      {preload && (
        <div className="absolute h-full w-full z-[99999] bg-background flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      < CodeContext.Provider value={{ codes, setCodes, html, setHtml, css, setCss, js, setJs }
      }>
        {!screenSize ? <Editor /> : <MobileEditor />}
      </CodeContext.Provider >
    </>
  )
};
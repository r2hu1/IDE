"use client";
import Editor from "@/components/Editor";
import MobileEditor from "@/components/MobileEditor";
import useMediaQuery from '../hooks/useMediaQuery';
import { Code2, Loader2 } from "lucide-react";
import { useState, useEffect, Fragment, createContext } from "react";

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
  }, []);

  return (
    <CodeContext.Provider value={{ codes, setCodes, html, setHtml, css, setCss, js, setJs }}>
      {!screenSize ? <Editor /> : <MobileEditor />}
      {preload && (
        <div className="absolute h-full w-full z-50 bg-background flex items-center justify-center">
          <Code2 className="h-6 w-6 animate-pulse" />
        </div>
      )}
    </CodeContext.Provider>
  )
};
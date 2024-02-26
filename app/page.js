"use client";
import Editor from "@/components/Editor";
import MobileEditor from "@/components/MobileEditor";
import useMediaQuery from '../hooks/useMediaQuery';

export default function Page() {
  const screenSize = useMediaQuery("768");
  return (
    <div>
      {!screenSize ? <Editor /> : <MobileEditor />}
    </div>
  )
};
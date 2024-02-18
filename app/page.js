import Editor from "@/components/Editor";
import MobileEditor from "@/components/MobileEditor";

export default function Page() {
  return (
    <div>
      <div className="hidden sm:flex">
        <Editor />
      </div>
      <div className="sm:hidden flex">
        <MobileEditor />
      </div>
    </div>
  )
};
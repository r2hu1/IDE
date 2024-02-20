import Editor from "@/components/Editor";
import MobileEditor from "@/components/MobileEditor";

export default function Page() {
  return (
    <div>
      <div className="hidden md:flex">
        <Editor />
      </div>
      <div className="md:hidden flex">
        <MobileEditor />
      </div>
    </div>
  )
};
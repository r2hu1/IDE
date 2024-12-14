import { GitFork, Loader2, Play, Star } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer({ isLoading = false, runCode = () => { }, onClear = () => { }, children }) {
    return (
        <footer className="py-2 px-2 sm:px-6 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-[6px]">
                <Button size="icon" disabled={isLoading} onClick={runCode}>{isLoading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</Button>
                {/* <Button size="icon" variant="secondary"><a target="_blank" href="https://github.com/r2hu1/ide/fork"><GitFork className="h-3.5 w-3.5" /></a></Button> */}
            </div>
            <div className="flex items-center gap-[6px]">
                <Button size="sm" variant="secondary" onClick={onClear}>Clear</Button>
                {children}
            </div>
        </footer>
    )
}
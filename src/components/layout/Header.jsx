// import { Waves } from 'lucide-react';

export function Header() {
  return (
    <header className="h-12 min-h-[48px] border-b border-stone-200 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        {/* <Waves className="w-5 h-5 text-indigo-500" /> */}
        <h1 className="text-lg font-semibold text-stone-800 tracking-tight">BézierBreeze</h1>
      </div>
      <span className="text-xs text-stone-400">SVG Wave Generator</span>
    </header>
  );
}

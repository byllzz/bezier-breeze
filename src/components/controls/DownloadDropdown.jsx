export function DownloadDropdown({
  dropdownRef,
  label,
  isOpen,
  setIsOpen,
  setOtherOpen,
  onDownload,
}) {
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setOtherOpen(false);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-2 bg-white rounded-[7px] text-black font-semibold text-sm shadow-md hover:bg-stone-100 transition active:scale-95 cursor-pointer"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
      </button>

      {isOpen && (
        <div
          className={`absolute bottom-full ${label === 'PNG' ? 'right-0' : 'left-0 right-0'} mt-1 bg-white rounded-md shadow-xl border border-neutral-200 py-1 z-30 text-[11px] w-[135px]`}
        >
          <button
            onClick={() => {
              onDownload(true);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-stone-800 hover:bg-stone-100 transition font-medium cursor-pointer"
          >
            With Background
          </button>
          <button
            onClick={() => {
              onDownload(false);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-blue-600 hover:bg-stone-100 transition font-medium cursor-pointer"
          >
            Transparent
          </button>
        </div>
      )}
    </div>
  );
}

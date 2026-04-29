export function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 bg-background border-t border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        <svg viewBox="0 0 32 32" className="w-5 h-5 opacity-60 grayscale" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="3.5" fill="currentColor" />
          <circle cx="16" cy="6" r="3.5" fill="currentColor" />
          <circle cx="23" cy="9" r="3.5" fill="currentColor" />
          <circle cx="26" cy="16" r="3.5" fill="currentColor" />
          <circle cx="23" cy="23" r="3.5" fill="currentColor" />
          <circle cx="16" cy="26" r="3.5" fill="currentColor" />
          <circle cx="9" cy="23" r="3.5" fill="currentColor" />
          <circle cx="6" cy="16" r="3.5" fill="currentColor" />
          <circle cx="9" cy="9" r="3.5" fill="currentColor" />
        </svg>
        <span className="text-sm font-semibold tracking-tight text-neutral-600 dark:text-neutral-400">NextUP</span>
      </div>
      <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-500">
        &copy; {new Date().getFullYear()} NextUP. Built by US IT Students.
      </p>
    </footer>
  );
}
"use client";

import { useState } from "react";

interface NewNoteTemplateProps {
  template: string;
}

export function NewNoteTemplate({ template }: NewNoteTemplateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = template;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
        <code>{template}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md bg-stone-200 px-2 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

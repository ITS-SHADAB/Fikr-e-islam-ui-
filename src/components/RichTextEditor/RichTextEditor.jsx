import React, { useRef, useState } from 'react';
import { Bold, Italic, Heading1, Heading2, Quote, List, Eye, Code } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = 'Write content here...' }) {
  const textareaRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);

  const insertTag = (openTag, closeTag = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = openTag + selected + (closeTag || openTag.replace('<', '</'));

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const offset = openTag.length;
      textarea.setSelectionRange(start + offset, start + offset + selected.length);
    }, 0);
  };

  const insertList = () => {
    insertTag('<ul>\n  <li>', '</li>\n</ul>');
  };

  return (
    <div className="border border-border rounded bg-white overflow-hidden flex flex-col min-h-[300px]">
      
      {/* Editor Toolbar */}
      <div className="bg-slate-50 border-b border-border px-3 py-2 flex items-center justify-between shrink-0">
        
        {/* Formatting Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Heading 2"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Heading 3"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertList}
            disabled={isPreview}
            className="p-1 rounded text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Code (Write) vs Preview */}
        <div className="flex items-center border-l border-slate-200 pl-3 gap-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
              !isPreview ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
              isPreview ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div className="flex-grow flex flex-col p-1.5 bg-white">
        {isPreview ? (
          <div
            className="prose prose-sm max-w-none p-3.5 overflow-y-auto max-h-[350px] min-h-[250px] border border-transparent leading-relaxed"
            dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-400">No content to preview.</p>' }}
          ></div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[250px] p-3 border-none resize-y outline-none text-slate-800 text-sm font-mono leading-relaxed placeholder:text-slate-300"
          ></textarea>
        )}
      </div>
      
      {/* Help Banner */}
      {!isPreview && (
        <div className="bg-slate-50 border-t border-slate-100 px-3 py-1.5 text-[10px] text-slate-400">
          Tip: You can directly write standard HTML tags (e.g. <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>) for granular styling.
        </div>
      )}

    </div>
  );
}

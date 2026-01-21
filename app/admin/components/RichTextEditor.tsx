'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to disable SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="rich-text-editor-wrapper">
            <style jsx global>{`
                .rich-text-editor-wrapper .ql-toolbar {
                    background: #f8f9fa;
                    border-radius: 6px 6px 0 0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .rich-text-editor-wrapper .ql-container {
                    background: rgba(255, 255, 255, 0.9);
                    color: #000;
                    border-radius: 0 0 6px 6px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-top: none;
                    font-size: 1rem;
                    min-height: 150px;
                }
                .rich-text-editor-wrapper .ql-editor {
                    min-height: 150px;
                }
                /* Dark mode adjustments if needed, but keeping editor white/black suggests paper-like feel */
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}

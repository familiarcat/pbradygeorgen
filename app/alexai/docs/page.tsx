'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function AlexAIDocs() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/alexai-docs.md')
      .then((res) => res.text())
      .then(setContent);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 sm:px-12 md:px-20 lg:px-32">
      <article className="prose lg:prose-xl max-w-none prose-a:text-blue-600 prose-pre:bg-neutral-100 prose-pre:rounded-md prose-pre:p-4 prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        />
      </article>
    </div>
  );
}

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const MathText: React.FC<MathTextProps> = ({ 
  children, 
  className = '', 
  inline = false 
}) => {
  const hasLaTeX = /\${1,2}.*?\${1,2}/.test(children);
  
  if (!hasLaTeX) {
    return <span className={className}>{children}</span>;
  }

  const parts = [];
  let lastIndex = 0;
  
  const combinedRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let match;

  while ((match = combinedRegex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = children.slice(lastIndex, match.index);
      parts.push(
        <span key={`text-${lastIndex}`}>{textBefore}</span>
      );
    }
    
    const isDisplay = match[0].startsWith('$$');
    const mathContent = match[1] || match[2];
    const delimiter = isDisplay ? '$$' : '$';
    
    parts.push(
      <span key={`math-${match.index}`} className="solution-container">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => (
              <span className={isDisplay ? 'block my-2' : 'inline-block'}>
                {children}
              </span>
            ),
          }}
          skipHtml={true}
        >
          {`${delimiter}${mathContent}${delimiter}`}
        </ReactMarkdown>
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < children.length) {
    const textAfter = children.slice(lastIndex);
    parts.push(
      <span key={`text-${lastIndex}`}>{textAfter}</span>
    );
  }

  return (
    <span className={`math-content ${className} ${inline ? 'inline-block' : 'block'}`}>
      {parts}
    </span>
  );
};

export const MathSolutionStep: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <MathText className={`${className} text-white`} inline>{children}</MathText>;
};

export default MathText;
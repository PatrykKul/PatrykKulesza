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
  // Sprawdź czy tekst zawiera prawdziwy LaTeX
  const hasLaTeX = /\$.*?\$/.test(children);
  
  // Jeśli nie ma LaTeX, zwróć zwykły tekst
  if (!hasLaTeX) {
    return <span className={className}>{children}</span>;
  }

  // Podziel tekst na części matematyczne i zwykłe
  const parts = [];
  let lastIndex = 0;
  const mathRegex = /\$([^$]+)\$/g;
  let match;

  while ((match = mathRegex.exec(children)) !== null) {
    // Dodaj tekst przed matematyką
    if (match.index > lastIndex) {
      const textBefore = children.slice(lastIndex, match.index);
      parts.push(
        <span key={`text-${lastIndex}`}>{textBefore}</span>
      );
    }
    
    // Dodaj część matematyczną
    const mathContent = match[1];
    parts.push(
      <span key={`math-${match.index}`} className="solution-container">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <span className="inline-block">{children}</span>,
          }}
          skipHtml={true}
        >
          {`$${mathContent}$`}
        </ReactMarkdown>
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Dodaj pozostały tekst po ostatniej matematyce
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

// Komponent dla tekstu z komentarzem i matematyką (dla rozwiązań)
export const MathSolutionStep: React.FC<{ children: string; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  // Sprawdź czy jest format "komentarz | matematyka"
  if (children.includes(' | ')) {
    const [comment, math] = children.split(' | ', 2);
    const mathPart = math.trim();
    
    // Sprawdź czy matematyka już ma delimitery $...$
    const needsDelimiters = !mathPart.startsWith('$') || !mathPart.endsWith('$');
    const processedMath = needsDelimiters ? `$${mathPart}$` : mathPart;
    
    return (
      <span className={`inline-flex items-baseline flex-wrap gap-1 ${className}`}>
        <span className="text-white">{comment.trim()}</span>
        <span className="text-blue-200">
          <MathText inline>{processedMath}</MathText>
        </span>
      </span>
    );
  }
  
  // W przeciwnym razie użyj standardowego MathText
  return <MathText className={className} inline>{children}</MathText>;
};

export default MathText;
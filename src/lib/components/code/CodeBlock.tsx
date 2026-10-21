import { useMemo, type ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import './code.css';

function renderTokens(tokens: (string | Prism.Token)[]): ReactNode {
  return tokens.map((token, index) => {
    if (typeof token === 'string') return token;
    const content = typeof token.content === 'string' ? token.content : renderTokens(Array.isArray(token.content) ? token.content : [token.content]);
    const controlFlow = token.type === 'keyword' && typeof token.content === 'string' && /^(?:import|from|export|default|return|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|await|async|yield)$/.test(token.content);
    return <span key={index} className={`token ${token.type}${controlFlow ? ' control-flow' : ''}`}>{content}</span>;
  });
}

export default function CodeBlock({ code, className = '' }: { code: string; className?: string }) {
  const highlighted = useMemo(() => renderTokens(Prism.tokenize(code, Prism.languages.tsx)), [code]);
  return <pre className={`component-code ${className}`} tabIndex={0}><code>{highlighted}</code></pre>;
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import rehypeSlug from 'rehype-slug';
import styles from '../styles/MarkdownRenderer.module.css'
import { AiOutlinePlayCircle } from 'react-icons/ai'
import { FaRegCopy } from 'react-icons/fa'
import { BsCheckLg } from 'react-icons/bs'

import copy from 'copy-to-clipboard';

const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);

  const code = Array.isArray(children) ? children.join('') : children;

  const handleMouseEnter = (event: any) => {
    event.currentTarget.lastChild.style.display = 'flex';
  };

  const handleMouseLeave = (event: any) => {
    event.currentTarget.lastChild.style.display = 'none';
    setCopied(false);
  };

  const handleRun = useCallback(() => {
    const newWindow = window.open('https://codesandbox.io/p/sandbox/long-dust-e9pyxp?file=%2Findex.js&selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A36%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A36%7D%5D', '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }, []);
    
  const handleCopyClick = () => {
    copy(code);
    setCopied(true);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <pre>
        <code className={className}>{children}</code>
      </pre>
      <div style={{ display: 'none' }} className='justify-around absolute top-0 right-0 w-16'>
        <button onClick={handleCopyClick} className='hover:bg-gray-700 p-1 rounded-sm'>
          {!copied ? <FaRegCopy className='text-2xl' style={{color: '#BBE7E6'}} /> : <BsCheckLg className='text-2xl' style={{color: '#BBE7E6'}} />}
        </button>
        {/* <button onClick={handleRun} className="hover:bg-gray-700 p-1 rounded-sm"><AiOutlinePlayCircle className='text-2xl' style={{color: '#BBE7E6'}}/></button> */}
      </div>
    </div>
  );
};

const MyList = ({ ordered, depth, children, start }: any) => {
  const Component = ordered ? 'ol' : 'ul';
  const listStyleType =
    depth === 0 ? (ordered ? 'decimal' : 'disc') : 'circle';
  const listStyle = {
    listStyleType: listStyleType,
    paddingLeft: `${1 + depth * 1.5}em`,
  };
  return <Component start={start} style={listStyle}>{children}</Component>;
};

const remarkPlugins = [remarkSlug, remarkAutolinkHeadings];
const rehypePlugins = [rehypeSlug];

const MarkdownRenderer = ({ content }: {content: any}) => {
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins}
        components={{
          h4: ({ children, id }) => <h4 className={styles.heading} id={id}>{children}</h4>,
          h5: ({ children, id }) => <h5 className={styles.heading} id={id}>{children}</h5>,
          h6: ({ children, id }) => <h6 className={styles.heading} id={id}>{children}</h6>,
          ol: MyList,
          ul: MyList,
          li: ({ children, ...props }) => (
            <li style={{ marginBottom: '0.5em' }} {...props}>
              {children}
            </li>
          ),
          p: ({ children }) => {
            if(children[1] == ' | ') {
              return null;
            }
            return <p className={`${styles.paragraph}, font-swiss`}>{children}</p>
          },
          a: ({ children, href, id }) => (
            <a className={styles.link} href={href} style={{color: "#BBE7E6", textDecoration: 'underline' }}>
              {children}
            </a>
          ),
          pre: ({ children }) => <pre className={styles.preformatted}>{children}</pre>,
          code: ({ children, className}) => <CodeBlock className={`${styles.inlineCode} font-jura ${className}`}>{children}</CodeBlock>
        }} >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer;
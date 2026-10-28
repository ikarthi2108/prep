import {useState} from 'react';
import Icon from './Icon';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
export default function CodeBlock({file,code,language='javascript',description}){const[copied,setCopied]=useState(false),[error,setError]=useState('');async function copy(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setError('Select the code to copy manually; clipboard access is unavailable.')}}return <section className="code-section">{description&&<p>{description}</p>}<div className="codebox"><div className="codebar"><span><Icon name="FileCode2" size={15}/>{file}<small>{language}</small></span><button onClick={copy}><Icon name={copied?'Check':'Copy'} size={14}/>{copied?'Copied':'Copy code'}</button></div><pre><code dangerouslySetInnerHTML={{__html:Prism.highlight(code,Prism.languages[language]||Prism.languages.javascript,language)}}/></pre></div>{error&&<small role="alert">{error}</small>}</section>}


import{r as i,j as t}from"./jsx-runtime-SuB_ucaY.js";import{l as m,n as h,o as y,p as S,_ as f,M as j,L as w,S as g,O as k}from"./components-Bwj_2WcS.js";/**
 * @remix-run/react v2.11.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:e,...l}){let{isSpaMode:c}=m(),r=h(),d=y();S({getKey:e,storageKey:a});let u=i.useMemo(()=>{if(!e)return null;let s=e(r,d);return s!==r.key?s:null},[]);if(c)return null;let x=((s,p)=>{if(!window.history.state||!window.history.state.key){let o=Math.random().toString(32).slice(2);window.history.replaceState({key:o},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[p||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(o){console.error(o),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",f({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${x})(${JSON.stringify(a)}, ${JSON.stringify(u)})`}}))}const b=({children:e})=>t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(j,{}),t.jsx(w,{})]}),t.jsxs("body",{children:[t.jsx("div",{id:"root",children:t.jsx("div",{className:"flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans",children:e})}),t.jsx(M,{}),t.jsx(g,{})]})]}),N=()=>t.jsx("div",{}),v=()=>t.jsx(k,{}),R=v;export{N as HydrateFallback,b as Layout,R as default};

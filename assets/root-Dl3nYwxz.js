import{r as n,j as t}from"./jsx-runtime-SuB_ucaY.js";import{w as p}from"./vite-paths-D5i8unMh.js";import{l as h,n as f,o as y,p as j,_ as S,M as w,L as g,S as k,O as v}from"./components-Bwj_2WcS.js";/**
 * @remix-run/react v2.11.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:e,...l}){let{isSpaMode:c}=h(),r=f(),d=y();j({getKey:e,storageKey:a});let m=n.useMemo(()=>{if(!e)return null;let s=e(r,d);return s!==r.key?s:null},[]);if(c)return null;let u=((s,x)=>{if(!window.history.state||!window.history.state.key){let o=Math.random().toString(32).slice(2);window.history.replaceState({key:o},"")}try{let i=JSON.parse(sessionStorage.getItem(s)||"{}")[x||window.history.state.key];typeof i=="number"&&window.scrollTo(0,i)}catch(o){console.error(o),sessionStorage.removeItem(s)}}).toString();return n.createElement("script",S({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${u})(${JSON.stringify(a)}, ${JSON.stringify(m)})`}}))}const R=({children:e})=>t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx("link",{rel:"shortcut icon",href:p("favicon.ico")}),t.jsx(w,{}),t.jsx(g,{})]}),t.jsxs("body",{children:[t.jsx("div",{id:"root",children:t.jsx("div",{className:"flex min-h-screen flex-col text-zinc-800 bg-zinc-200 font-sans",children:e})}),t.jsx(M,{}),t.jsx(k,{})]})]}),_=()=>t.jsx("div",{}),L=()=>t.jsx(v,{}),$=L;export{_ as HydrateFallback,R as Layout,$ as default};

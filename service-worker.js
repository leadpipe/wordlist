if(!self.define){let e,f={};const l=(l,r)=>(l=new URL(l+".js",r).href,f[l]||new Promise((f=>{if("document"in self){const e=document.createElement("script");e.src=l,e.onload=f,document.head.appendChild(e)}else e=l,importScripts(l),f()})).then((()=>{let e=f[l];if(!e)throw new Error(`Module ${l} didn’t register its module`);return e})));self.define=(r,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(f[n])return;let o={};const u=e=>l(e,n),c={module:{uri:n},exports:o,require:u};f[n]=Promise.all(r.map((e=>c[e]||u(e)))).then((e=>(i(...e),o)))}}define(["./workbox-460519b3"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"03568dfaabfa694e7a08.woff2",revision:null},{url:"39eefd9621a880a488de.woff2",revision:null},{url:"4b3185cc3e5c87255c6a.woff2",revision:null},{url:"723.bundle.js",revision:"4d91fd61c520b8c385f38195e3109f17"},{url:"723.bundle.js.LICENSE.txt",revision:"c9ae65c215fbf97b96bce384781c89ea"},{url:"74.bundle.js",revision:"dfd4a4893adab78f65c62be6e011d8fb"},{url:"83da9165dc6389b53836.woff",revision:null},{url:"88899cc48af9534ab3fb.woff",revision:null},{url:"958.bundle.js",revision:"9f9cdb26a30f12de8e1a05d027a4f7c9"},{url:"975.bundle.js",revision:"190e423bdff468589b9b91671f1507c9"},{url:"bundle.js",revision:"bf92edde348b3725a6f93ecd1b302e97"},{url:"c187986b0028c9508f3b.module.wasm",revision:null},{url:"c277e018002cb6f17320.module.wasm",revision:null},{url:"e34dc6c285e600012acb.woff",revision:null},{url:"f3089560c7061a0363f4.woff",revision:null},{url:"fbec73474c1c92fba7af.woff2",revision:null},{url:"index.html",revision:"e19fa04b70bb5590796635769e5189e9"},{url:"lpwg-256.png",revision:"57c785912efd38a6f45908969be19f50"},{url:"lpwg-512-maskable.png",revision:"134da9b02f46f52d88360069762eefcd"},{url:"lpwg-512.png",revision:"ff445df42983cc9c3455e2aeddc7c421"},{url:"wordgrid.webmanifest",revision:"806e46dc9dfc43f8108ef1489a5f416c"},{url:"words-v1.txt",revision:null}],{})}));

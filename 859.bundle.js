"use strict";(self.webpackChunkleadpipe_wordgrid=self.webpackChunkleadpipe_wordgrid||[]).push([[859],{975:(e,t,n)=>{let r;function o(e){r=e}n.d(t,{AA:()=>D,Jk:()=>x,Or:()=>G,Tc:()=>T,aV:()=>M,eY:()=>R,fY:()=>$,h4:()=>I,hd:()=>E,m_:()=>A,oT:()=>o,rj:()=>j,tb:()=>L,tq:()=>S,ug:()=>N,yG:()=>O}),e=n.hmd(e);let _=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});_.decode();let s=null;function i(){return null!==s&&0!==s.byteLength||(s=new Uint8Array(r.memory.buffer)),s}function c(e,t){return e>>>=0,_.decode(i().subarray(e,e+t))}const a=new Array(128).fill(void 0);a.push(void 0,null,!0,!1);let u=a.length;function d(e){u===a.length&&a.push(a.length+1);const t=u;return u=a[t],a[t]=e,t}function l(e){return a[e]}function f(e){const t=l(e);return function(e){e<132||(a[e]=u,u=e)}(e),t}function w(e){const t=typeof e;if("number"==t||"boolean"==t||null==e)return`${e}`;if("string"==t)return`"${e}"`;if("symbol"==t){const t=e.description;return null==t?"Symbol":`Symbol(${t})`}if("function"==t){const t=e.name;return"string"==typeof t&&t.length>0?`Function(${t})`:"Function"}if(Array.isArray(e)){const t=e.length;let n="[";t>0&&(n+=w(e[0]));for(let r=1;r<t;r++)n+=", "+w(e[r]);return n+="]",n}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(!(n.length>1))return toString.call(e);if(r=n[1],"Object"==r)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:r}let g=0,p=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const b="function"==typeof p.encodeInto?function(e,t){return p.encodeInto(e,t)}:function(e,t){const n=p.encode(e);return t.set(n),{read:e.length,written:n.length}};function h(e,t,n){if(void 0===n){const n=p.encode(e),r=t(n.length,1)>>>0;return i().subarray(r,r+n.length).set(n),g=n.length,r}let r=e.length,o=t(r,1)>>>0;const _=i();let s=0;for(;s<r;s++){const t=e.charCodeAt(s);if(t>127)break;_[o+s]=t}if(s!==r){0!==s&&(e=e.slice(s)),o=n(o,r,r=s+3*e.length,1)>>>0;const t=i().subarray(o+s,o+r);s+=b(e,t).written}return g=s,o}let y=null;function m(){return null!==y&&0!==y.byteLength||(y=new Int32Array(r.memory.buffer)),y}function v(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}const L=Object.freeze({Level1:0,0:"Level1",Level2:1,1:"Level2",Level3:2,2:"Level3",Level4:3,3:"Level4",Level5:4,4:"Level5",Level6:5,5:"Level6",Level7:6,6:"Level7",Level8:7,7:"Level8",Hacker:8,8:"Hacker",Offensive:9,9:"Offensive",Profane:10,10:"Profane"});class j{static __wrap(e){e>>>=0;const t=Object.create(j.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){const e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_grid_free(e)}constructor(e,t,n){v(e,k),v(n,O);const o=r.grid_new_js(e.__wbg_ptr,t,n.__wbg_ptr);return j.__wrap(o)}size(){return r.grid_size(this.__wbg_ptr)>>>0}cell(e,t){const n=r.grid_cell(this.__wbg_ptr,e,t);return String.fromCodePoint(n)}findWords(e,t){return v(e,k),f(r.grid_findWords(this.__wbg_ptr,e.__wbg_ptr,t))}}class O{static __wrap(e){e>>>=0;const t=Object.create(O.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){const e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_jsrandom_free(e)}constructor(e){const t=h(e,r.__wbindgen_malloc,r.__wbindgen_realloc),n=g,o=r.jsrandom_new(t,n);return O.__wrap(o)}next(){return r.jsrandom_next(this.__wbg_ptr)}nextByte(){return r.jsrandom_nextByte(this.__wbg_ptr)}choice(e){return 0!==r.jsrandom_choice(this.__wbg_ptr,e)}range(e,t){return r.jsrandom_range(this.__wbg_ptr,e,t)}normal(e,t){return r.jsrandom_normal(this.__wbg_ptr,e,t)}}class k{static __wrap(e){e>>>=0;const t=Object.create(k.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){const e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_words_free(e)}static builder(){const e=r.words_builder();return x.__wrap(e)}count(){return r.words_count(this.__wbg_ptr)>>>0}letters(){let e,t;try{const _=r.__wbindgen_add_to_stack_pointer(-16);r.words_letters(_,this.__wbg_ptr);var n=m()[_/4+0],o=m()[_/4+1];return e=n,t=o,c(n,o)}finally{r.__wbindgen_add_to_stack_pointer(16),r.__wbindgen_free(e,t,1)}}}class x{static __wrap(e){e>>>=0;const t=Object.create(x.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){const e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_wordsbuilder_free(e)}constructor(){const e=r.words_builder();return x.__wrap(e)}build(){const e=this.__destroy_into_raw(),t=r.wordsbuilder_build(e);return k.__wrap(t)}addLine(e){try{const n=r.__wbindgen_add_to_stack_pointer(-16),o=h(e,r.__wbindgen_malloc,r.__wbindgen_realloc),_=g;r.wordsbuilder_addLine(n,this.__wbg_ptr,o,_);var t=m()[n/4+0];if(m()[n/4+1])throw f(t)}finally{r.__wbindgen_add_to_stack_pointer(16)}}addLines(e){try{const n=r.__wbindgen_add_to_stack_pointer(-16),o=function(e,t){const n=t(1*e.length,1)>>>0;return i().set(e,n/1),g=e.length,n}(e,r.__wbindgen_malloc),_=g;r.wordsbuilder_addLines(n,this.__wbg_ptr,o,_);var t=m()[n/4+0];if(m()[n/4+1])throw f(t)}finally{r.__wbindgen_add_to_stack_pointer(16)}}}function E(e,t){return d(new Error(c(e,t)))}function N(e){f(e)}function I(e,t){return d(c(e,t))}function A(e){return d(l(e))}function M(e,t,n){l(e)[f(t)]=f(n)}function R(e){return"string"==typeof l(e)}function S(){return d(new Map)}function T(){return d(new Object)}function D(e,t,n){return d(l(e).set(l(t),l(n)))}function $(e,t){const n=h(w(l(t)),r.__wbindgen_malloc,r.__wbindgen_realloc),o=g;m()[e/4+1]=o,m()[e/4+0]=n}function G(e,t){throw new Error(c(e,t))}},859:(e,t,n)=>{n.r(t),n.d(t,{handleToWorkerMessage:()=>c});var r,o=n(401),_=n(975);(0,_.oT)(o),function(e){e.MAKE_GRID="MAKE_GRID"}(r||(r={}));const s=1;var i;async function c(e,t){t.type===r.MAKE_GRID&&(await d,e.postMessage(function(e){if(e.version!==s)return{type:i.UNKNOWN_VERSION,message:e,versions:new Set([s])};let t=w.get(e.seed);if(!t){const n=0===l?u:void 0;++l;const r=performance.now(),o=function(e){const t=new _.yG(e.seed),n=new _.rj(a,e.size,t),r=n.findWords(a,e.minLength),o=[];for(let e=0;e<n.size();++e){const t=[];for(let r=0;r<n.size();++r)t.push(n.cell(e,r));o.push(t.join("").toUpperCase())}const s=new Map;for(const[e,t]of[...r.entries()].sort())s.set(e.toUpperCase(),_.tb[t]);return t.free(),n.free(),{type:i.GRID,message:e,grid:o,words:s}}(e),s=performance.now()-r;for(w.set(e.seed,o);w.size>f;){const e=w.keys().next().value;w.delete(e)}t={...o,wordsLoadMs:n,elapsedMs:s}}return t}(t)))}let a,u;!function(e){e.GRID="GRID",e.UNKNOWN_VERSION="UNKNOWN_VERSION"}(i||(i={}));const d=async function(){const e=performance.now(),t=await fetch(`words-v${s}.txt`),n=t.body?.getReader(),r=new _.Jk;for(;;){const e=await(n?.read());if(!e||e.done)break;r.addLines(e.value)}a=r.build(),u=performance.now()-e}();let l=0;const f=100,w=new Map},401:(e,t,n)=>{var r=n.w[e.id];for(var o in n.r(t),r)o&&(t[o]=r[o]);n(975),r[""]()}}]);
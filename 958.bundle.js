"use strict";(self.webpackChunkleadpipe_wordgrid=self.webpackChunkleadpipe_wordgrid||[]).push([[958],{975:(e,t,r)=>{r.d(t,{Jk:()=>k,Or:()=>x,h4:()=>j,rj:()=>v,t$:()=>O,tb:()=>y,yG:()=>L});var n=r(401);e=r.hmd(e);let o=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});o.decode();let s=new Uint8Array;function i(){return 0===s.byteLength&&(s=new Uint8Array(n.memory.buffer)),s}function _(e,t){return o.decode(i().subarray(e,e+t))}const c=new Array(32).fill(void 0);c.push(void 0,null,!0,!1);let d=c.length;function a(e){d===c.length&&c.push(c.length+1);const t=d;return d=c[t],c[t]=e,t}let l=0,u=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const w="function"==typeof u.encodeInto?function(e,t){return u.encodeInto(e,t)}:function(e,t){const r=u.encode(e);return t.set(r),{read:e.length,written:r.length}};function f(e,t,r){if(void 0===r){const r=u.encode(e),n=t(r.length);return i().subarray(n,n+r.length).set(r),l=r.length,n}let n=e.length,o=t(n);const s=i();let _=0;for(;_<n;_++){const t=e.charCodeAt(_);if(t>127)break;s[o+_]=t}if(_!==n){0!==_&&(e=e.slice(_)),o=r(o,n,n=_+3*e.length);const t=i().subarray(o+_,o+n);_+=w(e,t).written}return l=_,o}let p=new Int32Array;function h(){return 0===p.byteLength&&(p=new Int32Array(n.memory.buffer)),p}function g(e){const t=function(e){return c[e]}(e);return function(e){e<36||(c[e]=d,d=e)}(e),t}function b(e,t){if(!(e instanceof t))throw new Error(`expected instance of ${t.name}`);return e.ptr}const y=Object.freeze({Level1:0,0:"Level1",Level2:1,1:"Level2",Level3:2,2:"Level3",Level4:3,3:"Level4",Level5:4,4:"Level5",Level6:5,5:"Level6",Level7:6,6:"Level7",Level8:7,7:"Level8",Hacker:8,8:"Hacker",Offensive:9,9:"Offensive",Profane:10,10:"Profane"});class v{static __wrap(e){const t=Object.create(v.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();n.__wbg_grid_free(e)}constructor(e,t,r){b(e,m),b(r,L);const o=n.grid_new_js(e.ptr,t,r.ptr);return v.__wrap(o)}size(){return n.grid_size(this.ptr)>>>0}cell(e,t){const r=n.grid_cell(this.ptr,e,t);return String.fromCodePoint(r)}findWords(e,t){return b(e,m),g(n.grid_findWords(this.ptr,e.ptr,t))}}class L{static __wrap(e){const t=Object.create(L.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();n.__wbg_jsrandom_free(e)}constructor(e){const t=f(e,n.__wbindgen_malloc,n.__wbindgen_realloc),r=l,o=n.jsrandom_new(t,r);return L.__wrap(o)}next(){return n.jsrandom_next(this.ptr)}choice(e){return 0!==n.jsrandom_choice(this.ptr,e)}range(e,t){return n.jsrandom_range(this.ptr,e,t)}normal(e,t){return n.jsrandom_normal(this.ptr,e,t)}}class m{static __wrap(e){const t=Object.create(m.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();n.__wbg_words_free(e)}static builder(){const e=n.words_builder();return k.__wrap(e)}word_category(e){const t=f(e,n.__wbindgen_malloc,n.__wbindgen_realloc),r=l,o=n.words_word_category(this.ptr,t,r);return 11===o?void 0:o}is_strict_prefix(e){const t=f(e,n.__wbindgen_malloc,n.__wbindgen_realloc),r=l;return 0!==n.words_is_strict_prefix(this.ptr,t,r)}count(){return n.words_count(this.ptr)>>>0}letters(){try{const r=n.__wbindgen_add_to_stack_pointer(-16);n.words_letters(r,this.ptr);var e=h()[r/4+0],t=h()[r/4+1];return _(e,t)}finally{n.__wbindgen_add_to_stack_pointer(16),n.__wbindgen_free(e,t)}}}class k{static __wrap(e){const t=Object.create(k.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();n.__wbg_wordsbuilder_free(e)}constructor(){const e=n.wordsbuilder_new();return k.__wrap(e)}build(){const e=this.__destroy_into_raw(),t=n.wordsbuilder_build(e);return m.__wrap(t)}addLine(e){try{const r=n.__wbindgen_add_to_stack_pointer(-16),o=f(e,n.__wbindgen_malloc,n.__wbindgen_realloc),s=l;n.wordsbuilder_addLine(r,this.ptr,o,s);var t=h()[r/4+0];if(h()[r/4+1])throw g(t)}finally{n.__wbindgen_add_to_stack_pointer(16)}}addLines(e){try{const r=n.__wbindgen_add_to_stack_pointer(-16),o=function(e,t){const r=t(1*e.length);return i().set(e,r/1),l=e.length,r}(e,n.__wbindgen_malloc),s=l;n.wordsbuilder_addLines(r,this.ptr,o,s);var t=h()[r/4+0];if(h()[r/4+1])throw g(t)}finally{n.__wbindgen_add_to_stack_pointer(16)}}}function O(e,t){return a(JSON.parse(_(e,t)))}function j(e,t){return a(_(e,t))}function x(e,t){throw new Error(_(e,t))}},958:(e,t,r)=>{r.r(t),r.d(t,{handleToWorkerMessage:()=>i});var n,o,s=r(975);async function i(e,t){t.type===n.MAKE_GRID&&(await c,e.postMessage(function(e){if(1!==e.version)return{type:o.UNKNOWN_VERSION,message:e,versions:new Set([1])};const t=new s.yG(e.seed),r=new s.rj(_,e.size,t),n=r.findWords(_,e.minLength),i=[];for(let e=0;e<r.size();++e){const t=[];for(let n=0;n<r.size();++n)t.push(r.cell(e,n));i.push(t.join("").toUpperCase())}const c=new Map;for(const e of Object.keys(n).sort())c.set(e.toUpperCase(),s.tb[n[e]]);return t.free(),r.free(),{type:o.GRID,message:e,grid:i,words:c}}(t)))}let _;!function(e){e.MAKE_GRID="MAKE_GRID"}(n||(n={})),function(e){e.GRID="GRID",e.UNKNOWN_VERSION="UNKNOWN_VERSION"}(o||(o={})),console.log("Loading words...");const c=async function(){var e;const t=null===(e=(await fetch("words-v1.txt")).body)||void 0===e?void 0:e.getReader(),r=new s.Jk;for(;;){const e=await(null==t?void 0:t.read());if(!e||e.done)break;r.addLines(e.value)}_=r.build(),console.log(`Loaded ${_.count()} words`)}()},401:(e,t,r)=>{var n=r.w[e.id];e.exports=n,r(975),n[""]()}}]);
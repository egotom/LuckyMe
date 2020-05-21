var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function l(t){t.forEach(n)}function o(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function r(t,n){t.appendChild(n)}function s(t,n,e){t.insertBefore(n,e||null)}function u(t){t.parentNode.removeChild(t)}function i(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function f(t){return document.createElement(t)}function a(t){return document.createTextNode(t)}function d(){return a(" ")}function p(t,n,e,l){return t.addEventListener(n,e,l),()=>t.removeEventListener(n,e,l)}function g(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function h(t,n){n=""+n,t.data!==n&&(t.data=n)}function m(t,n){(null!=n||t.value)&&(t.value=n)}function b(t,n,e){t.classList[e?"add":"remove"](n)}let k;function $(t){k=t}function v(t){(function(){if(!k)throw new Error("Function called outside component initialization");return k})().$$.on_mount.push(t)}const y=[],x=[],w=[],_=[],M=Promise.resolve();let O=!1;function E(t){w.push(t)}let S=!1;const L=new Set;function N(){if(!S){S=!0;do{for(let t=0;t<y.length;t+=1){const n=y[t];$(n),A(n.$$)}for(y.length=0;x.length;)x.pop()();for(let t=0;t<w.length;t+=1){const n=w[t];L.has(n)||(L.add(n),n())}w.length=0}while(y.length);for(;_.length;)_.pop()();O=!1,S=!1,L.clear()}}function A(t){if(null!==t.fragment){t.update(),l(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(E)}}const C=new Set;let I;function T(){I={r:0,c:[],p:I}}function j(){I.r||l(I.c),I=I.p}function B(t,n){t&&t.i&&(C.delete(t),t.i(n))}function J(t,n,e,l){if(t&&t.o){if(C.has(t))return;C.add(t),I.c.push(()=>{C.delete(t),l&&(e&&t.d(1),l())}),t.o(n)}}function H(t){t&&t.c()}function q(t,e,c){const{fragment:r,on_mount:s,on_destroy:u,after_update:i}=t.$$;r&&r.m(e,c),E(()=>{const e=s.map(n).filter(o);u?u.push(...e):l(e),t.$$.on_mount=[]}),i.forEach(E)}function z(t,n){const e=t.$$;null!==e.fragment&&(l(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function F(t,n){-1===t.$$.dirty[0]&&(y.push(t),O||(O=!0,M.then(N)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function P(n,o,c,r,s,i,f=[-1]){const a=k;$(n);const d=o.props||{},p=n.$$={fragment:null,ctx:null,props:i,update:t,not_equal:s,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:e(),dirty:f};let g=!1;if(p.ctx=c?c(n,d,(t,e,...l)=>{const o=l.length?l[0]:e;return p.ctx&&s(p.ctx[t],p.ctx[t]=o)&&(p.bound[t]&&p.bound[t](o),g&&F(n,t)),e}):[],p.update(),g=!0,l(p.before_update),p.fragment=!!r&&r(p.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);p.fragment&&p.fragment.l(t),t.forEach(u)}else p.fragment&&p.fragment.c();o.intro&&B(n.$$.fragment),q(n,o.target,o.anchor),N()}$(a)}class D{$destroy(){z(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}const G=[];function K(t,n,e){const l=t.slice();return l[5]=n[e],l}function Q(t){let n,e,l,o,c=t[5]+"";return{c(){n=f("div"),e=f("div"),l=a(c),o=d(),g(e,"class","fancy svelte-pdi5b0"),b(e,"fld",t[2]),g(n,"class","solt svelte-pdi5b0")},m(t,c){s(t,n,c),r(n,e),r(e,l),r(n,o)},p(t,n){1&n&&c!==(c=t[5]+"")&&h(l,c),4&n&&b(e,"fld",t[2])},d(t){t&&u(n)}}}function R(n){let e,l,o,c,m,b,k=n[0],$=[];for(let t=0;t<k.length;t+=1)$[t]=Q(K(n,k,t));return{c(){e=f("main"),l=f("div"),o=f("div"),c=a(n[1]),m=d();for(let t=0;t<$.length;t+=1)$[t].c();g(o,"class","label svelte-pdi5b0"),g(l,"class","solt svelte-pdi5b0")},m(t,u,i){s(t,e,u),r(e,l),r(l,o),r(o,c),r(e,m);for(let t=0;t<$.length;t+=1)$[t].m(e,null);i&&b(),b=p(o,"click",n[4])},p(t,[n]){if(2&n&&h(c,t[1]),5&n){let l;for(k=t[0],l=0;l<k.length;l+=1){const o=K(t,k,l);$[l]?$[l].p(o,n):($[l]=Q(o),$[l].c(),$[l].m(e,null))}for(;l<$.length;l+=1)$[l].d(1);$.length=k.length}},i:t,o:t,d(t){t&&u(e),i($,t),b()}}}function U(t,n,e){let{lk:l=[]}=n,{lb:o="A"}=n,{miss:c=!0}=n,{addOne:r=null}=n;return t.$set=t=>{"lk"in t&&e(0,l=t.lk),"lb"in t&&e(1,o=t.lb),"miss"in t&&e(2,c=t.miss),"addOne"in t&&e(3,r=t.addOne)},[l,o,c,r,()=>r(l)]}class V extends D{constructor(t){super(),P(this,t,U,R,c,{lk:0,lb:1,miss:2,addOne:3})}}function W(t,n,e){const l=t.slice();return l[21]=n[e],l}function X(t,n,e){const l=t.slice();return l[24]=n[e],l}function Y(t){let n,e,l,o,c,i,m,b,k,$,v,y,x,w,_,M,O,E,S,L,N,A=t[3][2]+"",C=t[3][3]+"",I=t[3][0]+"",T=t[3][4]+"",j=t[3][5]+"";return{c(){n=f("div"),e=f("div"),l=f("div"),o=f("div"),c=f("p"),i=a(A),m=a(" : "),b=a(C),k=d(),$=f("p"),v=a(t[4]),y=a("-"),x=a(I),w=d(),_=f("p"),M=a("因："),O=a(T),E=d(),S=f("p"),L=a(j),g(c,"class","who svelte-1ku09d5"),g($,"class","sel svelte-1ku09d5"),g(_,"class","why svelte-1ku09d5"),g(S,"class","when svelte-1ku09d5"),g(o,"class","info svelte-1ku09d5"),g(l,"class","modal svelte-1ku09d5"),g(e,"class","back svelte-1ku09d5"),g(n,"class","backdrop svelte-1ku09d5")},m(u,f,a){s(u,n,f),r(n,e),r(e,l),r(l,o),r(o,c),r(c,i),r(c,m),r(c,b),r(o,k),r(o,$),r($,v),r($,y),r($,x),r(o,w),r(o,_),r(_,M),r(_,O),r(o,E),r(o,S),r(S,L),a&&N(),N=p(l,"click",t[12])},p(t,n){8&n&&A!==(A=t[3][2]+"")&&h(i,A),8&n&&C!==(C=t[3][3]+"")&&h(b,C),16&n&&h(v,t[4]),8&n&&I!==(I=t[3][0]+"")&&h(x,I),8&n&&T!==(T=t[3][4]+"")&&h(O,T),8&n&&j!==(j=t[3][5]+"")&&h(L,j)},d(t){t&&u(n),N()}}}function Z(t){let n,e,o,c,i,m,b,k=t[24]+"";function $(...n){return t[19](t[24],...n)}function v(...n){return t[20](t[24],...n)}return{c(){n=f("li"),e=f("b"),o=a(k),c=d(),i=f("span"),i.innerHTML='<img alt="close" src="close.jpeg" class="svelte-1ku09d5">',m=d(),g(e,"class","svelte-1ku09d5"),g(i,"class","btn svelte-1ku09d5")},m(t,u,f){s(t,n,u),r(n,e),r(e,o),r(n,c),r(n,i),r(n,m),f&&l(b),b=[p(e,"click",$),p(i,"click",v)]},p(n,e){t=n,2&e&&k!==(k=t[24]+"")&&h(o,k)},d(t){t&&u(n),l(b)}}}function tt(t){let n;const e=new V({props:{lk:t[21],lb:t[4],miss:!0}});return{c(){H(e.$$.fragment)},m(t,l){q(e,t,l),n=!0},p(t,n){const l={};1&n&&(l.lk=t[21]),16&n&&(l.lb=t[4]),e.$set(l)},i(t){n||(B(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}function nt(t){let n;const e=new V({props:{lk:t[21],lb:t[4],addOne:t[9],miss:!1}});return{c(){H(e.$$.fragment)},m(t,l){q(e,t,l),n=!0},p(t,n){const l={};1&n&&(l.lk=t[21]),16&n&&(l.lb=t[4]),e.$set(l)},i(t){n||(B(e.$$.fragment,t),n=!0)},o(t){J(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}function et(t){let n,e,l,o,c;const r=[nt,tt],i=[];function f(t,e){return 1&e&&(n=!!t[11](t[21])),n?0:1}return e=f(t,-1),l=i[e]=r[e](t),{c(){l.c(),o=a("")},m(t,n){i[e].m(t,n),s(t,o,n),c=!0},p(t,n){let c=e;e=f(t,n),e===c?i[e].p(t,n):(T(),J(i[c],1,1,()=>{i[c]=null}),j(),l=i[e],l||(l=i[e]=r[e](t),l.c()),B(l,1),l.m(o.parentNode,o))},i(t){c||(B(l),c=!0)},o(t){J(l),c=!1},d(t){i[e].d(t),t&&u(o)}}}function lt(t){let n,e,o,c,a,h,b,k,$,v,y,x,w,_,M,O,E,S,L,N,A=t[2]&&Y(t),C=t[1],I=[];for(let n=0;n<C.length;n+=1)I[n]=Z(X(t,C,n));let H=t[0],q=[];for(let n=0;n<H.length;n+=1)q[n]=et(W(t,H,n));const z=t=>J(q[t],1,1,()=>{q[t]=null});return{c(){n=f("main"),A&&A.c(),e=d(),o=f("div"),c=f("div"),a=f("span"),a.textContent="获奖人数：",h=f("input"),b=d(),k=f("br"),$=d(),v=f("button"),v.textContent="开 始",y=d(),x=f("button"),x.textContent="停 止",w=d(),_=f("ul");for(let t=0;t<I.length;t+=1)I[t].c();M=d(),O=f("div"),O.innerHTML='<a href="https://github.com/egotom/LuckyMe" target="_blank">开放源代码: github.com/egotom/LuckyMe</a>',E=d(),S=f("div");for(let t=0;t<q.length;t+=1)q[t].c();g(a,"class","label svelte-1ku09d5"),g(h,"type","text"),g(h,"id","luckMax"),g(_,"class","luckMe svelte-1ku09d5"),g(O,"class","open svelte-1ku09d5"),g(c,"class","opt"),g(S,"class","bod"),g(o,"class","dash svelte-1ku09d5")},m(u,i,f){s(u,n,i),A&&A.m(n,null),r(n,e),r(n,o),r(o,c),r(c,a),r(c,h),m(h,t[5]),r(c,b),r(c,k),r(c,$),r(c,v),r(c,y),r(c,x),r(c,w),r(c,_);for(let t=0;t<I.length;t+=1)I[t].m(_,null);r(c,M),r(c,O),r(o,E),r(o,S);for(let t=0;t<q.length;t+=1)q[t].m(S,null);L=!0,f&&l(N),N=[p(h,"keyup",t[6]),p(h,"input",t[18]),p(v,"click",t[8]),p(x,"click",t[7])]},p(t,[l]){if(t[2]?A?A.p(t,l):(A=Y(t),A.c(),A.m(n,e)):A&&(A.d(1),A=null),32&l&&h.value!==t[5]&&m(h,t[5]),5122&l){let n;for(C=t[1],n=0;n<C.length;n+=1){const e=X(t,C,n);I[n]?I[n].p(e,l):(I[n]=Z(e),I[n].c(),I[n].m(_,null))}for(;n<I.length;n+=1)I[n].d(1);I.length=C.length}if(2577&l){let n;for(H=t[0],n=0;n<H.length;n+=1){const e=W(t,H,n);q[n]?(q[n].p(e,l),B(q[n],1)):(q[n]=et(e),q[n].c(),B(q[n],1),q[n].m(S,null))}for(T(),n=H.length;n<q.length;n+=1)z(n);j()}},i(t){if(!L){for(let t=0;t<H.length;t+=1)B(q[t]);L=!0}},o(t){q=q.filter(Boolean);for(let t=0;t<q.length;t+=1)J(q[t]);L=!1},d(t){t&&u(n),A&&A.d(),i(I,t),i(q,t),l(N)}}}function ot(n,e,l){let o,r=[],s=[],u=!1,i=[],f="B",a=5,d=5,p=null;const g=function(n,e=t){let l;const o=[];function r(t){if(c(n,t)&&(n=t,l)){const t=!G.length;for(let t=0;t<o.length;t+=1){const e=o[t];e[1](),G.push(e,n)}if(t){for(let t=0;t<G.length;t+=2)G[t][0](G[t+1]);G.length=0}}}return{set:r,update:function(t){r(t(n))},subscribe:function(c,s=t){const u=[c,s];return o.push(u),1===o.length&&(l=e(r)||t),c(n),()=>{const t=o.indexOf(u);-1!==t&&o.splice(t,1),0===o.length&&(l(),l=null)}}}}(JSON.parse(localStorage.getItem("luckMe"))||[]),h=g.subscribe(t=>{l(1,s=t)});function m(){l(0,r=[]);for(let t=0;t<d;t++){let t=[];for(let n=0;n<a;n++)t.push(0);r.push(t)}}function b(t){l(1,s=s.filter(n=>n!=t)),g.subscribe(localStorage.setItem("luckMe",JSON.stringify(s)))}function k(t){if(l(2,u=!u),"string"==typeof t){console.log(t.substring(2)),l(3,i=[]);let n=parseInt(t.substring(2));for(let t in o)if(n==o[t][0]){l(3,i=o[t]);break}}}v(async()=>{const t=await fetch("http://120.26.118.222:5000/rflyts/4");let n=await t.json();a=n.sn,l(4,f=n.cpt),o=n.lst,m()});return[r,s,u,i,f,d,m,function(){window.clearTimeout(p),p=null},function t(){p=window.setTimeout(t,20);let n=0,e=0;for(;;){let t=Math.round(10*Math.random());if(t<10&&(l(0,r[e][n]=t,r),n++,n==a&&(e++,n=0)),n>a&&e>d)break}},function(t){let n=f+"-";for(let e in t)n+=t[e];l(1,s=[n,...s]),g.subscribe(localStorage.setItem("luckMe",JSON.stringify(s)))},b,function(t){let n="";for(let e in t)n+=t[e];let e=parseInt(n),l=!1;for(let t in o)if(e==o[t][0]){l=!0;break}let c=f+"-"+n;for(let t in s)if(s[t]==c)return!1;return l},k,o,a,p,g,h,function(){d=this.value,l(5,d)},t=>k(t),t=>b(t)]}return new class extends D{constructor(t){super(),P(this,t,ot,lt,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map

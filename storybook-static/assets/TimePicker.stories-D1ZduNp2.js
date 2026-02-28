import{d as be,r as x,o as me,w as z,c as J,a as R,b as Z,F as Ve,e as He,n as xe,f as ce,t as Ie,g as v,h as he,i as le,j as ve,k as fe,u as D,l as pe}from"./iframe-DomrUmUN.js";import"./preload-helper-D9Z9MdNV.js";const ze={class:"timepicker-dropdown"},De=["tabindex","onClick","onMousemove"],j=be({__name:"TimeColumn",props:{items:{},activeIndex:{}},emits:["update:activeIndex","select"],setup(t,{emit:n}){const o=t,e=n,c=x(null);function l(){xe(()=>{const T=c.value;if(!T)return;const p=T.querySelector(".timepicker-option--active");if(p){const w=T.clientHeight,M=p.offsetTop,A=p.offsetHeight;T.scrollTop=M-w/2+A/2}})}me(l),z(()=>o.activeIndex,l);function y(T){e("update:activeIndex",T),e("select",o.items[T]?.value)}const P=x(o.activeIndex??0);return(T,p)=>(R(),J("div",ze,[Z("div",{ref_key:"menu",ref:c,class:"timepicker-dropdown__panel",role:"listbox",tabindex:"-1"},[(R(!0),J(Ve,null,He(T.items,(w,M)=>(R(),J("div",{key:w.key,class:ce(["timepicker-option",{"timepicker-option--active":M===T.activeIndex,"timepicker-option--disabled":w.disabled,"timepicker-option--focused":M===P.value}]),role:"option",tabindex:w.disabled?-1:0,onClick:A=>!w.disabled&&y(M),onMousemove:A=>!w.disabled&&(P.value=M)},Ie(w.text),43,De))),128))],512)]))}});j.__docgenInfo=Object.assign({displayName:j.name??j.__name},{exportName:"default",displayName:"TimeColumn",description:"",tags:{},props:[{name:"items",required:!0,type:{name:"Array",elements:[{name:`{
  key: string | number;
  value: any;
  text: string;
  disabled?: boolean;
}`}]}},{name:"activeIndex",required:!0,type:{name:"number"}}],events:[{name:"update:activeIndex",type:{names:["number"]}},{name:"select",type:{names:["any"]}}],sourceFiles:["/Users/manossavvides/programming/vue-timepicker/src/TimePicker/TimeColumn.vue"]});function ke(t){return t.h*3600+t.m*60+t.s}function Pe(t){return/(a|A|p|P)/.test(t)}function _e(t){return/(p|P)/.test(t)}function ge(t){return/k{1,2}/.test(t)}function q(t,n){if(!t||typeof t!="string")return{h:0,m:0,s:0};const o=t.match(/\d+/g)||[];let e=o[0]!==void 0?+o[0]:0;const c=+o[1]||0,l=+o[2]||0;return{h:e,m:c,s:l}}function Ne(t){const n=t%12;return n===0?12:n}function Te(t,n){return n?t%12+12:t%12}function Fe(t){return/(s|ss)/.test(t)}function te(t,n){let{h:o,m:e,s:c}=n;const l=Pe(t),y=o>=12?"PM":"AM";l&&(o=Ne(o));const P=o===0?24:o,T={HH:String(o).padStart(2,"0"),H:String(o),hh:String(o).padStart(2,"0"),h:String(o),kk:String(P).padStart(2,"0"),k:String(P),mm:String(e).padStart(2,"0"),m:String(e),ss:String(c).padStart(2,"0"),s:String(c),A:y,a:y.toLowerCase(),P:y,p:y.toLowerCase()};return t.replace(/HH|hh|kk|mm|ss|H|h|k|m|s|A|a|P|p/g,p=>T[p]??p)}function G(t,n){return ke(t)-ke(n)}function Ee(t,n,o){return n&&G(t,n)<0?{...n}:o&&G(t,o)>0?{...o}:{...t}}function Me(t,n,o){return!(n&&G(t,n)<0||o&&G(t,o)>0)}function Ae(t,n){return n.some(([o,e])=>G(t,o)>=0&&G(t,e)<=0)}const ae=be({__name:"TimeSelection",props:{open:{type:Boolean},initTime:{},format:{},minTime:{},maxTime:{},disabledRanges:{},isTimeDisabled:{type:Function},hourStep:{},minuteStep:{},secondStep:{}},emits:["update:initTime","open","close","update:open"],setup(t,{emit:n}){const o=v(()=>Pe(l.format)),e=v(()=>Fe(l.format)),c=v(()=>ge(l.format)),l=t,y=n,P=v({get:()=>l.open??!1,set:a=>{const b=l.open??!1;a!==b&&(y("update:open",a),y(a?"open":"close"))}}),T=x(null);function p(a){if(!P.value)return;const b=a.target;T.value&&!T.value.contains(b)&&(P.value=!1)}me(()=>document.addEventListener("mousedown",p)),he(()=>document.removeEventListener("mousedown",p));function w(a){a.key==="Escape"&&P.value&&(P.value=!1)}me(()=>document.addEventListener("keydown",w)),he(()=>document.removeEventListener("keydown",w));const M=x(Math.floor(l.initTime.h/l.hourStep)||0),A=x(Math.floor(l.initTime.m/l.minuteStep)||0),N=x(Math.floor(l.initTime.s/l.secondStep)||0);z(()=>l.initTime,a=>{const b=Math.max(1,l.hourStep),k=Math.max(1,l.minuteStep),S=Math.max(1,l.secondStep);let I=a.h;o.value?(E.value=a.h>=12?1:0,I=a.h%12):c.value&&a.h===0&&(I=24),M.value=Math.floor(I/b),A.value=Math.floor(a.m/k),N.value=Math.floor(a.s/S)});function C(a,b){const k=[];for(let S=0;S<a;S+=Math.max(1,b))k.push({key:S,value:S,text:String(S).padStart(2,"0")});return k}function Q(a,b){const k=Math.max(1,b),S=[];for(let I=0;I<12;I+=k){const ue=I===0?12:I,ye=a?I===0?12:I+12:I;S.push({key:ye,value:ye,text:String(ue).padStart(2,"0")})}return S}function K(a){const b=Math.max(1,a),k=[];for(let S=0;S<24;S+=b){const I=S===0?24:S;k.push({key:S,value:S,text:String(I).padStart(2,"0")})}return k}const E=x(_e(l.format)?1:0),$=v(()=>{if(!o.value)return c.value?K(l.hourStep):C(24,l.hourStep);const a=E.value===1;return Q(a,l.hourStep)}),F=v(()=>C(60,l.minuteStep)),s=v(()=>C(60,l.secondStep)),d=v(()=>/\s[ap]$/.test(l.format)),u=v(()=>{const a=d.value?"am":"AM",b=d.value?"pm":"PM";return[{key:"AM",value:"AM",text:a},{key:"PM",value:"PM",text:b}]}),f=v(()=>F.value.map(a=>Number(a.value??0))),g=v(()=>e.value?s.value.map(a=>Number(a.value??0)):[0]);function h(a){return Number(a.value??0)}function B(a){const b=a.findIndex(k=>!k.disabled);return b>=0?b:0}function V(a){return!(!Me(a,l.minTime,l.maxTime)||Ae(a,l.disabledRanges??[])||l.isTimeDisabled?.(a))}const ee=v(()=>$.value.map(a=>{const b=h(a),k=f.value.some(S=>g.value.some(I=>V({h:b,m:S,s:I})));return{...a,disabled:!k}})),_=v(()=>{const a=Number($.value[M.value]?.value??0);return F.value.map(b=>{const k=Number(b.value??0),S=g.value.some(I=>V({h:a,m:k,s:I}));return{...b,disabled:!S}})}),ie=v(()=>{const a=Number($.value[M.value]?.value??0),b=Number(F.value[A.value]?.value??0);return s.value.map(k=>{const S=Number(k.value??0);return{...k,disabled:!V({h:a,m:b,s:S})}})}),X=v(()=>{if(!o.value)return u.value;const a=Number(F.value[A.value]?.value??0),b=e.value?Number(s.value[N.value]?.value??0):0;return u.value.map(k=>{const S=k.value==="PM",I=Q(S,l.hourStep).some(ue=>V({h:Number(ue.value??0),m:a,s:b}));return{...k,disabled:!I}})}),ne=v(()=>E.value===1?"PM":"AM"),de=v(()=>{const a=Number($.value[M.value]?.value??0);return o.value?ne.value==="PM"?Te(a,!0):Te(a,!1):c.value&&a===24?0:a}),U=v(()=>Number(F.value[A.value]?.value??0)),i=v(()=>Number(s.value[N.value]?.value??0));z(ee,a=>{a.length&&(!a[M.value]||a[M.value].disabled)&&(M.value=B(a))}),z(_,a=>{a.length&&(!a[A.value]||a[A.value].disabled)&&(A.value=B(a))}),z(ie,a=>{!e.value||!a.length||(!a[N.value]||a[N.value].disabled)&&(N.value=B(a))}),z(X,a=>{!o.value||!a.length||(!a[E.value]||a[E.value].disabled)&&(E.value=B(a))});function r(a){!e.value&&!o.value&&H()}function m(a){o.value||H()}function L(a){H()}function H(){P.value=!1}return z([de,U,i],([a,b,k])=>{y("update:initTime",{h:a,m:b,s:k})},{immediate:!0}),(a,b)=>P.value?(R(),J("div",{key:0,class:"vtp-cols",ref_key:"root",ref:T},[ve(j,{activeIndex:M.value,"onUpdate:activeIndex":b[0]||(b[0]=k=>M.value=k),items:ee.value,label:"Hours"},null,8,["activeIndex","items"]),ve(j,{activeIndex:A.value,"onUpdate:activeIndex":b[1]||(b[1]=k=>A.value=k),items:_.value,label:"Minutes",onSelect:r},null,8,["activeIndex","items"]),e.value?(R(),fe(j,{key:0,activeIndex:N.value,"onUpdate:activeIndex":b[2]||(b[2]=k=>N.value=k),items:ie.value,label:"Seconds",onSelect:m},null,8,["activeIndex","items"])):le("",!0),o.value?(R(),fe(j,{key:1,activeIndex:E.value,"onUpdate:activeIndex":b[3]||(b[3]=k=>E.value=k),items:X.value,label:"AM/PM",onSelect:L},null,8,["activeIndex","items"])):le("",!0)],512)):le("",!0)}});ae.__docgenInfo=Object.assign({displayName:ae.name??ae.__name},{exportName:"default",displayName:"TimeSelection",description:"",tags:{},props:[{name:"open",required:!0,type:{name:"boolean"}},{name:"initTime",required:!0,type:{name:"InternalFormat"}},{name:"format",required:!0,type:{name:"string"}},{name:"minTime",required:!1,type:{name:"union",elements:[{name:"InternalFormat"},{name:"null"}]}},{name:"maxTime",required:!1,type:{name:"union",elements:[{name:"InternalFormat"},{name:"null"}]}},{name:"disabledRanges",required:!1,type:{name:"Array",elements:[{name:"tuple",elements:[{name:"InternalFormat"},{name:"InternalFormat"}]}]}},{name:"isTimeDisabled",required:!1,type:{name:"TSFunctionType"}},{name:"hourStep",required:!1,type:{name:"number"}},{name:"minuteStep",required:!1,type:{name:"number"}},{name:"secondStep",required:!1,type:{name:"number"}}],events:[{name:"update:initTime",type:{names:["InternalFormat"]}},{name:"open"},{name:"close"},{name:"update:open",type:{names:["boolean"]}}],sourceFiles:["/Users/manossavvides/programming/vue-timepicker/src/TimePicker/TimeSelection.vue"]});var Le={};function $e(t){return typeof t=="string"?W.test(t):Array.isArray(t)?t.length===2&&W.test(t[0]??"")&&W.test(t[1]??""):!1}const we=/^(HH|H|hh|h|kk|k):(mm|m)(?::(ss|s))?(?:\s*(A|a|P|p))?$/,W=/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/,Y=typeof __DEV__<"u"?__DEV__:typeof process<"u"&&Le&&!1,Ce={modelValue:{type:[String,Array],default:void 0,validator:t=>{let n;return Array.isArray(t)?n=t.length===2&&t.every(o=>W.test(o)):n=t==null||W.test(t),!n&&Y&&console.error(`[VueTimepicker] \`modelValue\` is wrong. Received: ${t}`),n}},range:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},hourStep:{type:Number,default:1},minuteStep:{type:Number,default:1},secondStep:{type:Number,default:1},minTime:{type:String,default:void 0,validator:t=>{const n=t==null||W.test(t);return!n&&Y&&console.error(`[VueTimepicker] \`minTime\` is wrong. Received: ${t}`),n}},maxTime:{type:String,default:void 0,validator:t=>{const n=t==null||W.test(t);return!n&&Y&&console.error(`[VueTimepicker] \`maxTime\` is wrong. Received: ${t}`),n}},disabledTimes:{type:Array,default:void 0,validator:t=>{const n=t==null||t.every($e);return!n&&Y&&console.error(`[VueTimepicker] \`disabledTimes\` is wrong. Received: ${JSON.stringify(t)}`),n}},isTimeDisabled:{type:Function,default:void 0},format:{type:String,default:"HH:mm",validator:t=>{const n=we.test(t);return!n&&Y&&console.error(`[VueTimepicker] \`format\` format is wrong. Received: ${t}`),n}},size:{type:String,default:"md",validator:t=>{const n=t==="xs"||t==="sm"||t==="md"||t==="lg"||t==="xl";return!n&&Y&&console.error(`[VueTimepicker] \`size\` is wrong. Received: ${t}`),n}}};function Be(t){const n=we.exec(t);if(!n)throw new Error(`[useTimeMask] Invalid format: ${t}`);const[,o,e,c,l]=n,y=[],P=!!l,T=/^k{1,2}$/.test(o);let p=0,w=23;return P?(p=1,w=12):T&&(p=1,w=24),y.push({token:o,min:p,max:w}),y.push({token:e,min:0,max:59}),c&&y.push({token:c,min:0,max:59}),{digitGroups:y,hasAmPm:!!l,ampmLowercase:l==="a"||l==="p"}}function Se(t){const n=v(()=>Be(t.value)),o=v(()=>n.value.digitGroups.length*2),e=x([]),c=x("AM"),l=x("");function y(){const{digitGroups:s,hasAmPm:d}=n.value;let u="",f=0;for(let g=0;g<s.length;g++){for(let h=0;h<2;h++)f<e.value.length&&(u+=String(e.value[f]),f++);f===(g+1)*2&&g<s.length-1&&(u+=":")}if(d&&f>=o.value){const g=n.value.ampmLowercase?c.value.toLowerCase():c.value;u+=" "+g}return u}function P(s){const d=s*2;if(e.value.length<d+2)return;const u=e.value[d]*10+e.value[d+1],{min:f,max:g}=n.value.digitGroups[s],h=Math.max(f,Math.min(g,u));h!==u&&(e.value[d]=Math.floor(h/10),e.value[d+1]=h%10)}function T(){for(let s=0;s<n.value.digitGroups.length;s++)P(s)}function p(s){const d=y();let u=0;for(let f=0;f<Math.min(s,d.length);f++)/\d/.test(d[f])&&u++;return u}function w(s){return s+Math.floor(s/2)}function M(s,d){if(s>=o.value)return o.value;const u=[...e.value];u[s]=d,e.value=u;const f=Math.floor(s/2);return P(f),Math.min(s+1,o.value)}function A(s,d){const u=y();l.value=u,s.value=u;const f=d!==void 0?Math.min(w(d),u.length):u.length;s.selectionStart=s.selectionEnd=f,xe(()=>{document.activeElement===s&&(s.selectionStart=s.selectionEnd=f)})}function N(s){const d=s.key,u=s.target;if(["Tab","Escape","ArrowLeft","ArrowRight","Home","End"].includes(d)||s.metaKey||s.ctrlKey)return;s.preventDefault();const f=u.selectionStart??0,g=p(f);if(d==="Backspace"){g>0&&A(u,g-1);return}if(d!=="Delete"){if(n.value.hasAmPm){const h=d.toLowerCase();if(h==="a"){c.value="AM",A(u,g);return}if(h==="p"){c.value="PM",A(u,g);return}}if(/^\d$/.test(d)){const h=M(g,+d);A(u,h);return}}}function C(s){const d=s.target,u=d.value.replace(/\D/g,"").split("").map(Number).slice(0,o.value);e.value=u,T(),n.value.hasAmPm&&(/p/i.test(d.value)?c.value="PM":/a/i.test(d.value)&&(c.value="AM")),A(d)}function Q(s){s.preventDefault();const d=s.clipboardData?.getData("text")??"",u=s.target,f=u.selectionStart??0,g=d.replace(/\D/g,"").split("").map(Number);let h=p(f);for(const B of g){if(h>=o.value)break;h=M(h,B)}n.value.hasAmPm&&(/p\.?m\.?/i.test(d)?c.value="PM":/a\.?m\.?/i.test(d)&&(c.value="AM")),A(u,h)}function K(s){const{digitGroups:d,hasAmPm:u}=n.value,f=[];let g=s.h;u?(c.value=s.h>=12?"PM":"AM",g=s.h%12,g===0&&(g=12)):ge(t.value)&&(g=s.h===0?24:s.h),f.push(Math.floor(g/10),g%10),f.push(Math.floor(s.m/10),s.m%10),d.length>2&&f.push(Math.floor(s.s/10),s.s%10),e.value=f,l.value=y()}function E(){if(e.value.length<o.value)return null;const s=[];for(let g=0;g<n.value.digitGroups.length;g++){const h=g*2;s.push(e.value[h]*10+e.value[h+1])}let d=s[0];const u=s[1],f=s[2]??0;return n.value.hasAmPm&&(d=c.value==="PM"?d===12?12:d+12:d===12?0:d),ge(t.value)&&d===24&&(d=0),{h:d,m:u,s:f}}const $=v(()=>e.value.length>=o.value),F=v(()=>n.value.ampmLowercase);return{inputValue:l,handleKeydown:N,handleInput:C,handlePaste:Q,setFromTime:K,getParsedTime:E,isComplete:$,totalDigits:o,displayPosToDigitIndex:p,ampm:c,ampmLowercase:F}}const Re=["data-size","data-validation","data-disabled"],Ke=["value","placeholder","disabled"],Ue=["value","placeholder","disabled"],Oe=["value","placeholder","disabled"],O=be({__name:"TimePicker",props:Ce,emits:["update:modelValue","update:validationState","validate","open","close","error"],setup(t,{emit:n}){const o=x(null),e=t,c=n,l=x(!1),y=x(!1),P=x("valid"),T=x("valid");z(l,i=>{if(e.disabled&&i){l.value=!1;return}i&&(y.value=!1)}),z(y,i=>{if(e.disabled&&i){y.value=!1;return}i&&(l.value=!1)}),z(()=>e.disabled,i=>{i&&(l.value=!1,y.value=!1)});const p=v({get(){if(Array.isArray(e.modelValue)){const[i,r]=e.modelValue;return[q(i,e.format),q(r,e.format)]}else return q(e.modelValue,e.format)},set(i){Array.isArray(i)?c("update:modelValue",[te("HH:mm:ss",i[0]),te("HH:mm:ss",i[1])]):c("update:modelValue",te("HH:mm:ss",i))}}),w=v(()=>e.minTime?q(e.minTime):null),M=v(()=>e.maxTime?q(e.maxTime):null),A=v(()=>!w.value||!M.value?!0:G(w.value,M.value)<=0),N=v(()=>P.value==="out-of-range"||e.range&&T.value==="out-of-range"?"out-of-range":P.value==="invalid"||e.range&&T.value==="invalid"?"invalid":"valid"),C=v(()=>(e.disabledTimes??[]).map(r=>{const m=Array.isArray(r)?r:[r,r],L=q(m[0]),H=q(m[1]);return G(L,H)<=0?[L,H]:[H,L]}));function Q(i){return!!(Ae(i,C.value)||e.isTimeDisabled?.(i))}function K(i){return i==="first"?Array.isArray(p.value)?p.value[0]:p.value:Array.isArray(p.value)?p.value[1]:p.value}function E(i,r){if(i==="first"){Array.isArray(p.value)?p.value=[r,p.value[1]]:p.value=r;return}Array.isArray(p.value)&&(p.value=[p.value[0],r])}function $(i,r,m,L){if(i==="first"?P.value=r:T.value=r,c("validate",{target:i,state:r,reason:m,value:L?te("HH:mm:ss",L):null}),r==="valid"){o.value=null;return}if(r==="out-of-range"){o.value="OUT_OF_RANGE",c("error",{code:"OUT_OF_RANGE",message:"Time is outside min/max bounds and was clamped."});return}o.value=m??"BAD_TIME",c("error",{code:m??"BAD_TIME",message:m==="DISABLED"?"Time is disabled by disabledTimes or isTimeDisabled.":"Time is invalid."})}z(N,i=>{c("update:validationState",i)},{immediate:!0});const F=v(()=>A.value?w.value:null),s=v(()=>A.value?M.value:null);function d(i){return Ee(i,F.value,s.value)}function u(i,r,m){const L=!Me(r,F.value,s.value),H=d(r);return Q(H)?(m.emitValidation&&$(i,"invalid","DISABLED",H),!1):(E(i,H),m.emitValidation&&(L?$(i,"out-of-range","OUT_OF_RANGE",H):$(i,"valid",void 0,H)),!0)}const f=v({get(){return Array.isArray(p.value)?p.value[0]:p.value},set(i){u("first",i,{emitValidation:!0})}}),g=v({get(){return Array.isArray(p.value)?p.value[1]:p.value},set(i){Array.isArray(p.value)&&u("second",i,{emitValidation:!0})}});v(()=>{if(!e.modelValue)return"—";const i=r=>te(e.format,r);return e.range?`${i(f.value)} → ${i(g.value)}`:i(f.value)}),z(()=>e.range,i=>{if(i){if(!Array.isArray(e.modelValue))throw new RangeError(`Model value must be an array for range selection: ${e.modelValue}`)}else if(Array.isArray(e.modelValue))throw new RangeError(`Model value must be a single string for single time selection: ${e.modelValue}`)},{immediate:!0}),z(()=>[F.value,s.value,e.range],()=>{u("first",K("first"),{emitValidation:!0}),e.range&&u("second",K("second"),{emitValidation:!0})},{immediate:!0}),z(()=>[C.value,e.isTimeDisabled,e.range],()=>{u("first",K("first"),{emitValidation:!0}),e.range&&u("second",K("second"),{emitValidation:!0})},{immediate:!0});const h=v(()=>e.format??"HH:mm:ss"),B=v(()=>{let i=h.value.length;return/[AaPp]$/.test(h.value)&&(i+=1),`${Math.min(12,Math.max(4,i))}ch`}),V=Se(h),ee=V.inputValue,_=Se(h),ie=_.inputValue;z(()=>[f.value,h.value],([i])=>{V.setFromTime(i)},{immediate:!0}),z(()=>[g.value,h.value,e.range],([i,,r])=>{if(!r){_.setFromTime({h:0,m:0,s:0});return}_.setFromTime(i)},{immediate:!0});const X=x(null);function ne(i){if(e.disabled)return;if(i.key==="Enter"){i.preventDefault(),U("first");return}/^\d$/.test(i.key)&&(l.value=!1,y.value=!1);const r=i.target,m=V.displayPosToDigitIndex(r.selectionStart??0),L=/^\d$/.test(i.key)&&m>=V.totalDigits.value-1;if(V.handleKeydown(i),/^\d$/.test(i.key)){const H=V.getParsedTime();H&&u("first",H,{emitValidation:!1})}e.range&&L&&X.value&&(U("first"),xe(()=>{const H=X.value;H&&(H.focus(),H.selectionStart=H.selectionEnd=0)}))}function de(i){if(!e.disabled){if(i.key==="Enter"){i.preventDefault(),U("second");return}if(/^\d$/.test(i.key)&&(l.value=!1,y.value=!1),_.handleKeydown(i),/^\d$/.test(i.key)){const r=_.getParsedTime();r&&u("second",r,{emitValidation:!1})}}}function U(i){const m=(i==="first"?V:_).getParsedTime();m?u(i,m,{emitValidation:!0}):$(i,"invalid","BAD_TIME"),i==="first"?V.setFromTime(f.value):e.range&&_.setFromTime(g.value)}return(i,r)=>(R(),J("div",{class:"timepicker-shell","data-size":e.size,"data-validation":N.value,"data-disabled":e.disabled?"true":"false"},[e.range?(R(),J("div",{key:1,class:ce(["timepicker-shell__input",{"timepicker-shell__input--error":o.value,"timepicker-shell__input--disabled":e.disabled}])},[Z("input",{type:"text",class:"timepicker-field",value:D(ee),placeholder:h.value,style:pe({width:B.value}),disabled:e.disabled,onFocus:r[4]||(r[4]=m=>!e.disabled&&(l.value=!0)),onKeydown:ne,onInput:r[5]||(r[5]=(...m)=>D(V).handleInput&&D(V).handleInput(...m)),onPaste:r[6]||(r[6]=(...m)=>D(V).handlePaste&&D(V).handlePaste(...m)),onBlur:r[7]||(r[7]=m=>!e.disabled&&U("first"))},null,44,Ue),r[16]||(r[16]=Z("span",{class:"timepicker-separator"},"–",-1)),Z("input",{ref_key:"secondInputRef",ref:X,type:"text",class:"timepicker-field",value:D(ie),placeholder:h.value,style:pe({width:B.value}),disabled:e.disabled,onFocus:r[8]||(r[8]=m=>!e.disabled&&(y.value=!0)),onKeydown:de,onInput:r[9]||(r[9]=(...m)=>D(_).handleInput&&D(_).handleInput(...m)),onPaste:r[10]||(r[10]=(...m)=>D(_).handlePaste&&D(_).handlePaste(...m)),onBlur:r[11]||(r[11]=m=>!e.disabled&&U("second"))},null,44,Oe)],2)):(R(),J("div",{key:0,class:ce(["timepicker-shell__input",{"timepicker-shell__input--error":o.value,"timepicker-shell__input--disabled":e.disabled}])},[Z("input",{type:"text",class:"timepicker-field",value:D(ee),placeholder:h.value,style:pe({width:B.value}),disabled:e.disabled,onFocus:r[0]||(r[0]=m=>!e.disabled&&(l.value=!0)),onKeydown:ne,onInput:r[1]||(r[1]=(...m)=>D(V).handleInput&&D(V).handleInput(...m)),onPaste:r[2]||(r[2]=(...m)=>D(V).handlePaste&&D(V).handlePaste(...m)),onBlur:r[3]||(r[3]=m=>!e.disabled&&U("first"))},null,44,Ke)],2)),Z("div",null,[ve(ae,{open:l.value,"onUpdate:open":r[12]||(r[12]=m=>l.value=m),initTime:f.value,"onUpdate:initTime":r[13]||(r[13]=m=>f.value=m),format:e.format,"hour-step":e.hourStep,"minute-step":e.minuteStep,"second-step":e.secondStep,"min-time":F.value,"max-time":s.value,"disabled-ranges":C.value,"is-time-disabled":e.isTimeDisabled},null,8,["open","initTime","format","hour-step","minute-step","second-step","min-time","max-time","disabled-ranges","is-time-disabled"]),e.range?(R(),fe(ae,{key:0,open:y.value,"onUpdate:open":r[14]||(r[14]=m=>y.value=m),initTime:g.value,"onUpdate:initTime":r[15]||(r[15]=m=>g.value=m),format:e.format,"hour-step":e.hourStep,"minute-step":e.minuteStep,"second-step":e.secondStep,"min-time":F.value,"max-time":s.value,"disabled-ranges":C.value,"is-time-disabled":e.isTimeDisabled},null,8,["open","initTime","format","hour-step","minute-step","second-step","min-time","max-time","disabled-ranges","is-time-disabled"])):le("",!0)])],8,Re))}});O.__docgenInfo=Object.assign({displayName:O.name??O.__name},{exportName:"default",displayName:"TimePicker",description:"",tags:{},events:[{name:"update:modelValue",type:{names:["union"],elements:[{name:"string"},{name:"tuple",elements:[{name:"string"},{name:"string"}]},{name:"null"}]}},{name:"update:validationState",type:{names:["ValidationState"]}},{name:"validate",type:{names:[`{
    target: "first" | "second";
    state: ValidationState;
    reason?: ValidationReason;
    value: string | null;
}`]}},{name:"open"},{name:"close"},{name:"error",type:{names:[`{
    code: ValidationReason;
    message: string;
}`]}}],sourceFiles:["/Users/manossavvides/programming/vue-timepicker/src/TimePicker/TimePicker.vue"]});const je={title:"Components/TimePicker",component:O,tags:["autodocs"],args:{format:"HH:mm:ss",range:!1,size:"md",disabled:!1,hourStep:1,minuteStep:1,secondStep:1,minTime:void 0,maxTime:void 0,disabledTimes:void 0},argTypes:{modelValue:{table:{disable:!0}},isTimeDisabled:{table:{disable:!0}},onValidate:{action:"validate"},onError:{action:"error"},"onUpdate:validationState":{action:"update:validationState"}},render:t=>({components:{TimePicker:O},setup(){const n=x("12:30:00"),o=x(["09:00:00","17:00:00"]),e=v(()=>t.range?JSON.stringify(o.value):n.value),c=x("valid");return{args:t,single:n,range:o,valueLabel:e,validationState:c}},template:`
      <div style="min-width: 420px; padding: 12px;">
        <TimePicker
          v-if="!args.range"
          v-bind="args"
          v-model="single"
          v-model:validationState="validationState"
        />
        <TimePicker
          v-else
          v-bind="args"
          v-model="range"
          v-model:validationState="validationState"
        />

        <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.8;">Value: {{ valueLabel }}</p>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Validation: {{ validationState }}</p>
      </div>
    `})},oe={render:t=>({components:{TimePicker:O},setup(){const n=x("12:30:00"),o=x(["09:00:00","17:00:00"]),e=v(()=>t.range?JSON.stringify(o.value):n.value),c=x("valid");return{args:t,single:n,range:o,valueLabel:e,validationState:c}},template:`
      <div style="min-width: 420px; padding: 12px;">
        <div style="margin-bottom:10px;padding:10px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;">How to use Playground</p>
          <p style="margin:0;font-size:12px;opacity:.85;line-height:1.4;">
            Use the Controls panel to change props (format, range, size, steps, min/max, disabled rules).
            Interact with the picker below and inspect validation/events in the Actions panel.
          </p>
        </div>

        <TimePicker
          v-if="!args.range"
          v-bind="args"
          v-model="single"
          v-model:validationState="validationState"
        />
        <TimePicker
          v-else
          v-bind="args"
          v-model="range"
          v-model:validationState="validationState"
        />

        <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.8;">Value: {{ valueLabel }}</p>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Validation: {{ validationState }}</p>
      </div>
    `})},re={render:()=>({components:{TimePicker:O},setup(){const t=x("12:30:00"),n=x("08:45:00"),o=x("23:00:00"),e=x("10:00:00"),c=x("09:00:00"),l=x("09:15:00"),y=x("16:30:00"),P=x(["09:30:00","17:00:00"]),T=x("valid");return{time24:t,time12:n,timeK:o,stepped:e,constrained:c,callbackBlocked:l,disabledValue:y,range:P,validationState:T,isDisabled:p=>p.m===45||p.h>=11&&p.h<=12}},template:`
      <div style="display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:12px;min-width:700px;padding:12px;">
        <div style="grid-column:1 / -1;padding:12px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;">How to use this playground</p>
          <p style="margin:0;font-size:12px;line-height:1.45;opacity:.85;">
            Try typing directly in each picker and open dropdowns to select values. Compare formats (24h/12h/k), test constraints
            (minTime/maxTime), blocked ranges (disabledTimes), callback rules, disabled mode, and range behavior.
            Check Storybook actions/events to inspect validation updates.
          </p>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">24h + seconds</p><TimePicker v-model="time24" format="HH:mm:ss" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">12h format</p><TimePicker v-model="time12" format="hh:mm:ss A" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">k-format (1-24)</p><TimePicker v-model="timeK" format="kk:mm" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Step intervals</p><TimePicker v-model="stepped" format="HH:mm:ss" :hour-step="2" :minute-step="15" :second-step="10" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Min/Max + disabledTimes</p><TimePicker v-model="constrained" format="HH:mm" minTime="09:00:00" maxTime="18:00:00" :disabled-times="[['12:00:00','13:00:00'], ['15:30:00','16:00:00']]" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Callback disabled rule</p><TimePicker v-model="callbackBlocked" format="HH:mm" :is-time-disabled="isDisabled" v-model:validationState="validationState" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Disabled state</p><TimePicker v-model="disabledValue" format="HH:mm:ss" :disabled="true" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Range + validation</p><TimePicker v-model="range" :range="true" format="HH:mm" :minute-step="15" v-model:validationState="validationState" /></div>
      </div>
    `})},se={render:()=>({components:{TimePicker:O},setup(){const t=x("08:30:00"),n=x("19:45:00"),o=x("10:15:00"),e=x("14:20:00"),c=x("21:05:00");return{light:t,dark:n,mint:o,rose:e,mono:c}},template:`
      <div style="display: grid; gap: 16px; min-width: 520px; padding: 12px;">
        <div
          style="padding: 12px; border-radius: 10px; background: #fff7ed; --vtp-bg: #fff7ed; --vtp-color: #7c2d12; --vtp-border: #fb923c; --vtp-focus-border: #f97316; --vtp-option-active-bg: #f97316; --vtp-option-active-color: #fff7ed;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Warm Theme</p>
          <TimePicker v-model="light" format="hh:mm A" size="lg" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #0f172a; color: #e2e8f0; --vtp-bg: #0f172a; --vtp-color: #e2e8f0; --vtp-border: #334155; --vtp-focus-border: #38bdf8; --vtp-dropdown-bg: #0b1220; --vtp-dropdown-border: #1e293b; --vtp-option-hover-bg: #1e293b; --vtp-option-active-bg: #38bdf8; --vtp-option-active-color: #082f49;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.85;">Night Theme</p>
          <TimePicker v-model="dark" format="HH:mm:ss" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #ecfdf5; --vtp-bg: #ecfdf5; --vtp-color: #065f46; --vtp-border: #34d399; --vtp-focus-border: #10b981; --vtp-dropdown-bg: #f0fdf4; --vtp-option-hover-bg: #d1fae5; --vtp-option-active-bg: #10b981; --vtp-option-active-color: #ecfdf5;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Mint Theme</p>
          <TimePicker v-model="mint" format="HH:mm" size="sm" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #fff1f2; --vtp-bg: #fff1f2; --vtp-color: #881337; --vtp-border: #fb7185; --vtp-focus-border: #f43f5e; --vtp-dropdown-bg: #ffe4e6; --vtp-option-hover-bg: #fecdd3; --vtp-option-active-bg: #f43f5e; --vtp-option-active-color: #fff1f2;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Rose Theme</p>
          <TimePicker v-model="rose" format="hh:mm A" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #f8fafc; --vtp-font-family: 'Roboto Mono', monospace; --vtp-bg: #f8fafc; --vtp-color: #0f172a; --vtp-border: #cbd5e1; --vtp-focus-border: #64748b; --vtp-dropdown-bg: #ffffff; --vtp-option-hover-bg: #e2e8f0; --vtp-option-active-bg: #334155; --vtp-option-active-color: #f8fafc;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Monochrome Theme</p>
          <TimePicker v-model="mono" format="kk:mm" size="xs" />
        </div>
      </div>
    `})};oe.parameters={...oe.parameters,docs:{...oe.parameters?.docs,source:{originalSource:`{
  render: args => ({
    components: {
      TimePicker
    },
    setup() {
      const single = ref("12:30:00");
      const range = ref<[string, string]>(["09:00:00", "17:00:00"]);
      const valueLabel = computed(() => args.range ? JSON.stringify(range.value) : single.value);
      const validationState = ref<"valid" | "invalid" | "out-of-range">("valid");
      return {
        args,
        single,
        range,
        valueLabel,
        validationState
      };
    },
    template: \`
      <div style="min-width: 420px; padding: 12px;">
        <div style="margin-bottom:10px;padding:10px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;">How to use Playground</p>
          <p style="margin:0;font-size:12px;opacity:.85;line-height:1.4;">
            Use the Controls panel to change props (format, range, size, steps, min/max, disabled rules).
            Interact with the picker below and inspect validation/events in the Actions panel.
          </p>
        </div>

        <TimePicker
          v-if="!args.range"
          v-bind="args"
          v-model="single"
          v-model:validationState="validationState"
        />
        <TimePicker
          v-else
          v-bind="args"
          v-model="range"
          v-model:validationState="validationState"
        />

        <p style="margin: 12px 0 0; font-size: 12px; opacity: 0.8;">Value: {{ valueLabel }}</p>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Validation: {{ validationState }}</p>
      </div>
    \`
  })
}`,...oe.parameters?.docs?.source}}};re.parameters={...re.parameters,docs:{...re.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      TimePicker
    },
    setup() {
      const time24 = ref("12:30:00");
      const time12 = ref("08:45:00");
      const timeK = ref("23:00:00");
      const stepped = ref("10:00:00");
      const constrained = ref("09:00:00");
      const callbackBlocked = ref("09:15:00");
      const disabledValue = ref("16:30:00");
      const range = ref<[string, string]>(["09:30:00", "17:00:00"]);
      const validationState = ref<"valid" | "invalid" | "out-of-range">("valid");
      return {
        time24,
        time12,
        timeK,
        stepped,
        constrained,
        callbackBlocked,
        disabledValue,
        range,
        validationState,
        isDisabled: (value: {
          h: number;
          m: number;
        }) => value.m === 45 || value.h >= 11 && value.h <= 12
      };
    },
    template: \`
      <div style="display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:12px;min-width:700px;padding:12px;">
        <div style="grid-column:1 / -1;padding:12px;border:1px dashed #cbd5e1;border-radius:8px;background:#f8fafc;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;">How to use this playground</p>
          <p style="margin:0;font-size:12px;line-height:1.45;opacity:.85;">
            Try typing directly in each picker and open dropdowns to select values. Compare formats (24h/12h/k), test constraints
            (minTime/maxTime), blocked ranges (disabledTimes), callback rules, disabled mode, and range behavior.
            Check Storybook actions/events to inspect validation updates.
          </p>
        </div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">24h + seconds</p><TimePicker v-model="time24" format="HH:mm:ss" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">12h format</p><TimePicker v-model="time12" format="hh:mm:ss A" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">k-format (1-24)</p><TimePicker v-model="timeK" format="kk:mm" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Step intervals</p><TimePicker v-model="stepped" format="HH:mm:ss" :hour-step="2" :minute-step="15" :second-step="10" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Min/Max + disabledTimes</p><TimePicker v-model="constrained" format="HH:mm" minTime="09:00:00" maxTime="18:00:00" :disabled-times="[['12:00:00','13:00:00'], ['15:30:00','16:00:00']]" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Callback disabled rule</p><TimePicker v-model="callbackBlocked" format="HH:mm" :is-time-disabled="isDisabled" v-model:validationState="validationState" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Disabled state</p><TimePicker v-model="disabledValue" format="HH:mm:ss" :disabled="true" /></div>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"><p style="margin:0 0 8px;font-size:12px;opacity:.75;">Range + validation</p><TimePicker v-model="range" :range="true" format="HH:mm" :minute-step="15" v-model:validationState="validationState" /></div>
      </div>
    \`
  })
}`,...re.parameters?.docs?.source}}};se.parameters={...se.parameters,docs:{...se.parameters?.docs,source:{originalSource:`{
  render: () => ({
    components: {
      TimePicker
    },
    setup() {
      const light = ref("08:30:00");
      const dark = ref("19:45:00");
      const mint = ref("10:15:00");
      const rose = ref("14:20:00");
      const mono = ref("21:05:00");
      return {
        light,
        dark,
        mint,
        rose,
        mono
      };
    },
    template: \`
      <div style="display: grid; gap: 16px; min-width: 520px; padding: 12px;">
        <div
          style="padding: 12px; border-radius: 10px; background: #fff7ed; --vtp-bg: #fff7ed; --vtp-color: #7c2d12; --vtp-border: #fb923c; --vtp-focus-border: #f97316; --vtp-option-active-bg: #f97316; --vtp-option-active-color: #fff7ed;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Warm Theme</p>
          <TimePicker v-model="light" format="hh:mm A" size="lg" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #0f172a; color: #e2e8f0; --vtp-bg: #0f172a; --vtp-color: #e2e8f0; --vtp-border: #334155; --vtp-focus-border: #38bdf8; --vtp-dropdown-bg: #0b1220; --vtp-dropdown-border: #1e293b; --vtp-option-hover-bg: #1e293b; --vtp-option-active-bg: #38bdf8; --vtp-option-active-color: #082f49;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.85;">Night Theme</p>
          <TimePicker v-model="dark" format="HH:mm:ss" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #ecfdf5; --vtp-bg: #ecfdf5; --vtp-color: #065f46; --vtp-border: #34d399; --vtp-focus-border: #10b981; --vtp-dropdown-bg: #f0fdf4; --vtp-option-hover-bg: #d1fae5; --vtp-option-active-bg: #10b981; --vtp-option-active-color: #ecfdf5;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Mint Theme</p>
          <TimePicker v-model="mint" format="HH:mm" size="sm" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #fff1f2; --vtp-bg: #fff1f2; --vtp-color: #881337; --vtp-border: #fb7185; --vtp-focus-border: #f43f5e; --vtp-dropdown-bg: #ffe4e6; --vtp-option-hover-bg: #fecdd3; --vtp-option-active-bg: #f43f5e; --vtp-option-active-color: #fff1f2;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Rose Theme</p>
          <TimePicker v-model="rose" format="hh:mm A" size="md" />
        </div>

        <div
          style="padding: 12px; border-radius: 10px; background: #f8fafc; --vtp-font-family: 'Roboto Mono', monospace; --vtp-bg: #f8fafc; --vtp-color: #0f172a; --vtp-border: #cbd5e1; --vtp-focus-border: #64748b; --vtp-dropdown-bg: #ffffff; --vtp-option-hover-bg: #e2e8f0; --vtp-option-active-bg: #334155; --vtp-option-active-color: #f8fafc;"
        >
          <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.8;">Monochrome Theme</p>
          <TimePicker v-model="mono" format="kk:mm" size="xs" />
        </div>
      </div>
    \`
  })
}`,...se.parameters?.docs?.source}}};const We=["Playground","FeatureGallery","ThemedWithCssVariables"];export{re as FeatureGallery,oe as Playground,se as ThemedWithCssVariables,We as __namedExportsOrder,je as default};

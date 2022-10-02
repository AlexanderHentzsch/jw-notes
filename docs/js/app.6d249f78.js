(function(t){function e(e){for(var o,i,s=e[0],l=e[1],c=e[2],d=0,h=[];d<s.length;d++)i=s[d],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&h.push(r[i][0]),r[i]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(t[o]=l[o]);u&&u(e);while(h.length)h.shift()();return a.push.apply(a,c||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],o=!0,s=1;s<n.length;s++){var l=n[s];0!==r[l]&&(o=!1)}o&&(a.splice(e--,1),t=i(i.s=n[0]))}return t}var o={},r={app:0},a=[];function i(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=o,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/jw-notes/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var c=0;c<s.length;c++)e(s[c]);var u=l;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"141a":function(t,e,n){"use strict";n("5389")},1456:function(t,e,n){"use strict";n("5655")},5389:function(t,e,n){},5655:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);var o=n("f6b5"),r=n.n(o),a=n("e86e"),i=n.n(a),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{height:"100%"},on:{click:function(e){return t.clickDisplay()}}},[t._m(0)])},l=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"w3-display-container",staticStyle:{height:"100%"}},[n("div",{staticClass:"w3-display-middle"},[n("div",{staticClass:"w3-center"},[n("div",{staticClass:"theme-background fontRobotoCondensed",attrs:{id:"container-logo"}},[n("span",{attrs:{id:"logo"}},[t._v("JW")]),n("br"),n("span",{attrs:{id:"logo-sub"}},[t._v("Notes")])]),n("div",{attrs:{id:"container-hint"}},[t._v("\n                    Tippen um die Anwendung im Vollbildmodus zu starten.\n                ")])])]),n("div",{staticClass:"w3-display-bottomright"},[n("div",{staticClass:"w3-right-align fontRaleway",staticStyle:{"margin-right":"12px"}},[n("p",{attrs:{id:"copyright"}},[n("span",{staticClass:"w3-tiny"},[t._v("made by")]),n("br"),n("span",{staticClass:"w3-small"},[t._v("Alexander Hentzsch")]),n("br"),n("span",{staticClass:"w3-tiny"},[t._v("MIT License")])])])])])}],c={name:"Main",methods:{clickDisplay(){this.startVideo(),this.goToOverview()},startVideo(){let t=document.querySelector("#player");t.paused&&t.play()},goToOverview(){this.$router.push("/overview/notes/")}}},u=c,d=(n("e5f4"),n("2877")),h=Object(d["a"])(u,s,l,!1,null,"6af0df98",null),p=h.exports,m=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content"},[n("comp-header"),n("div",{staticClass:"w3-content w3-container"},[n("h1",[t._v("Optionen")]),n("div",[n("p",{style:{fontSize:t.selectedFontSize+"px",textAlign:"right"}},[t._v("Schriftgröße:\n                "+t._s(t.selectedFontSize)+"px")]),n("input",{directives:[{name:"model",rawName:"v-model",value:t.fontSize,expression:"fontSize"}],staticClass:"slider",attrs:{type:"range",min:"0",max:t.possibleTextHeight.length-1,id:"fontSizeRange"},domProps:{value:t.fontSize},on:{change:function(e){return t.saveOptions()},__r:function(e){t.fontSize=e.target.value}}})]),n("div",[n("h2",[t._v("Download")]),n("a",{staticClass:"w3-button w3-teal",attrs:{href:t.downloadJson,download:t.fileNameDownload}},[t._v("Download JSON")]),n("h3",{staticStyle:{"margin-top":"32px"}},[t._v("Inhalt")]),n("div",{staticStyle:{"margin-top":"12px"}},[n("textarea",{staticStyle:{width:"100%",height:"300px","background-color":"black",color:"#fff","font-family":"'Consolas', 'monospace'"},domProps:{value:t.json}})]),n("h2",{staticStyle:{"margin-top":"64px"}},[t._v("Lizenz")]),t._m(0),n("h2",{staticStyle:{"margin-top":"48px"}},[t._v("Third-party libraries")]),t._m(1)])]),n("div",{attrs:{id:"container-github"}},[n("a",{attrs:{href:t.hrefGitHub,id:"a-github",target:"_blank"}},[t._v("\n            Projekt auf "),t._m(2)])])],1)},v=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[n("a",{attrs:{href:"https://github.com/BillAlex-BASoftware/jw-notes/blob/master/LICENSE",target:"_blank"}},[t._v("\n                    JW Notes - The MIT License (MIT)\n                ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[n("a",{attrs:{href:"https://github.com/vuejs/vue/blob/dev/LICENSE",target:"_blank"}},[t._v("\n                    Vue.js - The MIT License (MIT)\n                ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{attrs:{id:"span-github"}},[t._v("GitHub "),n("i",{staticClass:"fab fa-github"})])}],f=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"header"}},[n("div",{staticClass:"w3-row theme-color",staticStyle:{height:"100%"}},[n("div",{staticClass:"container-btn w3-col w3-left"},[n("button",{staticClass:"w3-btn w3-hover-none",on:{click:function(e){return t.goBack(-1)}}},[n("i",{staticClass:"fas fa-angle-left"})])]),n("div",{staticClass:"container-btn w3-col w3-right"},[n("router-link",{staticClass:"w3-btn w3-hover-none",attrs:{to:"/options"}},[n("i",{staticClass:"fas fa-cog",staticStyle:{position:"relative",top:"9px"}})])],1),t._m(0)])])},g=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"w3-rest",staticStyle:{height:"55px"}},[n("button",{staticClass:"w3-btn w3-hover-none fontRobotoCondensed",staticStyle:{"padding-left":"0","text-align":"left"}},[t._v("\n                JW Notes\n            ")])])}],w={name:"CompHeader",computed:{domApp(){return document.querySelector("#app")}},methods:{goBack(){const t=this.$route.name;let e;switch(t){case"Options":return this.$router.go(-1);case"OverviewNotes":case"OverviewPrograms":e="/";break;case"Program":e="/overview/programs/"+this.$route.params.idProgram;break;case"EditorNotes":e="/overview/notes";break;case"OverviewProgramsNotes":case"EditorProgram":e="/overview/programs";break;default:e="/overview/notes"}this.$router.push(e)}}},b=w,x=(n("e3ab"),Object(d["a"])(b,f,g,!1,null,"c624b828",null)),y=x.exports,_={name:"Options",components:{CompHeader:y},data(){return{fontSize:6,localStorageKey:"options",hrefGitHub:"https://github.com/BillAlex-BASoftware/jw-notes"}},computed:{possibleTextHeight(){return[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72]},selectedFontSize(){return this.possibleTextHeight[this.fontSize]},jsonDB(){return window.jsonDB},fileNameDownload(){const t=function(t){return t.toString().padStart(2,"0")};let e=new Date,n=[e.getFullYear(),t(e.getMonth()+1),t(e.getDate()),t(e.getHours()),t(e.getMinutes()),t(e.getSeconds())].join("");return"jw-notes-"+n+".json"},downloadJson(){let t=localStorage.getItem("DB");return"data:text/json;charset=utf-8,"+encodeURIComponent(t)},json(){return localStorage.getItem("DB")}},mounted(){this.loadOptions()},methods:{saveOptions(){let t={fontSize:this.selectedFontSize},e=this.localStorageKey;localStorage.setItem(e,JSON.stringify(t))},loadOptions(){let t=localStorage.getItem(this.localStorageKey);void 0!==t&&null!==t&&(t=JSON.parse(t),this.fontSize=this.possibleTextHeight.indexOf(t.fontSize))}}},S=_,C=(n("141a"),Object(d["a"])(S,m,v,!1,null,"d2af5462",null)),k=C.exports,O=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content"},[n("comp-header"),n("comp-tabs-overview"),n("div",{staticClass:"w3-content w3-container"},[n("div",{staticClass:"w3-center",staticStyle:{"padding-top":"24px"}},[n("router-link",{staticClass:"w3-block w3-btn theme-background",attrs:{to:"/editor/notes/new"}},[t._v("Neue Mitschrift")])],1),n("div",t._l(t.jsonDBLocalReverse,(function(e,o){return n("router-link",{staticClass:"font-note-title w3-large w3-btn w3-hover-none w3-left-align",staticStyle:{display:"block"},attrs:{to:"/editor/notes/"+t.getReversedPos(o)}},[t._v("\n                "+t._s(e.title)+"\n            ")])})),1)])],1)},j=[],$=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content"},[n("router-link",{staticClass:"router-link w3-btn w3-hover-none",attrs:{to:"/overview/notes/"}},[t._v("Notizen")]),n("router-link",{staticClass:"router-link w3-btn w3-hover-none",attrs:{to:"/overview/programs/"}},[t._v("Programme")])],1)},D=[],I={name:"compTabsOverview"},N=I,T=Object(d["a"])(N,$,D,!1,null,"ea569da6",null),B=T.exports,E={name:"Overview_Notes",components:{CompTabsOverview:B,CompHeader:y},data(){return{jsonDBLocal:[]}},mounted(){this.loadFromLocalStorage()},computed:{jsonDB(){return window.jsonDB},jsonDBLocalReverse(){let t=JSON.parse(JSON.stringify(this.jsonDBLocal));return t.reverse()}},methods:{getReversedPos(t){let e=this.jsonDBLocal.length-1;return e-t+1},getSavedDateStringReadable(t){let e=t.split("-");return`${e[2]}.${e[1]}.${e[0]}`},loadFromLocalStorage(){const t=JSON.parse(localStorage.getItem("DB"));void 0!==t&&null!==t&&(jsonDB=t,this.jsonDBLocal=jsonDB)}}},H=E,P=Object(d["a"])(H,O,j,!1,null,null,null),z=P.exports,L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content"},[n("comp-header"),n("comp-tabs-overview"),n("h1",[t._v("Overview_Programms")])],1)},M=[],J={name:"OverviewProgramms",components:{CompTabsOverview:B,CompHeader:y}},q=J,K=Object(d["a"])(q,L,M,!1,null,"9d0c8638",null),R=K.exports,W=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content"},[n("comp-header"),n("comp-tabs-overview"),n("h1",[t._v("Overview_Programms_Notes")])],1)},A=[],F={name:"Overview_Programms_Notes",components:{CompTabsOverview:B,CompHeader:y}},V=F,G=Object(d["a"])(V,W,A,!1,null,"0532abce",null),U=G.exports,Y=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},Q=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h1",[t._v("Programm")])])}],X={name:"Programm"},Z=X,tt=Object(d["a"])(Z,Y,Q,!1,null,"7c7198b5",null),et=tt.exports,nt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-content fontRaleway",attrs:{id:"Editor"}},[n("comp-header"),n("div",{staticClass:"w3-container container-theme"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],staticClass:"font-note-title note-inputs",attrs:{id:"title"},domProps:{value:t.title},on:{input:function(e){e.target.composing||(t.title=e.target.value)}}}),n("label",{attrs:{id:"label-title",for:"title"}},[""===t.title?[t._v("Titel")]:t._e(),""!==t.title?[t._v(t._s(t.getDate("day&time",t.date)))]:t._e()],2)]),n("div",{staticClass:"container-notes w3-row",staticStyle:{margin:"24px 24px",height:"100%"}},t._l(t.notes,(function(e,o){return n("div",{staticClass:"w3-col m12",style:{fontSize:t.options.fontSize+"px"}},[n("div",{staticClass:"val-content w3-col s12",on:{click:function(e){return t.edit(o)}}},["@"!==e[0]?n("span",[t._v(t._s(t.getValue(e)))]):t._e(),"@"===e[0]?n("span",[n("a",{attrs:{href:t.getLinkToWOL(e),target:"_blank"}},[t._v(t._s(t.getValue(e)))])]):t._e()])])})),0),n("div",{staticClass:"container-margin-bottom-safari",staticStyle:{background:"transparent"},style:t.styleMarginBottom},[t._v(" \n    ")]),n("div",{staticClass:"container-input",staticStyle:{position:"fixed",bottom:"0",left:"0",padding:"8px",width:"100%","background-color":"#000"}},[n("div",{staticClass:"w3-row",attrs:{id:"toolbox"}},[n("div",{staticClass:"w3-left w3-rest container-special-btn",style:{width:t.widthContainerSpecialBtn+"px"}},[n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.addEmoji("star")}}},[t._v("⭐")]),n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.addEmoji("questionMark")}}},[t._v("❓")]),n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.addEmoji("video")}}},[t._v("🎥")])]),n("div",{staticClass:"w3-col w3-right",style:{width:t.widthContainerStandardBtn+"px"}},[t.routerHasIndex?n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.deleteIndex()}}},[n("i",{staticClass:"far fa-trash-alt"})]):t._e(),t.routerHasIndex?n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.abortEdit()}}},[n("i",{staticClass:"far fa-times-circle"})]):t._e(),n("button",{staticClass:"w3-btn w3-hover-none editor-btn",on:{click:function(e){return t.textareaToNotes()}}},[n("i",{staticClass:"fas fa-level-up-alt"})])])]),n("div",{staticClass:"w3-container",attrs:{id:"container-textarea"}},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.form.current.text,expression:"form.current.text"}],staticClass:"note-inputs",style:{resize:"none",height:t.textareaHeight+"px"},domProps:{value:t.form.current.text},on:{keyup:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:e.ctrlKey?(e.preventDefault(),t.textareaToNotes()):null},function(e){return!e.type.indexOf("key")&&91!==e.keyCode&&t._k(e.keyCode,"enter",13,e.key,"Enter")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:(e.preventDefault(),t.textareaToNotes())},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.abortEdit()},function(e){return t.setTextareaHeight()}],input:function(e){e.target.composing||t.$set(t.form.current,"text",e.target.value)}}})])]),n("div",{staticClass:"w3-container note-inputs",style:{position:"fixed",visibility:"hidden",width:t.textareaWidth+"px"},attrs:{id:"container-textarea-height"}},[t._v("\n        "+t._s(t.form.current.text)+"\n    ")])],1)},ot=[],rt={name:"Editor",components:{CompHeader:y},data(){return{title:"",date:"",notes:[],form:{current:{text:""}},options:{fontSize:12},textareaHeight:32,defaultTextareaHeight:32}},computed:{styleMarginBottom(){const t=window.innerHeight;return{height:(t<300?300:t-200)+"px"}},jsonDB(){return window.jsonDB},currentId(){const t=this.$route.params.idNotes;return"new"===t?"new":parseInt(t)-1},routerHasIndex(){return!(void 0===this.$route.params.index)},documentWidth(){return document.getElementsByTagName("html")[0].clientWidth-16},widthContainerSpecialBtn(){let t=this.routerHasIndex?3:1,e=50*t;return this.documentWidth-e},widthContainerStandardBtn(){let t=this.routerHasIndex?3:1;return 50*t},textareaWidth(){let t=document.querySelector("textarea");return null===t?300:t.offsetWidth}},mounted:function(){let t=this.currentId;if("new"===t)this.createNewNotesArray(),document.querySelector("#title").focus();else{if(void 0===this.jsonDB[t])return this.$router.push("/");document.querySelector("textarea").focus()}this.setDefaults(),this.loadFontSize()},watch:{"$route.params.index":function(){this.changeTextareaContent()},title:function(){this.jsonDB[this.currentId].title=""===this.title?this.getDate("day"):this.title,this.saveInLocalStorage()},notes:function(){this.jsonDB[this.currentId].notes=this.notes},date:function(){this.jsonDB[this.currentId].date=this.date,this.saveInLocalStorage()}},methods:{loadFontSize(){let t=localStorage.getItem("options");void 0!==t&&null!==t&&(t=JSON.parse(t),t.hasOwnProperty("fontSize")&&(this.options.fontSize=t.fontSize))},getDate(t,e=new Date){const n=t=>t.toString().padStart(2,"0");"object"!==typeof e&&(e=new Date(e));let o=e.getTime(),r=n(e.getDate()),a=n(e.getMonth()+1),i=e.getFullYear(),s=n(e.getHours()),l=n(e.getMinutes()),c=n(e.getSeconds());switch(t){case"unix":return o;case"day&time":return`${r}.${a}.${i} ${s}:${l}:${c}`;case"day":default:return`${r}.${a}.${i}`}},setDefaults(){const t=this.jsonDB[this.currentId];this.title=void 0===t.title?this.getDate("day"):t.title,this.date=void 0===t.date?this.getDate("unix"):t.date,this.notes=void 0===t.notes?[]:t.notes},createNewNotesArray(){this.jsonDB.push({}),this.$router.push("/editor/notes/"+this.jsonDB.length)},saveInLocalStorage(){localStorage.setItem("DB",JSON.stringify(this.jsonDB))},changeTextareaContent(){let t=this.$route.params.index;void 0!==t&&(t=parseInt(t),this.form.current.text=this.notes[t])},addEmoji(t){let e="";switch(t){case"star":e="⭐";break;case"questionMark":e="❓";break;case"video":e="🎥";break;default:e=""}this.form.current.text=e+" "+this.form.current.text,document.querySelector("textarea").focus()},textareaToNotes(){this.date=this.getDate("unix");let t=this.form.current.text.trim(),e=this.$route.params.idNotes,n=this.$route.params.index,o=/[0-9]:[0-9]/,r=null!==t.match(o),a="@"===t[0];r&&!a&&(t="@"+t),this.form.current.text="",""!==t?void 0!==n?(n=parseInt(n),this.notes[n]=t,this.$router.push("/editor/notes/"+e)):this.notes.push(t):this.deleteIndex(),this.saveInLocalStorage(),document.querySelector("textarea").focus(),this.textareaHeight=parseInt(this.defaultTextareaHeight)},edit(t){if(t<0||t>=this.notes.length||t===parseInt(this.$route.params.index))return;let e=this.$route.params.idNotes;this.$router.push(`/editor/notes/${e}/${t}`),document.querySelector("textarea").focus(),this.textareaHeight=parseInt(this.defaultTextareaHeight)},abortEdit(){let t=this.$route.params.idNotes,e=this.$route.params.index;this.form.current.text="",this.textareaHeight=parseInt(this.defaultTextareaHeight),void 0!==e&&this.$router.push("/editor/notes/"+t)},deleteIndex(){let t=parseInt(this.$route.params.index);this.notes.splice(t,1),this.abortEdit()},getValue(t){let e=t[0];return"@"===e?t.substr(1):""===t?" ":t},getLinkToWOL(t){return t=this.getValue(t),"https://wol.jw.org/de/wol/l/r10/lp-x?q="+encodeURIComponent(t)},setTextareaHeight(){let t=document.querySelector("#container-textarea-height").offsetHeight;t>this.defaultTextareaHeight&&(this.textareaHeight=t)}}},at=rt,it=(n("1456"),Object(d["a"])(at,nt,ot,!1,null,"a3903d1a",null)),st=it.exports;const lt=[{path:"/",component:p,name:"Main"},{path:"/options",component:k,name:"Options"},{path:"/overview/notes",component:z,name:"OverviewNotes"},{path:"/overview/programs",component:R,name:"OverviewPrograms"},{path:"/overview/programs/:idProgram",component:U,name:"OverviewProgramsNotes"},{path:"/program/:idProgram",component:et,name:"Program"},{path:"/editor/notes/:idNotes/:index?",component:st,name:"EditorNotes"},{path:"/editor/program/:idProgram/:idProgramPoint/:index?",component:st,name:"EditorProgram"}];r.a.config.productionTip=!1,r.a.use(i.a),new r.a({router:new i.a({routes:lt}),el:"#app"})},"59d3":function(t,e,n){},"9ac0":function(t,e,n){},e3ab:function(t,e,n){"use strict";n("9ac0")},e5f4:function(t,e,n){"use strict";n("59d3")}});
//# sourceMappingURL=app.6d249f78.js.map
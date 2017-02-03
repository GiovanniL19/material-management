"use strict";define("material-management/app",["exports","ember","material-management/resolver","ember-load-initializers","material-management/config/environment"],function(e,t,a,n,r){var i=void 0;t.default.MODEL_FACTORY_INJECTIONS=!0,i=t.default.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:a.default}),(0,n.default)(i,r.default.modulePrefix),e.default=i}),define("material-management/components/app-version",["exports","ember-cli-app-version/components/app-version","material-management/config/environment"],function(e,t,a){var n=a.default.APP.name,r=a.default.APP.version;e.default=t.default.extend({version:r,name:n})}),define("material-management/components/fa-icon",["exports","ember-font-awesome/components/fa-icon"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("material-management/components/fa-list",["exports","ember-font-awesome/components/fa-list"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("material-management/components/fa-stack",["exports","ember-font-awesome/components/fa-stack"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("material-management/controllers/dashboard",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({})}),define("material-management/electron/browser-qunit-adapter",["exports"],function(e){!function(e){function t(e){var t=void 0,a=void 0,n=1,r={failed:0,passed:0,total:0,skipped:0,tests:[]};QUnit.log(function(e){var a={passed:e.result,message:e.message};e.result||(a.actual=e.actual,a.expected=e.expected),t.items.push(a)}),QUnit.testStart(function(r){t={id:n++,name:(a?a+": ":"")+r.name,items:[]},e.emit("tests-start")}),QUnit.testDone(function(a){t.failed=a.failed,t.passed=a.passed,t.total=a.total,r.total++,t.failed>0?r.failed++:r.passed++,r.tests.push(t),e.emit("test-result",t)}),QUnit.moduleStart(function(e){a=e.name}),QUnit.done(function(t){r.runDuration=t.runtime,e.emit("all-test-results",r)})}function a(a){var n=io(a);n.on("connect",function(){return n.emit("browser-login","Electron",1)}),n.on("start-tests",function(){n.disconnect(),e.location.reload()}),t(n)}e.ELECTRON&&e.addEventListener("load",function(){a(process.env.ELECTRON_TESTEM_SERVER_URL)})}(this)}),define("material-management/electron/reload",["exports"],function(e){!function(){if(window.ELECTRON){var e=window.requireNode("fs"),t=window.requireNode("path"),a=function(a){var n=__dirname||t.resolve(t.dirname()),r=!!window.QUnit;r&&(n=t.join(n,"..")),a&&(n=t.join(n,a)),e.watch(n,{recursive:!0},function(e){window.location.reload()})},n=function(){var e=window.requireNode("devtron");e&&e.install()},r=function(){var a=t.join("node_modules","ember-inspector","dist","chrome");e.lstat(a,function(e,t){if(!e&&t&&t.isDirectory&&t.isDirectory()){var n=window.requireNode("electron").remote.BrowserWindow;try{n.addDevToolsExtension(a)}catch(e){}}})};document.addEventListener("DOMContentLoaded",function(i){var o=__dirname||t.resolve(t.dirname());e.stat(o,function(e,t){e||(a(),"linux"===process.platform&&(a("/assets"),a("/tests")))}),n(),r()})}}()}),define("material-management/electron/tap-qunit-adapter",["exports"],function(e){!function(e){function t(e){console.log("[qunit-logger] "+e),process.stdout.write("[qunit-logger] "+e)}function a(){var e=0;QUnit.begin(function(e){e.totalTests>=1&&t("1.."+e.totalTests)}),QUnit.testDone(function(a){e++,0===a.failed&&t("ok "+e+" - "+a.module+" # "+a.name)}),QUnit.log(function(a){if(a.result!==!0){var n=e+1;t("not ok "+n+" - "+a.module+" - "+a.name),t("  ---"),t("  "+JSON.stringify(a)),t("  ...")}}),QUnit.done(function(e){t("# done"+(0===e.failed?"":" with errors"))})}e.ELECTRON&&e.addEventListener("load",a)}(this)}),define("material-management/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){e.default=t.default}),define("material-management/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){e.default=t.default}),define("material-management/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","material-management/config/environment"],function(e,t,a){e.default={name:"App Version",initialize:(0,t.default)(a.default.APP.name,a.default.APP.version)}}),define("material-management/initializers/container-debug-adapter",["exports","ember-resolver/container-debug-adapter"],function(e,t){e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0];e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("material-management/initializers/data-adapter",["exports","ember"],function(e,t){e.default={name:"data-adapter",before:"store",initialize:function(){}}}),define("material-management/initializers/ember-data",["exports","ember-data/setup-container","ember-data/-private/core"],function(e,t,a){e.default={name:"ember-data",initialize:t.default}}),define("material-management/initializers/export-application-global",["exports","ember","material-management/config/environment"],function(e,t,a){function n(){var e=arguments[1]||arguments[0];if(a.default.exportApplicationGlobal!==!1){var n;if("undefined"!=typeof window)n=window;else if("undefined"!=typeof global)n=global;else{if("undefined"==typeof self)return;n=self}var r,i=a.default.exportApplicationGlobal;r="string"==typeof i?i:t.default.String.classify(a.default.modulePrefix),n[r]||(n[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[r]}}))}}e.initialize=n,e.default={name:"export-application-global",initialize:n}}),define("material-management/initializers/injectStore",["exports","ember"],function(e,t){e.default={name:"injectStore",before:"store",initialize:function(){}}}),define("material-management/initializers/store",["exports","ember"],function(e,t){e.default={name:"store",after:"ember-data",initialize:function(){}}}),define("material-management/initializers/transforms",["exports","ember"],function(e,t){e.default={name:"transforms",before:"store",initialize:function(){}}}),define("material-management/instance-initializers/ember-data",["exports","ember-data/-private/instance-initializers/initialize-store-service"],function(e,t){e.default={name:"ember-data",initialize:t.default}}),define("material-management/resolver",["exports","ember-resolver"],function(e,t){e.default=t.default}),define("material-management/router",["exports","ember","material-management/config/environment"],function(e,t,a){var n=t.default.Router.extend({location:a.default.locationType,rootURL:a.default.rootURL});n.map(function(){this.route("dashboard")}),e.default=n}),define("material-management/routes/application",["exports","ember"],function(e,t){e.default=t.default.Route.extend({setupController:function(e){e.transitionToRoute("dashboard")}})}),define("material-management/routes/dashboard",["exports","ember"],function(e,t){e.default=t.default.Route.extend({})}),define("material-management/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("material-management/templates/application",["exports"],function(e){e.default=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@2.8.3",loc:{source:null,start:{line:1,column:0},end:{line:8,column:0}},moduleName:"material-management/templates/application.hbs"},isEmpty:!1,arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createElement("div");e.setAttribute(a,"class","col-md-2 menu");var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createTextNode("\n");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"class","col-md-10 content");var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createComment("");e.appendChild(a,n);var n=e.createTextNode("\n");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=new Array(2);return n[0]=e.createMorphAt(e.childAt(t,[0]),1,1),n[1]=e.createMorphAt(e.childAt(t,[2]),1,1),n},statements:[["inline","partial",["menu"],[],["loc",[null,[2,2],[2,20]]],0,0],["content","outlet",["loc",[null,[6,2],[6,12]]],0,0,0,0]],locals:[],templates:[]}}())}),define("material-management/templates/dashboard",["exports"],function(e){e.default=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@2.8.3",loc:{source:null,start:{line:1,column:0},end:{line:16,column:0}},moduleName:"material-management/templates/dashboard.hbs"},isEmpty:!1,arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createElement("div");e.setAttribute(a,"class","row card");var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createElement("div");e.setAttribute(n,"class","col-md-10 col-sm-12");var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("div");e.setAttribute(r,"class","input-group");var i=e.createTextNode("\n      ");e.appendChild(r,i);var i=e.createElement("input");e.setAttribute(i,"class","form-control"),e.setAttribute(i,"type","text"),e.setAttribute(i,"placeholder","Search stock, supplier or order..."),e.setAttribute(i,"aria-describedby","input"),e.appendChild(r,i);var i=e.createTextNode("\n      ");e.appendChild(r,i);var i=e.createElement("span");e.setAttribute(i,"class","input-group-addon"),e.setAttribute(i,"id","input");var o=e.createElement("button");e.setAttribute(o,"class","btn-search");var l=e.createComment("");e.appendChild(o,l),e.appendChild(i,o),e.appendChild(r,i);var i=e.createTextNode("\n    ");e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createElement("div");e.setAttribute(n,"class","col-md-2 hidden-sm");var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("button");e.setAttribute(r,"class","btn order-btn");var i=e.createTextNode("Order");e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n\n");e.appendChild(t,a);var a=e.createElement("div");e.setAttribute(a,"class","row card");var n=e.createTextNode("\n\n");e.appendChild(a,n),e.appendChild(t,a);var a=e.createTextNode("\n");return e.appendChild(t,a),t},buildRenderNodes:function(e,t,a){var n=new Array(1);return n[0]=e.createMorphAt(e.childAt(t,[0,1,1,3,0]),0,0),n},statements:[["inline","fa-icon",["search"],[],["loc",[null,[5,76],[5,96]]],0,0]],locals:[],templates:[]}}())}),define("material-management/templates/menu",["exports"],function(e){e.default=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@2.8.3",loc:{source:null,start:{line:1,column:0},end:{line:9,column:6}},moduleName:"material-management/templates/menu.hbs"},isEmpty:!1,arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),a=e.createElement("div");e.setAttribute(a,"class","side-menu");var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createElement("h3"),r=e.createTextNode("M");e.appendChild(n,r);var r=e.createElement("strong"),i=e.createTextNode("M");e.appendChild(r,i),e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n  ");e.appendChild(a,n);var n=e.createElement("ul"),r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("li");e.setAttribute(r,"class","active");var i=e.createElement("a"),o=e.createTextNode("Orders");e.appendChild(i,o),e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("li"),i=e.createElement("a"),o=e.createTextNode("Suppliers");e.appendChild(i,o),e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("li"),i=e.createElement("a"),o=e.createTextNode("Deliveries");e.appendChild(i,o),e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n    ");e.appendChild(n,r);var r=e.createElement("li"),i=e.createElement("a"),o=e.createTextNode("Stock");e.appendChild(i,o),e.appendChild(r,i),e.appendChild(n,r);var r=e.createTextNode("\n  ");e.appendChild(n,r),e.appendChild(a,n);var n=e.createTextNode("\n");return e.appendChild(a,n),e.appendChild(t,a),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}())}),define("material-management/config/environment",["ember"],function(e){var t="material-management";try{var a=t+"/config/environment",n=document.querySelector('meta[name="'+a+'"]').getAttribute("content"),r=JSON.parse(unescape(n)),i={default:r};return Object.defineProperty(i,"__esModule",{value:!0}),i}catch(e){throw new Error('Could not read config from meta tag with name "'+a+'".')}}),runningTests||require("material-management/app").default.create({name:"material-management",version:"0.0.0+3e31a7f9"});
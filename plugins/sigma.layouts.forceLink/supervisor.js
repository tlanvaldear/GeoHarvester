(function(undefined){"use strict";function Supervisor(a,b){_root.URL=_root.URL||_root.webkitURL,b=b||{},this.sigInst=a,this.graph=this.sigInst.graph,this.ppn=10,this.ppe=3,this.config={},this.worker=null,this.shouldUseWorker=null,this.workerUrl=null,this.runOnBackground=null,this.easing=null,this.randomize=null,this.configure(b),this.started=!1,this.running=!1,this.initWorker()}if("undefined"==typeof sigma)throw new Error("sigma is not declared");sigma.utils.pkg("sigma.layouts");var _root=this,webWorkers="Worker"in _root,eventEmitter={};sigma.classes.dispatcher.extend(eventEmitter),Supervisor.prototype.makeBlob=function(a){var b;try{b=new Blob([a],{type:"application/javascript"})}catch(c){_root.BlobBuilder=_root.BlobBuilder||_root.WebKitBlobBuilder||_root.MozBlobBuilder,b=new BlobBuilder,b.append(a),b=b.getBlob()}return b},Supervisor.prototype.graphToByteArrays=function(){var a,b,c,d=this.graph.nodes(),e=this.graph.edges(),f=d.length*this.ppn,g=e.length*this.ppe,h={};for(this.nodesByteArray=new Float32Array(f),this.edgesByteArray=new Float32Array(g),a=b=0,c=d.length;a<c;a++)h[d[a].id]=b,this.nodesByteArray[b]=this.randomize(d[a].x),this.nodesByteArray[b+1]=this.randomize(d[a].y),this.nodesByteArray[b+2]=0,this.nodesByteArray[b+3]=0,this.nodesByteArray[b+4]=0,this.nodesByteArray[b+5]=0,this.nodesByteArray[b+6]=1+this.graph.degree(d[a].id),this.nodesByteArray[b+7]=1,this.nodesByteArray[b+8]=d[a].size,this.nodesByteArray[b+9]=d[a].fixed||0,b+=this.ppn;for(a=b=0,c=e.length;a<c;a++)this.edgesByteArray[b]=h[e[a].source],this.edgesByteArray[b+1]=h[e[a].target],this.edgesByteArray[b+2]=e[a].weight||0,b+=this.ppe},Supervisor.prototype.applyLayoutChanges=function(a){for(var b=this.graph.nodes(),c=0,d=0,e=this.nodesByteArray.length;d<e;d+=this.ppn)b[c].fixed||(a?(b[c].fa2_x=this.nodesByteArray[d],b[c].fa2_y=this.nodesByteArray[d+1]):(b[c].x=this.nodesByteArray[d],b[c].y=this.nodesByteArray[d+1])),c++},Supervisor.prototype.sendByteArrayToWorker=function(a){var b={action:a||"loop",nodes:this.nodesByteArray.buffer},c=[this.nodesByteArray.buffer];"start"===a&&(b.config=this.config||{},b.edges=this.edgesByteArray.buffer,c.push(this.edgesByteArray.buffer)),this.shouldUseWorker?this.worker.postMessage(b,c):_root.postMessage(b,"*")},Supervisor.prototype.start=function(){this.running||(this.running=!0,this.started?this.sendByteArrayToWorker():(this.sendByteArrayToWorker("start"),this.started=!0,eventEmitter.dispatchEvent("start")))},Supervisor.prototype.stop=function(){this.running&&(this.running=!1,eventEmitter.dispatchEvent("stop"))},Supervisor.prototype.initWorker=function(){var _this=this,workerFn=sigma.layouts.getForceLinkWorker();if(this.shouldUseWorker){if(this.workerUrl)this.worker=new Worker(this.workerUrl);else{var blob=this.makeBlob(workerFn);this.worker=new Worker(URL.createObjectURL(blob))}this.worker.postMessage=this.worker.webkitPostMessage||this.worker.postMessage}else eval(workerFn);this.msgName=this.worker?"message":"newCoords",this.listener=function(a){_this.nodesByteArray=new Float32Array(a.data.nodes),_this.running&&(_this.applyLayoutChanges(_this.runOnBackground),_this.sendByteArrayToWorker(),_this.runOnBackground||_this.sigInst.refresh({skipIndexation:!0})),a.data.converged&&(_this.running=!1),_this.running||(_this.killWorker(),_this.runOnBackground&&_this.easing?(_this.applyLayoutChanges(!0),eventEmitter.dispatchEvent("interpolate"),_this.graph.nodes().filter(function(a){return a.fixed}).forEach(function(a){a.fa2_x=a.x,a.fa2_y=a.y}),sigma.plugins.animate(_this.sigInst,{x:"fa2_x",y:"fa2_y"},{easing:_this.easing,onComplete:function(){_this.sigInst.refresh(),eventEmitter.dispatchEvent("stop")}})):(_this.applyLayoutChanges(!1),_this.sigInst.refresh(),eventEmitter.dispatchEvent("stop")))},(this.worker||document).addEventListener(this.msgName,this.listener),this.graphToByteArrays(),_this.sigInst.bind("kill",function(){sigma.layouts.killForceLink()})},Supervisor.prototype.killWorker=function(){this.worker?this.worker.terminate():(_root.postMessage({action:"kill"},"*"),document.removeEventListener(this.msgName,this.listener))},Supervisor.prototype.configure=function(a){switch(this.config=a,this.shouldUseWorker=a.worker!==!1&&webWorkers,this.workerUrl=a.workerUrl,this.runOnBackground=!!a.background,this.easing=a.easing,a.randomize){case"globally":this.randomize=function(b){return Math.random()*(a.randomizeFactor||1)};break;case"locally":this.randomize=function(b){return b+Math.random()*(a.randomizeFactor||1)};break;default:this.randomize=function(a){return a}}if(this.started){var b={action:"config",config:this.config};this.shouldUseWorker?this.worker.postMessage(b):_root.postMessage(b,"*")}};var supervisor=null;sigma.layouts.startForceLink=function(a,b){return supervisor?supervisor.running||(supervisor.killWorker(),supervisor.initWorker(),supervisor.started=!1):supervisor=new Supervisor(a,b),b&&supervisor.configure(b),supervisor.start(),eventEmitter},sigma.layouts.stopForceLink=function(){if(supervisor)return supervisor.stop(),supervisor},sigma.layouts.killForceLink=function(){supervisor&&(supervisor.stop(),supervisor.killWorker(),supervisor=null,eventEmitter={},sigma.classes.dispatcher.extend(eventEmitter))},sigma.layouts.configForceLink=function(a,b){return supervisor?supervisor.running||(supervisor.killWorker(),supervisor.initWorker(),supervisor.started=!1):supervisor=new Supervisor(a,b),supervisor.configure(b),eventEmitter},sigma.layouts.isForceLinkRunning=function(){return!!supervisor&&supervisor.running}}).call(this);
//# sourceMappingURL=supervisor.js.map
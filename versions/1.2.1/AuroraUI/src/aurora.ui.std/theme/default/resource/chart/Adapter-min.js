AuroraAdapter={each:Ext.each,map:function(b,e){var d=[];if(b){for(var c=0,a=b.length;c<a;c++){d[c]=e.call(b[c],b[c],c,b)}}return d},grep:function(b,f,a){var c=[];for(var d=0,e=b.length;d<e;d++){if(!a!=!f(b[d],d)){c.push(b[d])}}return c},merge:function(){var a=arguments;var b=function(){var h=arguments[0]||{},f=1,g=arguments.length,c=false,e;if(typeof h==="boolean"){c=h;h=arguments[1]||{};f=2}if(typeof h!=="object"&&!Ext.isFunction(h)){h={}}if(g==f){h=this;--f}for(;f<g;f++){if((e=arguments[f])!=null){for(var d in e){var j=h[d],k=e[d];if(h===k){continue}if(c&&k&&typeof k==="object"&&!k.nodeType){h[d]=b(c,j||(k.length!=null?[]:{}),k)}else{if(k!==undefined){h[d]=k}}}}}return h};return b(true,null,a[0],a[1],a[2],a[3])},hyphenate:function(a){return a.replace(/([A-Z])/g,function(d,c){return"-"+c.toLowerCase()})},addEvent:function(b,c,a){var d=Ext.get(b);if(d){d.addListener(c,a)}else{if(!b.addListener){Ext.apply(b,new Ext.util.Observable())}b.addListener(c,a)}},fireEvent:function(el,event,eventArguments,defaultFunction){var o={type:event,target:el};if(Ext.isArray(eventArguments)&&eventArguments.length){Ext.apply(o,eventArguments[0])}else{Ext.apply(o,eventArguments)}if(el.fireEvent){var fire="el.fireEvent(event, o";if(eventArguments){for(var i=1,l=eventArguments.length;i<l;i++){fire+=",eventArguments["+i+"]"}}fire+=")";eval(fire)}if(defaultFunction){defaultFunction(o)}},removeEvent:function(b,c,a){if(b.removeListener&&b.purgeListeners){if(c&&a){b.removeListener(c,a)}else{b.purgeListeners()}}else{var d=Ext.get(b);if(d){if(c&&a){d.removeListener(c,a)}else{d.purgeAllListeners()}}}},stop:function(a){},animate:function(b,e,a){var c=b;var d=b.attr;if(d){c=Ext.get(b.element)}if(a){if(a.duration==undefined||a.duration==0){a.duration=1}else{a.duration=a.duration/1000}}else{a={}}if(e.width!==undefined){if(d){if(Ext.isIE){b.attr("width",e.width)}else{b.element.setAttributeNS(null,"width",e.width)}}else{c.setWidth(e.width)}}else{if(e.height!==undefined){if(d){if(Ext.isIE){b.attr("height",e.height);if(e.y){b.attr("y",e.y)}}else{b.element.setAttributeNS(null,"height",e.height);if(e.y){b.element.setAttributeNS(null,"y",e.y)}}}else{c.setHeight(e.height)}}else{if(e.left!==undefined){if(d){if(Ext.isIE){b.attr("left",e.left)}else{b.element.setAttributeNS(null,"left",e.left)}}else{c.setLeft(e.left)}}else{if(e.top!==undefined){if(d){if(Ext.isIE){b.attr("top",e.top)}else{b.element.setAttributeNS(null,"top",e.top)}}else{c.setTop(e.top)}}else{if(!Ext.isEmpty(e.translateX)&&!Ext.isEmpty(e.translateY)){if(d){if(Ext.isIE){Ext.fly(b.element).setStyle({left:e.translateX-b.translateX,top:e.translateY-b.translateY})}else{b.element.setAttributeNS(null,"transform","translate("+e.translateX+","+e.translateY+" )")}}}else{if(e.r&&e.start&&e.end){b.attr("r",e.r);b.attr("start",e.start);b.attr("end",e.end)}}}}}}if(e.opacity!==undefined){if(!d){Ext.fly(c).setOpacity(parseFloat(e.opacity))}}if(a.complete!=undefined){a.complete()}},getAjax:function(a,b){Ext.Ajax.request({url:a,success:function(c){b(c.responseText)}})}};
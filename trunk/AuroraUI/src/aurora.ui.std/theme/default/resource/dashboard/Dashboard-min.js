(function(){var d=Math.sin,f=Math.cos,a=Math.min,j=Math.sqrt,c=Math.PI,g=c/180,b=function(n,l){var k=new Ext.Template('<span style="font-size:{fontSize}">{text}</span>').append(document.body,{fontSize:l,text:n},true),m=k.getWidth();k.remove();return m},e=function(k){switch(k){case"left":case"top":return -1;case"right":case"bottom":return 1;default:return 0}},i=function(l,k){switch(k){case -1:return 0;case 0:return l/2;case 1:return l}},h=function(){function m(n){var o=function(){};o.prototype=n;return new o()}function l(o,n,p){if(Ext.isObject(p)){if(Ext.isObject(o[n])){k(o[n],p)}else{o[n]=m(p)}}else{if(Ext.isArray(p)){o[n]=[].concat(p)}else{o[n]=p}}return o}function k(t,p,o){if(Ext.isString(p)){return l(t,p,o)}for(var s=1,n=arguments.length;s<n;s++){var q=arguments[s];for(var r in q){l(t,r,q[r])}}return t}return function(){var o=[{}],p=arguments.length,n;while(p--){if(!Ext.isBoolean(arguments[p])){o[p+1]=arguments[p]}}n=k.apply(null,o);return n}}();$A.Dashboard=Ext.extend($A.Graphics,{options:{align:"center",verticalAlign:"middle",padding:10,max:100,min:0,borderWidth:4,borderColor:"#4572A7",borderRadius:5,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"11px",color:"#000"},board:{allowDecimals:true,width:0,fillColor:"gradient(linear,-50% 0,50% 0,color-stop(0,rgba(0,255,255,1)),color-stop(50%,rgba(255,255,0,1)),color-stop(100%,rgba(255,0,0,1)))",fillOpacity:0.5,borderColor:"#000",borderWidth:1,startAngle:0,endAngle:180,tickColor:"#000",tickLength:"25%",tickPosition:"inside",tickInterval:null,tickAngleInterval:30,tickWidth:1,tickStartAngle:10,tickEndAngle:-10,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"inside",minorTickWidth:0,marginalTickLength:"50%",marginalTickWidth:1,marginalTickColor:"#000",startOntick:true,endOntick:true,showFirstLabel:true,showLastLabel:true,labels:{enabled:true,x:5,y:5,rotation:0,style:{color:"rgb(0,0,214)",fontSize:"11px",lineHeight:"14px"}}},pointer:{fillColor:"rgba(135,135,135,0.3)",fillOpacity:null,borderColor:"#000",borderWidth:1,width:8,dist:10,labels:{enabled:true,x:15,y:-15,rotation:-90,style:{color:"rgb(145,45,0)",fontSize:"11px",lineHeight:"14px"}}},title:{text:"Dashboard title",align:"center",verticalAlign:"top",margin:15,x:0,y:0,style:{color:"#3E576F",fontSize:"16px"}}},constructor:function(k){$A.Dashboard.superclass.constructor.call(this,k);this.setOptions(k)},processDataListener:function(k){var l=this.binder&&this.binder.ds;if(l){l[k]("update",this.redraw,this)}},bind:function(l,k){if(typeof(l)=="string"){l=$(l)}if(!l){return}this.binder={ds:l,name:k};this.record=l.getCurrentRecord();this.processDataListener("on");this.onLoad()},setOptions:function(k,l){this.options=h(this.options,k);if(l){this.redraw()}},onLoad:function(){var k=this;if(!this.hasSVG){$A.onReady(function(){k.redraw()})}else{k.redraw()}},redraw:function(){if(!this.record){return}this.clear();this.group=this.createGElement("group");this.renderBoard();this.renderCenter();this.renderTitle();this.renderPointer()},setTitle:function(k){this.options.title=h(this.options.title,k);this.redraw()},clear:function(){var k=this.top.cmps;while(k.length){k.pop().destroy()}this.pointerEl=null},renderTitle:function(){var z=this.options.title,u=z.text;if(!u){return}var p=e(z.align),o=e(z.verticalAlign),l=this.width,v=this.height,n=z.margin,t=z.x,s=z.y,k=z.style,w=k.fontSize,m=k.color,q=b(u,w),r=parseInt(w);this.titleEl=this.createGElement("text",{root:this.group.wrap,text:u,color:m,size:r,dx:t+n+i(l-n*2-q,p),dy:s+n+i(v-n*2-r,o)})},renderBoard:function(){var I=this.options,R=I.title,s=R.verticalAlign,v=I.board,af=I.padding,r=I.borderWidth,T=I.borderColor,m=I.borderRadius,u=(Ext.isEmpty(I.marginLeft)?0:I.marginLeft)+r,ak=(Ext.isEmpty(I.marginRight)?0:I.marginRight)+r,Z=(Ext.isEmpty(I.marginTop)?(R.text&&s=="top"?R.y+R.margin*2:0):I.marginTop)+r,S=(Ext.isEmpty(I.marginBottom)?(R.text&&s=="bottom"?R.y+R.margin*2:0):I.marginBottom)+r,l=(I.width||300)-af*2-u-ak,n=(I.height||300)-af*2-Z-S,ae=e(I.align||"center"),K=e(I.verticalAlign||"middle"),B={},ab,Y,X,q,o,V=(v.startAngle%360+360)%360,C=(v.endAngle%360+360)%360,C=C>V?C:C+360,J=g*V,z=g*(C%360),E=I.max,aj=I.min,ah=v.width||a(n,l)/4,aa=v.tickAngleInterval*g,W=v.startOntick?J:v.tickStartAngle*g+J,ad=v.endOntick?z:v.tickEndAngle*g+z,p=this.normalizeTickInterval(v.tickInterval?v.tickInterval:(E-aj)*aa/(ad-W),v),aa=(ad-W)*p/(E-aj),U=Math.ceil((E-aj)/p),G=d(J),D=d(z),N=f(J),L=f(z),t=function(ap,y,am,al){ab=a(ap,y);var x={xR:am*ab,yR:al*ab},aq,an,ar,ao;if(y<=ap){ao=l*(1-ab/ap);aq="x";an="y";ar=ae}else{ao=n*(1-ab/y);aq="y";an="x",ar=K}x[aq]=af+x[aq+"R"]+i(ao,ar);x[an]=af+x[an+"R"];Y=x.x+u;X=x.y+Z};if(G>=0){if(N>=0){if(D>=0){if(L>N){t(l/2,n/2,1,1)}else{if(L>=0){t(l/N,n/D,0,D)}else{t(l/(N-L),n,-L,1)}}}else{if(L>N){t(l/(1+L),n/2,1,1)}else{if(L>=0){t(l/(1+N),n/2,1,1)}else{t(l/(1+N),n/(1-D),1,1)}}}}else{if(L<=0){if(D>G){t(l/2,n/2,1,1)}else{if(D>=0){t(l/-L,n/G,-L,G)}else{t(l,n/(G-D),1,G)}}}else{if(D>G){t(l/2,n/(1+D),1,D)}else{if(D>=0){t(l/2,n/(1+G),1,G)}else{t(l,n/(G-D),1,G)}}}}}else{if(N<=0){if(D<=0){if(L<N){t(l/2,n/2,1,1)}else{if(L<=0){t(l/-N,n/-D,-N,0)}else{t(l/(L-N),n,-N,0)}}}else{if(L<N){t(l/(1-L),n/2,1,1)}else{if(L<=0){t(l/(1+N),n/2,1,1)}else{t(l/(1-N),n/(1+D),1,D)}}}}else{if(L>=0){if(D<G){t(l/2,n/2,1,1)}else{if(D<=0){t(l/L,n/-G,0,0)}else{t(l,n/(D-G),0,D)}}}else{if(D<G){t(l/2,n/(1-D),1,1)}else{if(D<=0){t(l/2,n/(1-G),1,1)}else{t(l/(1-L),n/(1-G),-L,1)}}}}}this.createGElement("rect",{root:this.group.wrap,x:0+r,y:0+r,width:this.width-r*2,height:this.height-r*2,rx:m,ry:m,strokecolor:T,strokewidth:r,fillcolor:"transparent"}).createGElement("arc",{root:this.group.wrap,x:Y,y:X,r:ab,innerR:ab-ah,start:J,end:z,cursor:"default",fillcolor:v.fillColor,fillopacity:v.fillOpacity,strokecolor:v.borderColor,strokewidth:v.borderWidth});var A=W,ac=aj,w=v.labels,k=w.style,O=w.rotation,Q=k.color||I.style.color,H;v.width=ah;for(var ag=0;ag<=U;ag++){var B=this.getTickOptions(v,(ag==0||ag==U)?"marginal":""),P=B.length,M=f(A),F=d(A),ai=[Y+ab*M,X-ab*F,Y+(ab-P)*M,X-(ab-P)*F];H=!w.enabled||(!v.showFirstLabel&&ag==0)||(!v.showLastLabel&&ag==U);this.createGElement("line",{root:this.group.wrap,points:ai.join(" "),strokewidth:(A==J||A==z)?0:B.width,strokecolor:B.color,title:H?"":(ac+""),titlesize:parseInt(k.fontSize||I.style.fontSize),titlecolor:k.color||I.style.color,titlex:w.x,titley:w.y,titlerotation:90-A/g-O,titlefontfamily:k.fontFamily||I.style.fontFamily});if(ag==U-1){ac=E;A=ad}else{ac+=p;A+=aa}}Ext.apply(I.pointer,{center:[Y,X],start:J,end:z,minAngle:W,maxAngle:ad,radius:ab-I.pointer.dist})},getTickOptions:function(k,l){l=l?l+"T":"t";var m=k[l+"ickLength"];if(/\%/.test(m)){m=parseInt(m)/100*k.width}return{length:m,width:k[l+"ickWidth"],color:k[l+"ickColor"]}},renderPointer:function(){var w=this.record.get(this.binder.name),D=this.options.max,C=this.options.min;if(/\%/.test(w)){w=(D-C)*parseInt(w)/100+C}var n=this.options.pointer,H=n.labels,E=this.options.style,l=H.style,B=n.width,p=n.radius,I=n.center,q=n.minAngle,o=n.maxAngle<q?n.maxAngle+c*2:n.maxAngle,F=(o-q)/(D-C)*(w-C)+q,r=g*135,z=F+r,t=F-r,k=d(F),m=f(F),A=B*p*j(2)/(2*p-B),u=I[0]+p*m,s=I[1]-p*k,G=["M",I[0]-u,I[1]-s,"L",I[0]+A*f(z)-u,I[1]-A*d(z)-s,0,0,I[0]+A*f(t)-u,I[1]-A*d(t)-s,"Z"];this.pointerEl=this.createGElement("path",{root:this.group.wrap,d:G.join(" "),x:u,y:s,strokecolor:n.borderColor,strokewidth:n.borderWidth,fillcolor:n.fillColor,fillopacity:n.fillOpacity,title:H.enabled?w:"",titlesize:parseInt(l.fontSize||E.fontSize),titlecolor:l.color||E.color,titlex:H.x,titley:H.y,titlerotation:90-F/g-H.rotation,titlefontfamily:l.fontFamily||E.fontFamily});this.setTopCmp(this.centerEl.wrap);this.setTopCmp(this.titleEl.wrap)},renderCenter:function(){var l=this.options.pointer,k=l.center,m=l.width;this.centerEl=this.createGElement("arc",{root:this.group.wrap,x:k[0],y:k[1],r:m,innerR:m-2,start:l.start,end:l.end,cursor:"default",strokecolor:l.borderColor,strokewidth:l.borderWidth})},normalizeTickInterval:function(k,l){var n=Math.pow(10,Math.floor(Math.log(k)/Math.LN10)),o=k/n,p=[1,2,2.5,5,10];if(l&&l.allowDecimals===false){if(n===1){p=[1,2,5,10]}else{if(n<=0.1){p=[1/n]}}}for(var m=0;m<p.length;m++){k=p[m];if(o<=(p[m]+(p[m+1]||p[m]))/2){break}}k*=n;return k}})})();
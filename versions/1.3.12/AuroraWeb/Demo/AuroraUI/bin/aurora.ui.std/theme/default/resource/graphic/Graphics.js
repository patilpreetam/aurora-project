(function(){
var DOC=document,
    SVG_NS = 'http://www.w3.org/2000/svg',
    XLINK_NS = 'http://www.w3.org/1999/xlink',
	hasSVG = !!DOC.createElementNS && !!DOC.createElementNS(SVG_NS, "svg").createSVGRect,
	fill = "<v:fill color='{fillColor}' opacity='{fillOpacity}'/>",
	stroke = "<v:stroke startarrow='{startArrow}' endarrow='{endArrow}' color='{strokeColor}' joinstyle='miter' weight='{strokeWidth}px' opacity='{strokeOpacity}'/>",
    pathReg = /\w|[\s\d-+.,]*/g,
    numberReg = /[\d-+.]+/g,
    firstUp = function(w){
    	return w.toLowerCase().replace(/^\S/,w.toUpperCase().charAt(0));
    },
    newSVG = function(tag,id){
    	var e = DOC.createElementNS(SVG_NS, tag);
    	if(!Ext.isEmpty(id)) e.id = id;
    	return Ext.get(e);
    },
    newVML = function(vml,id){
    	var e = DOC.createElement(vml);
    	if(!Ext.isEmpty(id)) e.id = id;
    	return Ext.get(e);
    },
    encodeStyle = function(prop,value){
    	var tmp,style,css=[];
        if (!Ext.isObject(prop)) {
            tmp = {};
            tmp[prop] = value;
            prop = tmp;
        }
        for (style in prop) {
            value = prop[style];
            css.push(style);
            css.push(':');
            css.push(value);
            css.push(';');
        }
        return css.join('');
    };

/**
 * @class Aurora.Graphics
 * @extends Aurora.Component
 * 图形基础组件.
 * @author huazhen.wu@hand-china.com
 * @constructor
 * @param {Object} config 配置对象. 
 */
$A.Graphics=Ext.extend($A.Component,{
	constructor: function(config) {
		this.root=config.root;
		$A.Graphics.superclass.constructor.call(this,config);
		return this;
	},
	initComponent : function(config){ 
		$A.Graphics.superclass.initComponent.call(this,config);
		this.fillcolor = this.convertColor(this.fillcolor);
		this.strokecolor = this.convertColor(this.strokecolor);
		this['init'+(hasSVG?'SVG':'VML')+'Element']();
		if(this.title)this.setTitle(this.title)
    },
    initEvents : function(){
    	$A.Graphics.superclass.initEvents.call(this);
    	this.addEvents(
	    	/**
	         * @event click
	         * 单击事件.
	         * @param {Aurora.Graphics} obj 图形对象.
	         * @param {Aurora.DataSet} dataset 数据集对象.
	         * @param {Aurora.Record} record 数据行对象.
	         */
    		'click'
    	)
    },
	processListener: function(ou){
		$A.Graphics.superclass.processListener.call(this,ou);
		this.wrap[ou]('click',this.onClick,this,{preventDefault:true});
		this.wrap[ou]('mouseover',this.onMouseOver,this,{preventDefault:true});
		this.wrap[ou]('mouseout',this.onMouseOut,this,{preventDefault:true});
    },
    processDataSetLiestener:function(ou){
    	ds = this.dataset;
    	if(ds){
	    	ds[ou]('load', this.onLoad, this);
	    	ds[ou]('update', this.onUpdate, this);
    	}
    },
    initSVGElement : function(){
    	this.root = newSVG("svg");
    	this.wrap.appendChild(this.root);
    },
    initVMLElement : function(){
    	if (!DOC.namespaces.hcv) {
            DOC.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
            DOC.createStyleSheet().cssText = 
                'v\\:roundrect,v\\:oval,v\\:image,v\\:polyline,v\\:line,v\\:group,v\\:fill,v\\:path,v\\:shape,v\\:stroke'+
                '{ behavior:url(#default#VML); display: inline-block; } ';
        }
        this.root = this.wrap;
    },
    onClick : function(e,t){
    	var a = t.id.split('_'),id = a[1],record;
    	if(this.dataset&&id)
    		record = this.dataset.findById(id)
    	if(a[0]&&id)t = $(a[0]+'_'+id);
    	this.fireEvent('click',t,this.dataset,record);
    },
    onMouseOver : function(e,t){
    	var a = t.id.split('_'),id = a[1],record;
    	if(this.dataset&&id)
    		record = this.dataset.findById(id)
    	if(a[0]&&id)t = $(a[0]+'_'+id);
    	this.fireEvent('mouseover',t,this.dataset,record);
    },
    onMouseOut : function(e,t){
    	var a = t.id.split('_'),id = a[1],record;
    	if(this.dataset&&id)
    		record = this.dataset.findById(id)
    	if(a[0]&&id)t = $(a[0]+'_'+id);
    	this.fireEvent('mouseout',t,this.dataset,record);
    },
    create : function(g){
    	var type = g.get('type'),title = g.get('title'),config = Ext.util.JSON.decode((g.get('config')||'').toLowerCase());
		if(title) config.title = title;
		config.id = this.id + "_" + g.id;
		if(type)this.createGElement(type,config);
    },
    clear : function(){
    	var el = this.root.dom;
    	while(el.firstChild){
    		Ext.fly(el.firstChild).remove();
    	}
    },
    bind : function(ds){
    	this.dataset = $(ds);
    	if(this.dataset)this.processDataSetLiestener('on');
    	this.onLoad();
    },
    onLoad : function(){
    	var graphics = this.dataset.getAll();
    	graphics.sort(function(a,b){
    		var at=a.get('type'),bt=b.get('type');
    		if(at === 'line')return -1;
    		else if(bt === 'line')return 1;
    		else return 0;
    	})
    	for(var i = 0,l = graphics.length;i<l;i++){
    		this.create(graphics[i]);
    	}
    },
    onUpdate : function(ds,record, name, value){
    	var el = $(this.id+'_'+record.id);
    	var prev = Ext.fly(el.id).prev();
    	el.destroy();
    	this.create(record);
    	if(prev){
    		Ext.fly(this.id+'_'+record.id+'_title').insertAfter(prev)
    		Ext.fly(this.id+'_'+record.id).insertAfter(prev)
    	}
    },
	createGElement : function(name,config){
    	return new pub[firstUp(name)](Ext.apply(config,{root:Ext.get(config.root)||this.root}));
    },
    convertColor :function(color){
    	if(color && color.search(/rgb/i)!=-1){
    		var c ="#";
    		color.replace(/\d+/g,function(item){
    			var n = Number(item).toString(16);
    			c += (n.length == 1?"0":"") +n;
    		})
    		return c;
    	}
    	return color;
    },
    setTitle : function(title){
    	if(!this.text)this.text = new pub.Text({id:this.id+'_title',x:this.titlex,y:this.titley,color:this.titlecolor,size:this.titlesize,root:this.root});
    	this.text.setText(title);
    },
    destroy : function(){
    	this.wrap.remove();
    	if(this.text)this.text.destroy();
    	$A.Graphics.superclass.destroy.call(this);
    	if(this.dataset)this.processDataSetLiestener('un');
    }
});
var pub ={
	Path:Ext.extend($A.Graphics,{
		zoom:10000,
		initSVGElement : function(){
			this.wrap = newSVG("path",this.id);
	    	this.wrap.dom.style.cssText=encodeStyle({
	    		'fill':this.fillcolor,
	    		'fill-opacity':this.fillopacity,
	    		'stroke':this.strokecolor,
	    		'stroke-width':this.strokewidth,
	    		'stroke-opacity':this.strokeopacity,
	    		'cursor':'pointer'
	    	})+this.style;
	    	var config = {};
	    	if(this.startarrow || this.endarrow){
	    		var a = this.d.match(numberReg),l = a.length;
		    	if(this.startarrow){
		    		config['marker-start']='url(#start-arrow-'+this.strokecolor+'-'+this.startarrow+')';
		    		var point = this.convertArrow(Number(a[0]),y1 = Number(a[1]), x2 = Number(a[2]),y2 = Number(a[3]));
		    		this.d = this.d.replace(/[\d-+.]+\s+[\d-+.]+/,point.x+' '+point.y);
		    	}
		    	if(this.endarrow){
		    		config['marker-end']='url(#end-arrow-'+this.strokecolor+'-'+this.endarrow+')';
		    		var point = this.convertArrow(Number(a[l-2]),y1 = Number(a[l-1]), x2 = Number(a[l-4]),y2 = Number(a[l-3]));
		    		this.d = this.d.replace(/([\d-+.]+\s+[\d-+.]+)[^\d]*$/,point.x+' '+point.y);
		    	}
	    		new pub.Arrow({color:this.strokecolor,strokewidth:this.strokewidth,endarrow:this.endarrow,startarrow:this.startarrow,root:this.root})
	    	}
	    	config.d=this.d;
	    	this.wrap.set(config);
	    	this.root.appendChild(this.wrap);
	    },
	    initVMLElement : function(){
	    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
	    		id:this.id,
	    		style:this.style,
	    		path:this.convertPath(this.d),
	    		zoom:this.zoom,
	    		fillColor:this.fillcolor||'black',
	    		fillOpacity:this.fillopacity||'1',
	    		strokeColor:this.strokecolor||'none',
	    		strokeWidth:this.strokecolor?this.strokewidth:0,
	    		strokeOpacity:this.strokecolor?(this.strokeopacity||1):0,
	    		endArrow:this.endarrow,
	    		startArrow:this.startarrow
	    	},true)
	    },
	    convertArrow : function(x1,y1,x2,y2){
	    	var dx = x1 - x2,dy = y1 - y2;
	    	if(dx == 0){
				y1 += dy>0?-this.strokewidth:this.strokewidth;
			}else if(dy == 0){
				x1 += dx>0?-this.strokewidth:this.strokewidth;
			}else{
				var ll = Math.sqrt(dx*dx+dy*dy);
				x1 = (ll-this.strokewidth)/ll*dx+x2;
				y1 = (ll-this.strokewidth)/ll*dy+y2;
			}
			return {x:x1,y:y1};
	    },
	    convertPath : function(p){
	    	var arr=p.match(pathReg),p1=[0,0],p2=[0,0],path=[],sf=this,
	    	f1=function(s,isC){
	    		var arr=Ext.isArray(s)?s:s.match(numberReg);
	    		for(var i=0;i<arr.length;i++){
	    			if(!isC||i/2%3==2){
	    				p2[0]+=f4(arr[i]);
	    				p2[1]+=f4(arr[++i]);
	    				path=path.concat(p2);
	    			}else{
	    				path=path.concat([p2[0]+f4(arr[i]),p2[1]+f4(arr[++i])]);
	    			}
	    		}
	    	},
	    	f2=function(s,re){
	    		var arr=s.match(numberReg);
	    		while(arr.length&&arr.length%7==0){
		    		var	rx=f4(arr.shift()),
		    			ry=f4(arr.shift()),
		    			rr=f4(arr.shift()),
		    			la=Number(arr.shift()),//是否是大角度弧线
		    			sw=Number(arr.shift()),//是否是顺时针
		    			x=f4(arr.shift()),
		    			y=f4(arr.shift()),
		    			l,t,r,b;
		    		if(re){
		    			x+=p2[0];
		    			y+=p2[1];
		    		}
		    		var dx=Math.abs(x-p2[0]),dy=Math.abs(y-p2[1]);
		    		rx=dx;ry=dy;
		    		path.push(sw?'wa':'at');
		    		if((sw^la)^x<p2[0]){
						if(y<p2[1]){
							l=p2[0];
							t=p2[1]-ry;
						}else{
							l=p2[0]-rx;
							t=p2[1];
						}
		    		}else{
		    			if(y<p2[1]){
							l=p2[0]-rx;
							t=p2[1]-(ry<<1);
						}else{
							l=p2[0]-(rx<<1);
							t=p2[1]-ry;
						}
		    		}
		    		r=l+(rx<<1);
					b=t+(ry<<1);
		    		path.push(l,t,r,b,p2[0],p2[1],x,y);
		    		p2=[x,y];
	    		}
	    	},
	    	f3=function(s){
	    		var a=s.match(numberReg).slice(-2);
	    		return [f4(a[0]),f4(a[1])];
	    	},
	    	f4=function(n){
	    		return Math.floor(n*sf.zoom);
	    	},
	    	f5=function(s){
	    		for(var i=0,a=s.match(numberReg);i<a.length;i++){
	    			path.push(f4(a[i]))
	    		}
	    	}
	    	for(var i=0;i<arr.length;i++){
	    		switch(arr[i]){
	    			case 'M': p1=f3(arr[i+1]);
	    			case 'C':
	    			case 'L': p2=f3(arr[i+1]);path.push(arr[i]);f5(arr[++i]);break;
	    			case 'm': path.push('M');f1(arr[++i]);p1=[].concat(p2);break;
	    			case 'c': path.push('C');f1(arr[++i],true);break;
	    			case 'l': path.push('L');f1(arr[++i]);break;
	    			case 'h': path.push('L');f1(arr[++i]+" 0");break;
	    			case 'v': path.push('L');f1("0 "+arr[++i]);break;
	    			case 'H': path.push('L');p2[0]=f4(arr[++i]);path.push(p2[0],p2[1]);break;
	    			case 'V': path.push('L');p2[1]=f4(arr[++i]);path.push(p2[0],p2[1]);break;
	    			case 'A': f2(arr[++i]);break;
	    			case 'a': f2(arr[++i],true);break;
	    			case 'Z': 
	    			case 'z': path.push('X');p2=[].concat(p1);break;
	    		}
	    	}
	    	path.push('E');
	    	return path.join(' ');
	    },
	    vmlTpl : ["<v:shape id='{id}' coordsize='{zoom},{zoom}' style='position:absolute;left:0;top:0;width:1px;height:1px;cursor:pointer;{style}' path='{path}'>",
	    fill,stroke,"</v:shape>"]
	}),
	Line : function(config){
		var a= config.points.match(numberReg);
		a.splice(2,0,"L");
		if(config.strokewidth == 1)config.strokewidth = 2;
		config.fillcolor = 'none';
		return new pub.Path(Ext.apply(config,{d:["M"].concat(a).join(' ')}));
	},
	Oval:Ext.extend($A.Graphics,{
		initSVGElement : function(){
			this.wrap = newSVG("ellipse",this.id);
	    	this.wrap.dom.style.cssText=encodeStyle({
	    		'fill':this.fillcolor,
	    		'fill-opacity':this.fillopacity,
	    		'stroke':this.strokecolor,
	    		'stroke-width':this.strokewidth,
	    		'stroke-opacity':this.strokeopacity,
	    		'cursor':'pointer'
	    	})+this.style;
	    	this.wrap.set({cx:this.cx,cy:this.cy,rx:this.rx,ry:this.ry});
	    	this.root.appendChild(this.wrap);
	    },
	    initVMLElement : function(){
	    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
	    		id:this.id,
	    		style:this.style,
	    		left:this.cx-this.rx,
	    		top:this.cy-this.ry,
	    		width:this.rx<<1,
	    		height:this.ry<<1,
	    		fillColor:this.fillcolor||'black',
	    		fillOpacity:this.fillcolor=='none'?'0':(this.fillopacity||'1'),
	    		strokeColor:this.strokecolor||'none',
	    		strokeWidth:this.strokecolor?this.strokewidth:0,
	    		strokeOpacity:this.strokecolor?(this.strokeopacity||1):0
	    	},true)
	    },
	    vmlTpl : ["<v:oval id='{id}' style='position:absolute;left:{left}px;top:{top}px;width:{width}px;height:{height}px;cursor:poniter;{style}'>",
	    fill,stroke,"</v:oval>"]
	}),
	Image : Ext.extend($A.Graphics,{
		initSVGElement : function(){
			this.wrap = newSVG("image",this.id);
	    	this.wrap.dom.style.cssText=encodeStyle({
	    		'stroke':this.strokecolor,
	    		'stroke-width':this.strokewidth,
	    		'stroke-opacity':this.strokeopacity
	    	})+this.style;
	    	this.wrap.dom.setAttributeNS(XLINK_NS,'xlink:href',this.src);
	    	this.wrap.set({x:this.x,y:this.y,width:this.width,height:this.height});
	    	this.root.appendChild(this.wrap);
	    },
	    initVMLElement : function(){
	    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
	    		id:this.id,
	    		src:this.src,
	    		style:this.style,
	    		left:this.x,
	    		top:this.y,
	    		width:this.width,
	    		height:this.height,
	    		strokeColor:this.strokecolor||'none',
	    		strokeWidth:this.strokecolor?this.strokewidth:0,
	    		strokeOpacity:this.strokecolor?(this.strokeopacity||1):0
	    	},true)
	    },
	    vmlTpl : ["<v:image id='{id}' src='{src}' style='position:absolute;left:{left}px;top:{top}px;width:{width}px;height:{height}px;{style}'>",stroke,"</v:image>"]
	}),
	Rect : function(config){
		var l = Number(config.x)||0,
			t = Number(config.y)||0,
			h = Number(config.height)||200,
			w = Number(config.width)||200,
			rx = Math.min(Number(config.rx)||0,w/2),
			ry = Math.min(Number(config.ry)||0,h/2),
			round = rx>0&&ry>0,
			lx = rx!=w/2,
			ly = ry!=h/2,
			d = ['M',l,t+(round?ry:0)];
			if(round)d.push('A',rx,ry,0,0,1,l+rx,t);
			if(lx)d.push('H',l+w-(round?rx:0));
			if(round)d.push('A',rx,ry,0,0,1,l+w,t+ry);
			if(ly)d.push('V',t+h-(round?ry:0));
			if(round)d.push('A',rx,ry,0,0,1,l+w-rx,t+h);
			if(lx)d.push('H',l+(round?rx:0));
			if(round)d.push('A',rx,ry,0,0,1,l,t+h-ry);
			if(ly)d.push('Z');
		return new pub.Path(Ext.apply(config,{d:d.join(' ')}));
	},
	Diamond : function(config){
		var l = Number(config.x)||0,
			t = Number(config.y)||0,
			h = Number(config.height)||100,
			w = Number(config.width)||200,
			d = ['M',
				l,t+config.height/2,
				'L',
				l+w/2,t,
				l+w,t+h/2,
				l+w/2,t+h,
				'Z'];
		return new pub.Path(Ext.apply(config,{d:d.join(' ')}));
	},
	Text : Ext.extend($A.Graphics,{
		initSVGElement : function(){
			this.wrap = newSVG("text",this.id);
	    	this.wrap.dom.style.cssText=encodeStyle({
	    		'fill':this.color,
	    		'cursor':'text'
	    	})+this.style;
	    	this.wrap.set({x:this.x,y:this.y+(this.size||11),'font-size':this.size||11});
	    	this.root.appendChild(this.wrap);
	    },
	    initVMLElement : function(){
	    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
	    		id:this.id,
	    		style:encodeStyle({'font-size':(this.size||11)+'px'})+this.style,
	    		left:this.x,
	    		top:this.y,
	    		color:this.color||'black'
	    	},true)
	    },
	    setText : function(text){
	    	if(hasSVG)this.wrap.dom.textContent = text;
	    	else this.wrap.update(text);
	    },
	    vmlTpl : "<span id='{id}' style='position:absolute;left:{left}px;top:{top}px;color:{color};{style}'></span>"
	}),
	Arrow : function(config){
		var defs = config.root.child('defs');
		if(!defs){
			defs = newSVG('defs');
			config.root.insertFirst(defs);
		}
		if(config.startarrow){
			var color = config.color,id = 'start-arrow-'+color+'-'+config.startarrow;
			var marker = Ext.get(id);
			if(!marker){
				marker = newSVG('marker');
				marker.set({id:id,viewBox:'0 0 100 100',refX:40,refY:50,orient:'auto'});
				defs.appendChild(marker);
				new pub.Path({fillcolor:color,d:'M 100 0 L 0 50 L 100 100 L 66.66 50 z',root:marker});
			}
		}
		if(config.endarrow){
			var color = config.color,id = 'end-arrow-'+color+'-'+config.endarrow;
			var marker = Ext.get(id);
			if(!marker){
				marker = newSVG('marker');
				marker.set({id:id,viewBox:'0 0 100 100',refX:60,refY:50,orient:'auto'});
				defs.appendChild(marker);
				new pub.Path({fillcolor:color,d:'M 0 0 L 100 50 L 0 100 L 33.33 50 z',root:marker});
			}
		}
	}
}
})();
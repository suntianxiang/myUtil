var ImageCrop = function(){
	
	this._default = {
		square:true,//是否裁剪为正方形
		minWidth:20,//最小宽度
		minHeigth:20,//最小高度
		maxWidth:450,//最大宽度
		maxHeight:450//最大高度
	};
	if(arguments.length < 1){
		return this;
	}
	var options = arguments[0];
	if(typeof options == 'object'){
		var _default = this._default;
		if(options.hasOwnProperty('square')){
			_default.square = !!options.square;
		} else if(options.hasOwnProperty('minWidth') && !isNaN(parseFloat(options.minWidth))){
			_default.minWidth = options.minWidth;
		} else if(options.hasOwnProperty('minHeigth') && !isNaN(parseFloat(options.minHeigth))){
			_default.minWidth = options.minHeigth;
		} else if(options.hasOwnProperty('maxWidth') && !isNaN(parseFloat(options.maxWidth))){
			_default.minWidth = options.maxWidth;
		} else if(options.hasOwnProperty('maxHeight') && !isNaN(parseFloat(options.maxHeight))){
			_default.minWidth = options.maxHeight;
		}
	}
	return this;
}
/**
 * 对图片应用裁剪插件
 */
ImageCrop.prototype.crop = function(imgDom){
	if(typeof imgDom == 'undefined' || imgDom.nodeName != 'IMG'){
		//传入的必须是图片元素
		throw "invalid argument imgDom";
	}
	var style = document.createElement('style');
	style.innerHTML = '.crop-img-box{position: absolute;z-index: 1001;}'
		+'.show-rect{z-index: 1002;position: absolute;}'
		+'.opacity-img{opacity: 0.5;}'
		+'.point-box{position: absolute;background-color: rgba(4, 4, 4, 0.62);}'
		+'.point{display: inline-block;width:5px;height:5px;border:1px solid #000;position: absolute;z-index:1003;}';
	document.head.appendChild(style);
	this.img = imgDom;
	var parent = imgDom.parentNode;
	this.box = document.createElement("div");
	this.box.className = 'crop-img-box';
	this.box.innerHTML = '<div class="point-box">'
		+		'<span class="point leftTop"></span>'
		+		'<span class="point leftCenter"></span>'
		+		'<span class="point leftBottom"></span>'
		+		'<span class="point rightTop"></span>'
		+		'<span class="point rightCenter"></span>'
		+		'<span class="point rightBottom"></span>'
		+		'<span class="point topCenter"></span>'
		+		'<span class="point bottomCenter"></span>'
		+	'</div>'
		+	'<img class="show-rect" src="'+this.img.src+'" alt="加载失败">';
	parent.insertBefore(this.box , imgDom);
	this.box.parentNode.style.position = 'relative';
	this.init();
}
/**
 * 是否可以移动该点
 * @param left    最左坐标值
 * @param right   最右坐标值
 * @param top     最上坐标值
 * @param bottom  最下坐标值
 * @return bool
 */
ImageCrop.prototype.thePointCanMove = function(left, right, top, bottom){
	if(left < right && top < bottom){
		return true;
	}
	return false;
}
/**
 * 初始化裁剪事件
 */
ImageCrop.prototype.init = function(){
	var crop = this;
	this.box.style.left = this.img.offsetLeft+'px';
	this.box.style.top = this.img.offsetTop+'px';
	/**
	 * 获取元素相对文档偏移
	 * @param ele HTMLDOMElement
	 * @return Object
	 */
	var getOffsetRect = function(ele){
      var box=ele.getBoundingClientRect();
      var body=document.body,
        docElem=document.documentElement;
      //获取页面的scrollTop,scrollLeft(兼容性写法)
      var scrollTop=window.pageYOffset||docElem.scrollTop||body.scrollTop,
        scrollLeft=window.pageXOffset||docElem.scrollLeft||body.scrollLeft;
      var clientTop=docElem.clientTop||body.clientTop,
        clientLeft=docElem.clientLeft||body.clientLeft;
      var top=box.top+scrollTop-clientTop,
        left=box.left+scrollLeft-clientLeft;
      return {
        //Math.round 兼容火狐浏览器bug
        top:top,
        left:left
      }
    };
	var img = this.img;
	var img1 = this.box.querySelector(".show-rect");
	var imgShowRect = this.box.querySelector("img");
	var pointBox = this.box.childNodes[0];
	pointBox.style.width=this.img.width+'px';
	pointBox.style.height=this.img.height+'px';
	img1.style.width=this.img.width+'px';
	img1.style.height=this.img.height+'px';
	/* 初始化各个点*/
	var leftTop = pointBox.children[0];//左上点
	var leftCenter = pointBox.children[1];//左中点
	var leftBottom = pointBox.children[2];//左下点
	var rightTop = pointBox.children[3];//右上
	var rightCenter = pointBox.children[4];
	var rightBottom = pointBox.children[5];
	var topCenter = pointBox.children[6];
	var bottomCenter = pointBox.children[7];
	var pointWidth = leftTop.offsetWidth;//点的宽度
	var imgCenter = {//图片中心
		left:img.width/2,
		top:img.height/2
	};
	var _default = this._default;
	var maxWidth = img.width > _default.maxWidth ? _default.maxWidth : img.width;
	var maxHeight = img.height > _default.maxHeight ? _default.maxHeight : img.height;
	var max = maxWidth > maxHeight ? maxHeight : maxWidth;//边长最大值
	max-=10;//使点不超过图片
	//初始化边缘点
	leftTop.style.top = imgCenter.top-max/2-pointWidth/2+'px';
	leftTop.style.left = imgCenter.left-max/2-pointWidth/2+'px';
	leftCenter.style.top = imgCenter.top-pointWidth/2+'px';
	leftCenter.style.left = imgCenter.left-max/2-pointWidth/2+'px';
	leftBottom.style.top = imgCenter.top+max/2-pointWidth/2+'px';
	leftBottom.style.left = imgCenter.left-max/2-pointWidth/2+'px';
	rightTop.style.top = leftTop.style.top;
	rightTop.style.left = imgCenter.left+max/2+pointWidth/2+'px';
	rightCenter.style.top = leftCenter.style.top;
	rightCenter.style.left = rightTop.style.left;
	rightBottom.style.top = leftBottom.style.top;
	rightBottom.style.left = rightTop.style.left;
	topCenter.style.top = rightTop.style.top;
	topCenter.style.left = imgCenter.left-pointWidth/2+'px';
	bottomCenter.style.top = leftBottom.style.top;
	bottomCenter.style.left = topCenter.style.left;
	/* 裁剪图片 */
	this.img.style.opacity = 0.5;
	crop.setClip();
	//取消图片拖动默认事件
	img1.addEventListener('mousemove',function(e){
		e.preventDefault();
	});
	var mousedown = function(e){
		e.preventDefault();
		var me = this;
		var oldX = e.layerX;
		var oldY = e.layerY;
		var movePoint = function(e){
			var x = e.pageX;
			var y = e.pageY;
			//点是否在容器上
			var inBox = function(dom , point){
				var offset = getOffsetRect(dom);
				var x = point.x;
				var y = point.y;
				if(x>offset.left && y>offset.top && y<offset.top+dom.offsetHeight && x < offset.left+dom.offsetWidth){
					return true;
				}
				return false;
			}
			var hasClass = function(dom,cls){
				return dom.className.toLowerCase().indexOf(cls) != -1;
			}
			if(!inBox(pointBox , {x:x,y:y})){
				return false;
			}
			var offset = getOffsetRect(pointBox);
			var nowX = x - offset.left;
			var nowY = y - offset.top;
			var top = rightTop.style.top.replace('px' , '') ? parseInt(rightTop.style.top.replace('px' , '')) : 0;
			var bottom = rightBottom.style.top.replace('px' , '') ? parseInt(rightBottom.style.top.replace('px' , '')) : 0;
			var left = leftCenter.style.left.replace('px' , '') ? parseInt(leftCenter.style.left.replace('px' , '')) : 0;
			var right = rightCenter.style.left.replace('px' , '') ? parseInt(rightCenter.style.left.replace('px' , '')) : 0;
			
			if(crop._default.square){
				//正方形模式
				//中间点不变化
				if(hasClass(me,'center')){
					return;
				}
				//计算移动后的宽度,高度
				if(hasClass(me,'right')){
					var width = nowX - leftCenter.offsetLeft;
				} else {
					var width = rightCenter.offsetLeft-nowX;
				}
				if(hasClass(me,'top')){
					var height = bottomCenter.offsetTop-nowY;
				} else {
					var height = nowY - topCenter.offsetTop;
				}
				//判断是否超出大小
				if(width > crop._default.maxWidth || width < crop._default.minWidth || height > crop._default.maxHeight || height < crop._default.minHeigth){
					return;
				}
				if(width>height){
					var offset = width-height;
					if(hasClass(me,'left'))
						nowX += offset;
					else
						nowX -= offset;
				} else {
					var offset = width-height;
					if(hasClass(me,'top')){
						nowY -= offset;
					} else {
						nowY += offset;
					}
				}
			}
			if(me.className.toLowerCase().indexOf('right') != -1){
				//right
				right=nowX;
				if(!crop.thePointCanMove(left,right,top,bottom)){
					return false;
				}
				rightTop.style.left = nowX-pointWidth/2+'px';
				rightCenter.style.left = nowX-pointWidth/2+'px';
				rightBottom.style.left = nowX-pointWidth/2+'px';
				var centerLeft = leftTop.offsetLeft+(rightTop.offsetLeft-leftTop.offsetLeft)/2;
				topCenter.style.left= centerLeft+'px';
				bottomCenter.style.left= centerLeft+'px';
			}
			if(me.className.toLowerCase().indexOf('top') != -1){
				//up
				top=nowY;
				if(!crop.thePointCanMove(left,right,top,bottom)){
					return false;
				}
				var center = nowY+(leftBottom.offsetTop-nowY)/2;
				rightTop.style.top = nowY-pointWidth/2+'px';
				leftTop.style.top = nowY-pointWidth/2+'px';
				topCenter.style.top= nowY-pointWidth/2+'px';
				rightCenter.style.top=center+'px';
				leftCenter.style.top=center+'px';
			}
			if(me.className.toLowerCase().indexOf('left') != -1){
				//left
				left=nowX;
				if(!crop.thePointCanMove(left,right,top,bottom)){
					return false;
				}
				leftTop.style.left = nowX+pointWidth/2+'px';
				leftCenter.style.left=nowX+pointWidth/2+'px';
				leftBottom.style.left = nowX+pointWidth/2+'px';
				var centerLeft = leftTop.offsetLeft+(rightTop.offsetLeft-leftTop.offsetLeft)/2;
				topCenter.style.left= centerLeft+'px';
				bottomCenter.style.left= centerLeft+'px';
			}
			if(me.className.toLowerCase().indexOf('bottom') != -1){
				//bottom
				bottom = nowY;
				if(!crop.thePointCanMove(left,right,top,bottom)){
					return false;
				}
				var center = leftTop.offsetTop+(nowY -leftTop.offsetTop)/2;
				rightBottom.style.top = nowY-pointWidth/2+'px';
				leftBottom.style.top = nowY-pointWidth/2+'px';
				bottomCenter.style.top= nowY-pointWidth/2+'px';
				rightCenter.style.top=center+'px';
				leftCenter.style.top=center+'px';
			}
			crop.setClip();
		}
		var imgMove = function(e){
			movePoint.call(pointBox,e);
		}
		var close = function(){
			pointBox.removeEventListener('mousemove' , movePoint);
			pointBox.removeEventListener('mouseup' , close);
			img1.removeEventListener('mousemove',imgMove);
		};

		pointBox.addEventListener('mousemove' , movePoint);
		pointBox.addEventListener('mouseup', close);
		img1.addEventListener('mousemove',imgMove);
		img1.addEventListener('mouseup', close);
	};
	var arr = document.getElementsByClassName('point');
	for(var i=0;i<arr.length;i++){
		var a = arr[i];
		a.addEventListener('mousedown' , mousedown);
	}
	this.bindAllPointMove();
}
/**
 * 绑定点击移动所有点的事件
 */
ImageCrop.prototype.bindAllPointMove = function(){
	var crop = this;
	var box =this.box.querySelector(".show-rect");
	var pointBox = this.box.childNodes[0];
	box.addEventListener("mousedown", function(e){
		e.preventDefault();
		var me = this;
		if(e.target != me){
			return;
		}
		var oldX = e.layerX;
		var oldY = e.layerY;
		
		var move = function(e){
			e.preventDefault();
			var x = e.layerX;
			var y = e.layerY;
			point = {
				x:x-oldX,
				y:y-oldY,
			};
			crop.moveAllPoint(point);
			oldX = x;
			oldY = y;
			return false;
		};
		box.addEventListener("mousemove" , move);
		box.addEventListener("mouseup", function(){
			box.removeEventListener("mousemove" , move);
		});
	});
};
ImageCrop.prototype.setClip = function(){
	var img = this.box.querySelector(".show-rect");
	var leftTop = this.box.querySelector(".leftTop");
	var rightBottom = this.box.querySelector(".rightBottom");
	var clip = [leftTop.style.top,rightBottom.style.left,rightBottom.style.top,leftTop.style.left];
	img.style.clip = 'rect('+clip.join(',')+')';
}
ImageCrop.prototype.moveAllPoint = function(point){
	var crop = this;
	var pointBox = this.box.childNodes[0];
	var childrens = pointBox.children;
	var moveIfInPointBox = function(){
		for(var i=0;i<childrens.length;i++){
			var tempX = childrens[i].style.left.replace('px' , '') ? parseInt(childrens[i].style.left.replace('px' , '')) : 0;
			var tempY = childrens[i].style.top.replace('px' , '') ? parseInt(childrens[i].style.top.replace('px' , '')) : 0;
			if(tempX+point.x > pointBox.offsetWidth || tempY+point.y > pointBox.offsetHeight){
				return true;
			}
			if(tempX+point.x < 0 || tempY+point.y < 0){
				return true;
			}
		}
		for(var i=0;i<childrens.length;i++){
			var tempX = childrens[i].style.left.replace('px' , '') ? parseInt(childrens[i].style.left.replace('px' , '')) : 0;
			var tempY = childrens[i].style.top.replace('px' , '') ? parseInt(childrens[i].style.top.replace('px' , '')) : 0;
			childrens[i].style.left = tempX+point.x+'px';
			childrens[i].style.top = tempY+point.y+'px';
		}
		crop.setClip();
	};
	moveIfInPointBox();
};
/* 返回裁剪位置 */
ImageCrop.prototype.position = function(){
	var pointBox = this.box.childNodes[0];
	var leftTop = pointBox.children[0];//左上点
	var leftBottom = pointBox.children[2];//左下点
	var rightTop = pointBox.children[3];//右上
	var rightBottom = pointBox.children[5];//右下
	return {
		x:parseFloat(leftTop.style.left),
		y:parseFloat(leftTop.style.top),
		width:parseFloat(rightBottom.style.left)-parseFloat(leftTop.style.left),
		height:parseFloat(rightBottom.style.top)-parseFloat(leftTop.style.top),
	};
}
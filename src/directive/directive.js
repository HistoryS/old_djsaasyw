import Vue from 'vue'
import location         from '../location/location.js';

//拖拽
Vue.directive('drag',{
	inserted:function (el) {
		var el=$(el).find('.el-dialog')[0]
		var bar=$(el).find('.el-dialog__header')[0];
		var params = {
			left: 0,
			top: 0,
			currentX: 0,
			currentY: 0,
		};
		// var bar=$(el).find('.drag')[0];
		//获取相关CSS属性
		var getCss = function(o,key){
			return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];
		};
		//拖拽的实现

		//o是移动对象
		bar.onmousedown = function(event){
			if(getCss(el, "left") !== "auto"){
				params.left =el.offsetLeft;
			}
			if(getCss(el, "top") !== "auto"){
				params.top =el.offsetTop;
			}
			if(!event){
				event = window.event;
				//防止IE文字选中
				bar.onselectstart = function(){
					return false;
				}
			}
			var e = event;
			var width=$(el).width()/2;
			var height=$(el).height();
			params.currentX = e.clientX;
			params.currentY = e.clientY;
			// disX = event.clientX - oDrag.offsetLeft;    
			// disY = event.clientY - oDrag.offsetTop;
			// console.log(params.left)
			$(document).mousemove(function(event){
				var e = event ? event: window.event;
				var nowX = e.clientX;
				var nowY = e.clientY;
				var disX = nowX - params.currentX;
				var disY = nowY - params.currentY;
				if (parseInt(params.left) + disX-width>=0&&parseInt(params.left) + disX+width<=window.innerWidth) {
					el.style.left = parseInt(params.left) + disX + "px";
				}else if (parseInt(params.left) + disX-width<=0) {
					el.style.left =width+'px';
				}else if (parseInt(params.left)+disX+width>=window.innerWidth) {
					el.style.left =window.innerWidth-width+'px';
				}
				if (parseInt(params.top) + disY>=0&&parseInt(params.top) + disY +height<=$(window).height()) {
					el.style.top = parseInt(params.top) + disY + "px";
				}else if (parseInt(params.top) + disY<=0){
					el.style.top='0px';
				}else if (parseInt(params.top) + disY +height>=$(window).height()) {
					el.style.top=$(window).height()-height+'px';
				}
				// if (typeof callback == "function") {
				// callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
				// }
			})
			document.onmouseup = function(){
				$(document).unbind('mousemove');
				if(getCss(el, "left") !== "auto"){
					params.left = getCss(el, "left");
				}
				if(getCss(el, "top") !== "auto"){
					params.top = getCss(el, "top");
				}
			};
		};


	}
})
//滚动加载
Vue.directive('scroll',{
	inserted:function (el,binding) {
		var box=$(el).find('.el-table__body-wrapper');
		var table=box.find('table');
		function throttle(func, wait, mustRun) {
			var timeout,
				startTime = new Date();
			return function() {
				var context = this,
					args = arguments,
					curTime = new Date();
				clearTimeout(timeout);
				// 如果达到了规定的触发时间间隔，触发 handler
				// if(curTime - startTime >= mustRun){
				if(false){
					func.apply(context,args);
					startTime = curTime;
				// 没达到触发间隔，重新设定定时器
				}else{
					timeout = setTimeout(func, wait);
				}
			};
		};
		function realFunc(){
			if(box.scrollTop() + box.height() >= table.height()*.6) {
			   binding.value();
			}
		}
		box.scroll(throttle(realFunc,350,666));
	}
})


//全局混合
Vue.mixin({
	methods:{
		//弹框显示
		show_alert(obj){
		    this.$set(this.alert,obj,true)
		},
		//弹框隐藏
		hide_alert(obj){
		    this.$set(this.alert,obj,false)
		},
		//提交表单验证
		submitForm(formName,fun,can) {
			//formName 表单名称
			//fun      回调函数
			// can     是否消失
			// fun&&this[fun]();
			// return false;
		    this.$refs[formName].validate((valid) => {
		      if (valid) {
		        //提交成功方法
		        if (can) {
		        	new Promise((resolve,reject)=>{
		        		fun&&this[fun](resolve,reject);
		        	}).then(()=>{
		        		this.resetForm(formName,can)
		        	})

		        }else{
	        		new Promise((resolve,reject)=>{
	        			fun&&this[fun](resolve,reject);
	        		}).then(()=>{
	        			this.resetForm(formName)
	        		}, ()=>{
	        			console.log('错误')
	        		})
		        }
		      } else {
		        return false;
		      }
		    });
		},
		//重置表单
		resetForm(formName,who) {
			if (who) {
				if (typeof(this[who])=='function') {
					this.$refs[formName].resetFields();
					this[who](true)
				}else{
					this.alert[who]=false;
					setTimeout(()=>{
						this.$refs[formName].resetFields();
					},350)
				}
			}else{
				this.$refs[formName].resetFields();
			}
		},
		//获得当前月份
		getMonth: function() {
			var month = new Date().getMonth() + 1;
			month = month >= 10 ? month : '0' + month;
			var nowDate = new Date().getFullYear() + '-' + month;
			return nowDate;
		},
        //深拷贝对象
        copy(obj){
        	return JSON.parse(JSON.stringify(obj))
        },
        //千位分割
        toThousands(num) {
            num+=''
            num=num.split('.')
            if (num[1]) {
                return num[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+'.'+num[1]
            }
            return num[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        },
	}
})

//递归导航栏
Vue.component('sr-nav', {
	name: 'sr-nav',
	props: ['data'],
	template: 	`
				<div >
				   	<el-submenu :key="li.urlAdress" :index="li.urlAdress" v-for="li in data" v-if="li.data">
				        <template slot="title"><i v-if="li.imageSrc" :class="li.imageSrc"></i>{{li.menuName}}</template>
                    	<sr-nav :data="li.data"></sr-nav>
				  	</el-submenu>
				  	<el-menu-item :index="li.urlAdress" v-else="li.data">{{li.menuName}}</el-menu-item>
				</div>
				`
})
//开始结束日期渲染
// Vue.directive("")

// //创建之前data和$el都还未初始化
// beforeCreate() {
//     console.log(1)
// },
// //表示创建了data还未渲染$el
// created(){
//     console.log(2)
// },
// //data和$el都已经渲染但是数据还未同步到dom
// beforeMount(){
//     console.log(3)
// },
// //数据也渲染完成
// mounted(){
//     console.log(4)
// },
// //数据更新前
// beforeUpdate(){
//     console.log(5)
// },
// //数据更新完成
// updated(){
//     console.log(6)
// },
// //组件销毁前
// beforeDestory(){
//     console.log(7)
// },
// //组件销毁完成
// destoryed(){
//     console.log(8)
// }
//方法
//methods:{
//    console.log(9)
// }
//计算属性
// computed:{
// }


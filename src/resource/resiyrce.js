import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueResource 		from 'vue-resource'
Vue.use(VueAxios, axios)

// Vue.use(VueResource)
var el = new Vue({ data: { message: 'Hello Vue!' } })

axios.interceptors.response.use(response => {
    response.body = response.data;
    if (response.status == '200' && typeof(response.body) === 'string') {
        response.body = JSON.parse(response.body)
    }
    if (response.body.httpCode !== 'OK') {
        el.$confirm(response.body.message, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
        }).then(() => {}).catch(() => {});
        throw '服务器端错误请联系:15157122161';
    }
    return response;
}, error => {
    return Promise.reject(error);
});





// Vue.http.interceptors.push((reques,next)=>{
// 	//请求前操作
// 	next((response)=>{
// 		if (response.status=='200'&&typeof(response.body)==='string') {
// 			// try{
// 				// console.log(response)
// 				response.body=JSON.parse(response.body)
// 				// console.log(response)
// 			// }catch(arr){
// 			// 	console.log(response.data.body)
// 			// 	console.log(arr);
// 			// }
// 		}
// 		if (response.body.httpCode!=='OK') {
// 			    // el.$message({
// 			    //     type: 'error',
// 			    //     message: response.body.message,
// 			    //    	duration:1000
// 			    // });
// 			    el.$confirm(response.body.message, '提示', {
// 			              confirmButtonText: '确定',
// 			              // cancelButtonText: '取消',
// 			              showCancelButton:false,
// 			              type: 'warning'
// 			            }).then(() => {
// 			            }).catch(() => {
// 			            });
// 			    // return false;
// 			    throw '服务器端错误请联系:15157122161';

// 		}
// 		return response
// 	})
// })

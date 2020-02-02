import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const state={
	pageSize:100,
	//系统标识
	platform:"PLA",			//平台
	radiation:"RIS",		//放射
	ultrasonic:"UIS",		//超声
	endoscopic:"EIS",		//内镜
	ecg:"ECG",				//心电
	pathology:"PIS",		//病理
	eye:"OCT",				//眼科
	clinical:"CIS",			//临床
	other:"OTH",			//其他
}


const mutations={

}
const store = new Vuex.Store({
	state,
	mutations
})


export default store

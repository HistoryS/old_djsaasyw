//测试地址
// const title='http://192.168.0.68:8080/sosoapi-web/pass/mock/3/';
//联调地址
const title='http://192.168.0.68:8081/';       //测试服务器
// const title='http://192.168.0.188:8011/';   //王辉
// const title='http://192.168.0.76:8011/';    //高笑

// const title='http://192.168.0.6:8011/';         //聂

// const title="/"
//系统

const location = {
	//用户登录信息
	getUserDataAndTreeData:                     title + 'pla/getUserDataAndTreeData',
    logout:                                     title + 'logout',                                           //登出
    updatePassword:                             title + 'pla/updatePassword',                               //修改密码
	//系统管理-地区管理
	loadLeftAreaManager: 						title +  'pla/loadLeftAreaManager',							//获取地区树形
	loadAreaManagers: 							title +  'pla/loadAreaManagers', 							//获取地区管理列表
	//系统管理-用户管理
	getPlaUserInfos: 							title +	'pla/getPlaUserInfos',								//搜索用户
	deleteUserInfo: 							title +	'pla/deleteUserInfo', 								//删除用户
	addUserInfo: 								title + 'pla/addUserInfo', 									//新建用户
	updateUserInfo: 							title + 'pla/updateUserInfo', 								//编辑用户
	createUsername: 							title +	'pla/createUsername', 								//获取用户名
	resetUserInfoPassword: 						title +	'pla/resetUserInfoPassword', 						//重置密码
	//系统管理-院区管理
	loadProvince: 								title +	'pla/loadProvince',									//获取所有省份
	loadCity: 									title +	'pla/loadCity',										//获取下级市
	loadTown: 									title +	'pla/loadTown',	   									//获取下级镇区
	deletePlaHospitalManager:					title +	'pla/deletePlaHospitalManager', 					//删除院区
	findPlaHospitals: 							title +	'pla/findPlaHospitals',								//查询院区
	findPlaHospitalManagerUser: 				title + 'pla/findPlaHospitalManagerUser', 					//查看管理员
	updatePlaHospitalManagerUserPassword: 		title +	'pla/updatePlaHospitalManagerUserPassword',			//重置管理员密码
	findPlaHospitalManager: 					title +	'pla/findPlaHospitalManager', 						//查看院区
	loadPlaHospitalLogo: 					    title +	'pla/loadPlaHospitalLogo', 					 		//上传院区logo
    insertPlaHospitalManager:                   title + 'pla/insertPlaHospitalManager',                     //新建院区
    updatePlaHospitalManager:                   title + 'pla/updatePlaHospitalManager',                     //修改院区
    loadLeftHospotalMenu:                       title + 'pla/loadLeftHospotalMenu',                         //获取已有院区地区
    loadHighHospotalTree:                       title + 'pla/loadHighHospotalTree',                         //获取已有院区地区
	//系统管理-平台字典
	loadSysDataDic: 							title +	'pla/loadSysDataDic',								//获取平台字典
	loadSysDataDicValue: 						title +	'pla/loadSysDataDicValue',							//获取平台字典下属数据
    insertSysDataDicValue:                      title + 'pla/insertSysDataDicValue',                        //新建平台字典
    updateSysDataDicValue:                      title + 'pla/updateSysDataDicValue',                        //修改平台字典
    deleteSysDataDicValue:                      title + 'pla/deleteSysDataDicValue',                        //删除平台字典
	//系统管理-平台参数
	loadPlaParameter: 							title +	'pla/loadPlaParameter',								//查询平台参数
    updateParameter:                            title + 'pla/updateParameter',                              //修改平台参数
	//系统管理-日志设置
	loadServerLog: 								title +	'pla/loadServerLog',								//查询日志参数
    //系统管理-角色管理
    queryRoleMananger:                          title + 'pla/queryRoleMananger',                            //查询角色
    getRoleManangers:                           title + 'pla/getRoleManangers',                             //查询角色下拉框
    addRoleMananger:                            title + 'pla/addRoleMananger',                              //新增保存角色
    updateRoleMananger:                         title + 'pla/updateRoleMananger',                           //编辑角色
    deleteRoleMananger:                         title + 'pla/deleteRoleMananger',                           //删除角色
    // -----------------------------------------------sr----------------------------------------------------//



  // --------------------------------------------------------una--------------------------------------------------------------------------------
    //放射设置-其他设置-检查参数
    deleteExamParameter:                                    title +  'pla/deleteExamParameter',             //删除检查参数
    addExamParameter:                                       title +  'pla/addExamParameter',                 //新建检查参数
    updateExamParameter:                                    title +  'pla/updateExamParameter',            //编辑检查参数

    //放射设置-其他设置-检查类型

    loadExamineType:                                        title +  'pla/loadExamineType',                    //列表显示
    deleteExamineType:                                      title +  'pla/deleteExamineType',                 //删除检查类型
    insertExamineType:                                      title +  'pla/insertExamineType',                  //新增检查类型
    updateExamineType:                                      title +  'pla/updateExamineType',                //修改检查类型

    //放射设置-其他设置-检查项目
    loadExamineItem:                                        title +  'pla/loadExamineItem',                      //列表显示
    deleteExamineItem:                                      title +  'pla/deleteExamineItem',                   //删除检查项目
    insertExamineItem:                                      title +  'pla/insertExamineItem ',                   //新增检查项目
    updatetExamineItem:                                     title +  'pla/updatetExamineItem',                 //修改检查项目

    //放射设置-其他设置-就诊类别
    loadStayInsu:                                           title +  'pla/loadStayInsu',                             //列表显示
    deleteStayInsu:                                         title +  'pla/deleteStayInsu',                          //删除就诊类别
    insertStayInsu:                                         title +  'pla/insertStayInsu',                           //新增就诊类别
    updateStayInsu:                                         title +  'pla/updateStayInsu',                         //修改就诊类别
  // --------------------------------------------------------una--------------------------------------------------------------------------------




    // --------------------------------------------------------cy--------------------------------------------------------------------------------
    //放射设置-系统设置-放射插件
    queryMenuManager:    			title +  'pla/queryMenuManager',         //搜索放射插件
    addContrastAgentInfo:			title +  'pla/addContrastAgentInfo',		//新建造影剂
    queryMenuManagerTree:           title +  'pla/queryMenuManagerTree',		//放射插件树
    //放射设置-模板设置-常用符号
    loadCommonSign:                 title +  'pla/loadCommonSign',			//查询常用符号
    // loadExamineType:                title +  'pla/loadExamineType',    		   //查询检查类型
    insertCommonSign:				title +  'pla/insertCommonSign',			//新增检查类型
	updateCommonSign:				title +  'pla/updateCommonSign',			//修改检查类型
	deleteCommonSign:				title +  'pla/deleteCommonSign',			//删除检查类型
	//放射设置-其他设置-造影剂
	queryContrastAgentInfo:         title +  'pla/queryContrastAgentInfo',	//搜索造影剂
	queryConAgentParam:         	title +  'pla/queryConAgentParam',		//搜索造影剂参数
	// addContrastAgentInfo:           title +  'pla/addContrastAgentInfo',		//新建造影剂
	addConAgentParam:         		title +  'pla/addConAgentParam',			//新建造影剂参数
	updateContrastAgentInfo:        title +  'pla/updateContrastAgentInfo',	//修改造影剂
	updateConAgentParam:         	title +  'pla/updateConAgentParam',		//修改造影剂参数
	deleteContrastAgentInfo:        title +  'pla/deleteContrastAgentInfo',	//删除造影剂
	deleteConAgentParam:         	title +  'pla/deleteConAgentParam',		//删除造影剂参数
    // --------------------------------------------------------cy--------------------------------------------------------------------------------





    // --------------------------------------------------------zxj--------------------------------------------------------------------------------

    loadQuickWriteTemplate:         title + 'pla/loadQuickWriteTemplate', // 查询快速书写模板
    // loadExamineType:                title + 'pla/loadExamineType',// 查询检查类型
	insertQuickWriteTemplate:		title + 'pla/insertQuickWriteTemplate', // 新建快速书写模版
	updateQuickWriteTemplate:		title+'pla/updateQuickWriteTemplate',// 更新快速书写模版
    deleteQuickWriteTemplate:		title+'pla/deleteQuickWriteTemplate',// 删除快速书写模版
    queryExamineBodyPart:           title+'pla/queryExamineBodyPart',// 搜索检查部位
    loadWriteTemplate:              title+'pla/loadWriteTemplate', // 搜索报告书写模版
    insertWriteTemplate:            title+'pla/insertWriteTemplate', // 新增报告书写模版
    deleteWriteTemplate:            title+'pla/deleteWriteTemplate', // 删除报告书写模版
    updateWriteTemplate:            title+'pla/updateWriteTemplate', // 编辑报告书写模版
    queryQCScoreTemplate:           title+'pla/queryQCScoreTemplate', // 搜索质控评分模版
    queryQCScoreNorm:               title+'pla/queryQCScoreNorm', // 搜索指标管理模版
    addQCScoreTemplate:             title+'pla/addQCScoreTemplate', // 新建质控评分模版
    updateQCScoreTemplate:          title+'pla/updateQCScoreTemplate', // 编辑质控评分模版
    deleteQCScoreTemplate:          title+'pla/deleteQCScoreTemplate', // 删除质控评分模版
    addQCScoreNorm:                 title+'pla/addQCScoreNorm', // 新建指标
    updateQCScoreNorm:              title+'pla/updateQCScoreNorm', // 编辑指标
    deleteQCScoreNorm:              title+'pla/deleteQCScoreNorm', // 删除指标

    deleteExamineBodyPart:          title+'pla/deleteExamineBodyPart',// 删除检查部位
    queryExamPartSplit:             title+'pla/queryExamPartSplit', // 搜索拆分部位
    addExamPartSplit:               title+'pla/addExamPartSplit',// 新建拆分部位
    updateExamPartSplit:            title+'pla/updateExamPartSplit',// 编辑拆分部位
    deleteExamPartSplit:            title+'pla/deleteExamPartSplit',// 删除拆分部位
    queryExamParameter:             title+'pla/queryExamParameter',// 查询部位参数
    querySpliteExamPartParam:       title+'pla/querySpliteExamPartParam', // 搜索部位参数
    addSpliteExamPartParam:         title+'pla/addSpliteExamPartParam',// 新建部位参数
    updateSpliteExamPartParam:      title+'pla/updateSpliteExamPartParam',// 修改部位参数
    deleteSpliteExamPartParam:      title+'pla/deleteSpliteExamPartParam',// 删除部位参数
    addExamineBodyPart:             title+'pla/addExamineBodyPart',// 新建检查部位
    updateExamineBodyPart:          title+'pla/updateExamineBodyPart',// 编辑检查部位
    getExamineTypeAndPartVoList:    title+'pla/getExamineTypeAndPartVoList',// 检查部位加载树形
    getParentPart:                  title+'pla/getParentPart',// 获取父级部位
    getExaminePartAndChildParts:    title+'pla/getExaminePartAndChildParts',// 报告书写级联

    // --------------------------------------------------------zxj--------------------------------------------------------------------------------
}
// location.concat(system);



export default location




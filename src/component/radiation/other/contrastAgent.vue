<template>
	<section class="contrastAgent">
		<header class="this_header">
			<el-breadcrumb separator="/" class="crumbs">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>放射设置</el-breadcrumb-item>
				<el-breadcrumb-item>其他</el-breadcrumb-item>
				<el-breadcrumb-item>造影剂</el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<section class="topCy">
			<h2 class="total">
				<el-breadcrumb-item>造影剂</el-breadcrumb-item>
				<el-button type="primary" @click="alert.newAgent = true;saveandnew=true;" class="btn">新建
				</el-button>
				<el-button class='refresh' type="info" @click="loadTableData_top(true);tableData=[]" :plain="true">
					刷新
				</el-button>
				造影剂共 <em class="em">{{count_top}}</em> 条记录
			</h2>
			<section class="this_section">
				<template>
					<el-table @row-dblclick="dataLoad" highlight-current-row @current-change="handleCurrentChange" v-scroll="loadTableData_top" stripe class="this_table" :data="tableData_top" border stripe style="width: 100%"
							  height="100%">
						<el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="180">
							<template scope="scope">
								<el-button class="btnCy" size="mini" :plain="true" type="success" icon="edit"
										   @click.stop="dataLoad(scope.$index,true)"></el-button>
								<el-button class="btnCy" size="mini" :plain="true" type="danger" icon="delete"
										   @click.stop="which=true;del(scope.$index);"></el-button>
							   <!--  <el-button class="btnCy" size="mini" :plain="true" type="success" icon="caret-top"
										   @click.stop="up(scope.$index)"></el-button>
								<el-button class="btnCy" size="mini" :plain="true" type="success" icon="caret-bottom"
										   @click.stop="down(scope.$index)"></el-button> -->
							</template>
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="conAgentName" label="造影剂">
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="isDefault" label="是否默认">
							<template scope="scope">
								<span :style="{color:scope.row.isDefault=='否'?'':'#009933'}">{{scope.row.isDefault}}</span>
							</template>
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="other" label="">
						</el-table-column>
					</el-table>
				</template>
			</section>
		</section>
		<section class="botCy">
			<h2 class="total">
				<el-breadcrumb-item>造影剂参数</el-breadcrumb-item>
				<el-button type="primary" @click="alert.newdata = true;saveandnew=true;" :disabled="!currentRow" class="btn">新建</el-button>
				<el-button class='refresh' type="info" @click="loadTableData_bot(true)" :disabled="!currentRow" :plain="true">
					刷新
				</el-button>
				造影剂参数共 <em class="em">{{count_bot}}</em> 条记录
			</h2>
			<section class="this_section">
				<template>
					<el-table highlight-current-row @row-dblclick="test" v-scroll="loadTableData_bot" stripe class="this_table" :data="tableData" border stripe style="width: 100%"
							  height="100%">
						<el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="180">
							<template scope="scope">
								<el-button class="btnCy" size="mini" :plain="true" type="success" icon="edit"
										   @click="test(scope.$index)"></el-button>
								<el-button class="btnCy" size="mini" :plain="true" type="danger" icon="delete"
										   @click="which=false;del(scope.$index)"></el-button>
							</template>
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="conAgentType" label="参数类型">
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="conAgentParam" label="参数">
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="isDefault" label="是否默认">
							<template scope="scope">
								<span :style="{color:scope.row.isDefault=='否'?'':'#009933'}">{{scope.row.isDefault}}</span>
							</template>
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" prop="others" label="">
						</el-table-column>
					</el-table>
				</template>
			</section>
		</section>
		<!-- 弹窗 -->
		<div class="alert
">
			<!-- 造影剂 -->
			<el-dialog @close="resetForm('form')" v-drag size="tiny" :title="saveandnew?'新建造影剂':'编辑造影剂'" v-model="alert.newAgent" :close-on-click-modal="false">
				<el-form label-position="right" :model="form" :rules="rules" label-width="120px" ref='form'>
					<el-row>
						<el-col :span="24" >
							<el-form-item label="造影剂:" prop="conAgentName">
								<el-input v-model="form.conAgentName" ></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item prop="isDefault">
								<el-checkbox v-model="form.isDefault" :true-label="1" :false-label="0">默认</el-checkbox>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="which=true;submitForm('form','saveFrom_top','newAgent');">保 存
					</el-button>
					<el-button type="primary" @click="which=true;submitForm('form','saveFrom_top');" v-if="saveandnew">
						保存并新建
					</el-button>
					<el-button @click="alert.newAgent=false">取 消</el-button>
				</div>
			</el-dialog>
			<!-- 造影剂参数 -->
			<el-dialog @close="resetForm('form_bot')" v-drag size="tiny" :title="saveandnew?'新建造影剂参数':'编辑造影剂参数'" v-model="alert.newdata" :close-on-click-modal="false">
				<el-form label-position="right" :model="form_bot" ref='form_bot' :rules="rules" label-width="120px">
					<el-row>
						<el-col :span="24">
							<el-form-item label="造影剂:" prop="">
								<span>{{this.agent}}</span>
							</el-form-item>
						</el-col>
					</el-row>
					
					<el-row>
						<el-col :span="24">
							<el-form-item label="参数类型:" prop="conAgentType">
								<el-select :disabled='!saveandnew' v-model="form_bot.conAgentType">
									<el-option v-for="item in option" :label="item.dataDicValueName" :value="item.id"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="参数:" prop="conAgentParam">
								<el-input v-model="form_bot.conAgentParam"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item prop="isDefault">
								<el-checkbox v-model="form_bot.isDefault" :true-label="1" :false-label="0">默认</el-checkbox>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="which=false;submitForm('form_bot','saveFrom_bot','newdata')">保 存
					</el-button>
					<el-button type="primary" @click="which=false;submitForm('form_bot','saveFrom_bot');" v-if="saveandnew">保存并新建
					</el-button>
					<el-button @click="alert.newdata=false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
	</section>
</template>
<script>
import location         from '../../../location/location.js';
import {
	mapState
} from 'vuex';
	export default {
		data() {
			return {
				// 条目总数
				count_top: 0,
				count_bot: 0,
				// 页码
				page: 0,
				page_bot:0,
				// 当前被编辑行的索引
				editorIndex:0,
				agent:'',
				input: '',
				formLabelWidth: '120px',
				saveandnew:false,
				which:false,
				// 弹出框
				alert:{
					newAgent: false,
					newdata: false
				},
				id:'',
				// 被点击那行的数据
				currentRow: null,
				// 表单验证规则
				rules: {
					conAgentName: [{
						required: true,
						message: '请输入造影剂名称',
						trigger: 'blur'
					}],
					conAgentType: [{
						required: true,
						message: '请选填写参数类型',
						trigger: 'change'
					}],
					conAgentParam: [{
						required: true,
						message: '请选择参数',
						trigger: 'blur'
					}]
				},
				// 造影剂的表单
				form: {
					conAgentName:'',
					conAgentType:'',
					isDefault:0
				},
				// 造影剂参数的表单
				form_bot: {
					conAgentParam:'',
					conAgentType:'',
					isDefault:0
				},
				// 参数类型的下拉数据
				option: [],
				// 造影剂的table表格
				tableData_top: [],
				// 造影剂参数的table表格
				tableData: []
			};
		},
		computed: {
			...mapState([
				"pageSize",
				"radiation",
				"platform",
			])
		},
		created(){
			//初始化造影剂的页面数据
			this.loadTableData_top(true);
			//初始化带下拉菜单的下拉选项
			this.loadOptionsData();
		},
		methods: {
			//发送页面的操作信息
			showMsg(type, message){
				this.$message({type, message,duration:1000});
			},
			//编辑时加载数据到编辑框
			dataLoad(index,isInfo){
				this.alert.newAgent = true;
				this.saveandnew = false;
				this.editorIndex=index; 
				if(isInfo){
					setTimeout(() => {
						this.form = isNaN(index)?this.copy(index):this.copy(this.tableData_top[index]);
					}, 0);
				}else{  
					setTimeout(() => {
						this.form_bot = isNaN(index)?this.copy(index):this.copy(this.tableData[index]);
					}, 0);
				}
			},
			test(index){
				this.alert.newdata = true;
				setTimeout(() => {
						this.form_bot = isNaN(index)?this.copy(index):this.copy(this.tableData[index]);
					}, 0);
			},
			//删除当前点击的此行的所有元素
			del(index){
				let url;
				let name;
				let ID;
				let count;
				let table;
				if(this.which){
					name=this.tableData_top[index].conAgentName;
					url=location.deleteContrastAgentInfo;
					ID=this.tableData_top[index].id
					count=this.count_top;
					table=this.tableData_top;
				}else{
					name=this.tableData[index].conAgentType;
					url=location.deleteConAgentParam;
					ID=this.tableData[index].id
					count=this.count_bot;
					table=this.tableData;
				}
				this.$confirm(`您确认要删除“${name}”？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.get(url,{
						params:{
							id: ID
						}
					}).then(data => {
						data=data.body;
						this.showMsg('success', '删除成功！');
						console.log(index)
						console.log(table)
						table.splice(index,1)
						count--;
					});
				});
			},
			// 加载下拉条件数据
			loadOptionsData() {
				this.$http.get(location.loadSysDataDicValue,{
					params:{
						dataDicCode:'contrastAgentParamType',
						forTpye:1
					}
				}).then(data => {
					console.log(data)
					this.option = data.body.data.data || [];
				})
			},
			//造影剂刷新页面
			loadTableData_top(reload) {
				reload ?this.page = 0 : this.page ++;
				this.$http.get(location.queryContrastAgentInfo,{
					params:{
						page:this.page,
						pageSize:this.pageSize,
						count: -1,
						systemID:this.radiation
					}
				}).then(data => {
					data=data.body;
					var list=data.data.data;
					for(var i=0;i<list.length;i++){
						list[i].isDefault=list[i].isDefault=="0"?"否":"是";
					}
					if (reload) {
						this.tableData_top = data.data.data || []; 
						this.count_top = data.data.count;
					}
					else {
						this.tableData_top.push(...data.data.data);
					}
				});
			},
			//造影剂参数刷新页面
			loadTableData_bot(reload) {
				if (!this.currentRow)return;
				 reload ?this.page_bot= 0 : this.page_bot ++;
				this.$http.get(location.queryConAgentParam,{
					params:{
						page: this.page_bot,
						pageSize: this.pageSize,
						count: -1,
						conAgentID:this.currentRow.id,
					}
				}).then(data => {
					data=data.body;
					var list=data.data.data;
					for(var i=0;i<list.length;i++){
						list[i].isDefault=list[i].isDefault=="0"?"否":"是";
					}
					if (reload) {
						this.tableData = data.data.data|| []; 
						this.count_bot = data.data.count;
					}
					else {
						this.tableData.push(...data.data.data);
					}
				});
			},
			// 保存造影剂的表单
			saveFrom_top(resolve){
				let url_add;
				let url_edi;
				url_add=location.addContrastAgentInfo;
				url_edi=location.updateContrastAgentInfo;
				//保存编辑造影剂
				if (!this.saveandnew) {
					let data = this.copy(this.form);
					data.isDefault=data.isDefault=="否"?"0":"1";
					this.$http.post(url_edi,{
						id:data.id,
						conAgentName:data.conAgentName,
						isDefault:data.isDefault,
						systemID:this.radiation,
					}).then(data => {
						this.showMsg('success', '保存成功！');
						this.loadTableData_top(true);
						resolve();
					})
				} //保存新建造影剂
				else {
					let data = this.copy(this.form);
					this.$http.post(url_add, {
						conAgentName:data.conAgentName,
						isDefault:data.isDefault,
						systemID:this.radiation,
					}).then(data => {
						this.showMsg('success', '保存成功！');
						this.loadTableData_top(true);
						resolve();
					})
				}
			},
			// 保存造影剂参数的表单
			saveFrom_bot(resolve){
				let url_add;
				let url_edi;
				url_add=location.addConAgentParam;
				url_edi=location.updateConAgentParam;
				//保存编辑造影剂参数
				if (!this.saveandnew) {
					let data = this.copy(this.form_bot);
					data.isDefault=data.isDefault=="否"?"0":"1";
					this.$http.post(url_edi,{
						id:data.id,
						conAgentTypeID:data.conAgentTypeID,
						isDefault:data.isDefault,
						conAgentParam:data.conAgentParam
					}).then(data => {
						this.showMsg('success', '保存成功！');
						this.loadTableData_bot(true);
						resolve();
					})
				} //保存新建造影剂参数
				else {
					var this_form=this.copy(this.form_bot)
					this.$http.post(url_add, {
						conAgentID:this.id,
						conAgentTypeDicID:this_form.conAgentType,
						isDefault:this_form.isDefault,
						conAgentParam:this_form.conAgentParam
					}).then(data => {
						this.showMsg('success', '保存成功！');
						this.loadTableData_bot(true);
						resolve();
					})
				}
			},
			handleCurrentChange(val) {
				this.currentRow = val;
				this.loadTableData_bot(true);
				val?this.agent=val.conAgentName:this.tableData='';
				if(val){
					this.id=val.id;
				}
			},
		}
	};
</script>
<style lang="less">
	@import "../../../assets/css/element.less";

	.contrastAgent {
		.el-button + .el-button {
			margin-left: 1em !important;
		}
		.this_header {
			// padding-top: 10px;
			height: 30px;
			.crumbs {
				// margin: 15px 30px;
				width: 96%;
				margin: 10px auto;
			}
			.this_nav {
				background: #f2f2f2;
				width: 96%;
				margin: 10px auto;
				padding: 1em;
				padding-left: none;
				display: flex;
				align-items: center;
				.demonstration {
					margin-right: 1em;
					margin-left: 1em;
				}
				.el-input,
				.el-select {
					width: 190px;
				}
				.btn {
					margin-left: 1em;
				}
				// border-top: 1px solid rgb(238, 246, 243);
				// margin-top: 30px;
			}
		}
		.topCy {
			height: 50%;
			display: flex;
			flex-direction: column;
			width: 100%;
			.total {
				// border:1px solid red;
				font-size: 14px;
				width: 96%;
				margin: 10px auto 0;
				text-align: right;
				// letter-spacing:1px;
				.el-breadcrumb__item {
					margin-left: 15px !important;
				}
				.refresh {
					margin-right: 1em;
				}
				.el-button + .el-button {
					margin-left: 1em;
				}
			}
			.this_section {
				display: flex;
				width: 96%;
				margin: 10px auto 0;
				flex-shrink: 2;
				height: 100%;
				.this_table {
					height: 100%;
					.btnCy {
						margin-left: 0 !important;
					}
					.cell {
						text-align: center;
					}
					.icon {
						// height: 3;
						width: 20px;
						// border:1px solid red;
						&:hover {
							color: #4bc889;
						}
					}
				}
			}
		}
		.botCy {
			height: 50%;
			display: flex;
			flex-direction: column;
			width: 100%;
			.total {
				// border:1px solid red;
				font-size: 14px;
				width: 96%;
				margin: 10px auto 0;
				text-align: right;
				// letter-spacing:1px;
				.el-breadcrumb__item {
					margin-left: 15px !important;
				}
				.refresh {
					margin-right: 1em;
				}
				.el-button + .el-button {
					margin-left: 1em;
				}
			}
			.this_section {
				display: flex;
				width: 96%;
				margin: 10px auto 0;
				flex-shrink: 2;
				height: 100%;
				.this_table {
					height: 100%;
					.btnCy {
						margin-left: 0 !important;
					}
					.cell {
						text-align: center;
					}
					.icon {
						// height: 3;
						width: 20px;
						// border:1px solid red;
						&:hover {
							color: #4bc889;
						}
					}
				}
			}
		}
		.alert {
			.el-select {
				width: 100%;
			}
			.long {
				.el-input,
				.el-select {
					width: 543px;
				}
			}

			.alert_conetnt {
				width: 80%;
				margin: 0 auto;
				display: flex;
				flex-direction: column;
				.tr {
					width: 100%;
					display: flex;
					p {
						height: 60px;
						line-height: 60px;
						width: 100%;
						.long {
							width: 500px;
						}
						span {
							font-size: 16px;
						}
					}

					.td {
						height: 30px;
						line-height: 30px;
						width: 50%;
						span {
							font-size: 16px;
						}
						.reset {
							margin-left: 1em;
						}
					}
				}
			}
			.new_region {
				.label {
					width: 80px;
					text-align: right;
					vertical-align: middle;
					float: left;
					font-size: 14px;
					line-height: 1;
					padding: 11px 12px 11px 0;
				}
			}
		}
	}
</style>

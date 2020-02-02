<template>
	<section class="examineProject">
		<header class="this_header">
			<el-breadcrumb separator="/" class="crumbs">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>放射设置</el-breadcrumb-item>
				<el-breadcrumb-item>其他设置</el-breadcrumb-item>
				<el-breadcrumb-item>检查项目</el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<h2 class="total">
		<el-button type="primary" @click="show_alert(null)" class="btn tbtn">新建</el-button>
	<el-button @click="query_list(true)" class='refresh tbtn' type="primary" :plain="true" >刷新</el-button>
			</el-button>共 <em class="em">{{count}}</em> 条记录
		</h2>
		<section class="this_section">
			<template>
				<el-table highlight-current-row @row-dblclick="show_alert" v-scroll="query_list" border stripe class="this_table" :data="tableData" border height="100%" style="width: 100%;">
					<el-table-column label="操作" width="100">
						<template scope="scope">
							<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
								<el-button size="mini" :plain="true" type="success" icon="edit" @click="show_alert(scope.row,scope.$index)"></el-button>
    							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
								<el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.id,scope.$index)"></el-button>
    							</el-tooltip>
							<!-- <el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button> -->
							<!-- <el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button> -->
						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="examineType" label="检查类型" width="180">
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="examineItemCode" label="项目代码" width="180">
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="examineItem" label="检查项目" width="180">
					</el-table-column>
					<el-table-column></el-table-column>
				</el-table>
			</template>
		</section>
		<aside class="alert">
			<el-dialog @close="resetForm('formref')" v-drag size="tiny" :close-on-click-modal="false" :title="title" v-model="alert.new_examineProject">
				<el-form :model="form" :rules="rules" ref="formref" class="alert-minwidth" label-width="100px">
					<el-col :span="24">
						<el-form-item label="检查类型" prop="examineTypeID" :label-width="formLabelWidth" auto-complete="off">
							<el-select v-model="form.examineTypeID" :span="24">
								<el-option v-for="item in examinetypes" :label="item.examineType" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="项目代码" prop="examineItemCode" :label-width="formLabelWidth">
							<el-input v-model="form.examineItemCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="检查项目" prop="examineItem" :label-width="formLabelWidth">
							<el-input v-model="form.examineItem" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitForm('formref','save_examineProject','new_examineProject')" class="tbtn">保 存</el-button>
					<el-button v-show="title=='新建检查项目'" type="primary" @click=";submitForm('formref','save_examineProject')" class="tbtn">保存并新建</el-button>
					<el-button @click="alert.new_examineProject=false" class="tbtn">取 消</el-button>
				</div>
			</el-dialog>
		</aside>
	</section>
</template>
<script>
import location from '../../../location/location.js';
import { mapState } from 'vuex';
export default {
	data() {
			return {
				// 条目总数
				count: -1,
				// 页码
				page: 1,
				//刷新加载
				load: false,
				//检查类型集
				examinetypes: [],
				//弹框信息
				alert: {
					new_examineProject: false
				},
				title: '新建检查项目',
				formLabelWidth: '120px',
				rules: {
					examineTypeID: [{
						required: true,
						message: '请选择检查类型',
						trigger: 'blur'
					}],
					examineItemCode: [{
						required: true,
						message: '请输入项目代码',
						trigger: 'blur'
					}],
					examineItem: [{
						required: true,
						message: '请输入检查项目',
						trigger: 'blur'
					}]
				},
				form: {
					examineTypeID: '',
					examineItemCode: '',
					examineItem: '',
				},
				tableData: []
			};
		},
		computed: {
			...mapState([
				"pageSize",
				"platform",
				"radiation",
			])
		},
		//data已经创建,还未渲染$el
		created() {
			this.query_list(true);
			this.get_examinetypes();
		},
		methods: {
			add() {
				console.log(1)
			},
			//获取检查类型所有下拉选项
			get_examinetypes() {
				this.$http.get(location.loadExamineType, {
					params: {
						count: -1,
						systemID: this.radiation
					}
				}).then(data => {
					data = data.body.data;
					this.examinetypes = data.data;
				}, data => {
					console.log('错误')
				})
			},
			//查询列表
			query_list(can) {
				this.page++
					if (can) {
						this.page = 0
					}
				this.$http.get(location.loadExamineItem, {
					params: {
						page: this.page,
						count: -1,
						systemID: this.radiation
					}
				}).then(data => {
					data = data.body.data;
					this.count = data.count;
					if (can) {
						this.tableData = data.data || [];
						// this.$message({
						// 	type: 'success',
						// 	message: '列表加载成功!',
						// 	duration: 1000
						// });
					} else {
						this.tableData.push(...data.data)
					}

				}, data => {
					console.log('错误')
				})
			},
			//删除弹窗提示
			deleted(id, index) {
				this.$confirm('是否确认删除该条信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.get(location.deleteExamineItem, {
						params: {
							id: id,
						}
					}).then(data => {
						data = data.body;
						// if (data.httpCode == 'OK') {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000
						});
						this.tableData.splice(index, 1);
						this.count--;
						// }
					}, data => {
						console.log('错误')
					})
				}).catch(() => {

				});
			},
			//新建 编辑弹窗
			show_alert(tr, index) {
				this.alert.new_examineProject = true;
				if (tr) {
					this.title = "编辑检查项目";
					setTimeout(() => {
						this.tableData[index]=tr;
						this.form = this.copy(tr)
					}, 0)
				} else {
					this.title = "新建检查项目";
				}
			},
			//保存
			save_examineProject(resolve) {
				if (this.title == '新建检查项目') {
					var url = location.insertExamineItem;
					var form = this.copy(this.form);
				} else {
					var url = location.updatetExamineItem;
					var form = this.copy(this.form);
				};
				form.systemID = this.radiation;
				this.$http.post(url, form).then(data => {
					data = data.body;
					// if (data.httpCode == "OK") {
					this.$message({
						type: 'success',
						message: '保存成功!',
						duration: 1000
					});
					resolve()
						// }
					this.query_list(true);
				}, data => {
					console.log('错误')
				});
			},
		}
};
</script>
<style lang="less" >
@import "../../../assets/css/element.less";
.examineProject {
	.tbtn {
		margin-left: 1em;
	}
	.this_header {
		height: 30px;
		.crumbs {
			width: 96%;
			margin: 10px auto;
		}
		.this_nav {
			background: #f2f2f2;
			width: 96%;
			margin: 10px auto;
			padding: 1em;
			display: flex;
			align-items: center;
			.demonstration {
				margin-right: 1em;
			}
			.btn {
				margin-left: 6rem;
			}
		}
	}
	.total {
		// border:1px solid red;
		font-size: 14px;
		width: 96%;
		margin: 10px auto 0;
		text-align: right;
		// letter-spacing:1px;
		.refresh {
			margin-right: 1em;
		}
	}
	.this_section {
		display: flex;
		width: 96%;
		margin: 10px auto 0;
		flex-shrink: 2;
		height: 100%;
		.this_table {
			tbody{
				tr{
					cursor:pointer;
				}
			}
			height: 100%;
			.el-button+.el-button {
				margin-left: 0;
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
	.alert {
		.el-select {
			width: 100%;
		}
	}
}
</style>

<template>
	<section class="diagnoseType">
		<header class="this_header">
			<el-breadcrumb separator="/" class="crumbs">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>放射设置</el-breadcrumb-item>
				<el-breadcrumb-item>其他设置</el-breadcrumb-item>
				<el-breadcrumb-item>就诊类别</el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<h2 class="total">
		<el-button type="primary" @click="show_alert(null)" class="btn tbtn">新建</el-button>
	<el-button @click="query_list(true)" class='refresh tbtn' type="primary" :plain="true" >刷新</el-button>
			</el-button>共 <em class="em">{{count}}</em> 条记录
		</h2>
		<section class="this_section">
			<template >
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
					<el-table-column :show-overflow-tooltip="true" prop="stayInsuCode" label="类别代码" width="180">
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="就诊类别" width="180">
						<template scope="scope">
							<span :style="{color:scope.row.fontColor}">{{scope.row.stayInsu}} </span>
						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="字体颜色" width="180">
						<template scope="scope">
							<span class="colorfill" :style="{background:scope.row.fontColor}"> </span>
						</template>
					</el-table-column>
					<el-table-column></el-table-column>
				</el-table>
			</template>
		</section>
		<aside class="alert" element-loading-text="保存中请稍后">
			<el-dialog @close="resetForm('formref')" v-drag size="tiny" :title="title" v-model="alert.new_diagnoseType" :close-on-click-modal="false">
				<el-form :model="form" :rules="rules" ref="formref" class="alert-minwidth" label-width="100px">
					<el-row>
						<el-col :span="24">
							<el-form-item label="类别代码" prop="stayInsuCode" :label-width="formLabelWidth">
								<el-input v-model="form.stayInsuCode" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="就诊类别" prop="stayInsu" :label-width="formLabelWidth">
								<el-input v-model="form.stayInsu" auto-complete="off"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label="字体颜色" prop="fontColor" :label-width="formLabelWidth">
							<el-color-picker v-model="form.fontColor" class="tcolor-picker"></el-color-picker>
						</el-form-item>
					</el-row>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="submitForm('formref','save_diagnoseType','new_diagnoseType')" class="tbtn">保 存</el-button>
					<el-button v-show="title=='新建就诊类别'" type="primary" @click=";submitForm('formref','save_diagnoseType')" class="tbtn">保存并新建</el-button>
					<el-button @click="alert.new_diagnoseType=false" class="tbtn">取 消</el-button>
				</div>
			</el-dialog>
		</aside>
	</section>
</template>
<script>
import location from '../../../location/location.js';
import {
	mapState
} from 'vuex';
export default {
	data() {
			return {
				// 条目总数
				count: -1,
				// 页码
				page: 1,
				//默认颜色
				// color1: '#FF3021',
				//刷新加载
				load: false,
				//弹框信息
				alert: {
					new_diagnoseType: false
				},
				title: '新建就诊类别',
				formLabelWidth: '120px',
				rules: {
					fontColor:[{
						required: false,
					}],
					stayInsuCode: [
						{required: true,message: '类别代码只能为数字值',trigger: 'blur' ,
	      						validator:(rule, value, callback)=>{
	      						    if (isNaN(Number(value))) {
	      						        callback(new Error())
	      						    }else{
	      						    	 callback();
	      						    }
	      						}
      						},
      						{message: '请输入类别代码,必须为数字值,最长4位',trigger: 'blur',
      							validator:(rule, value, callback)=>{
	      						    if (!value) {
	      						    	callback(new Error())
	      						    }else{
	      						    	 callback();
	      						    }
	      						}
      						},
      						{min:0,max: 4, message: '类别代码最长4位', trigger: 'blur' },
					],
					stayInsu: [{
						required: true,
						message: '请输入就诊类别',
						trigger: 'blur'
					}]
				},
				form: {
					stayInsuCode: '',
					stayInsu: '',
					fontColor: '#1f3d2c'
				},
				tableData: []
			};
		},
		//data已经创建,还未渲染$el
		created() {
			//获取就诊类别列表
			this.query_list(true);
		},
		computed: {
			...mapState([
				"pageSize",
				"radiation",
				"platform",
			])
		},
		methods: {
			//查询列表
			query_list(can) {
				this.page++
					if (can) {
						this.page = 0
					}
				this.$http.get(location.loadStayInsu, {
					params: {
						page: this.page,
						count: -1,
						pageSize: this.pageSize,
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
					this.$http.get(location.deleteStayInsu, {
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
							this.tableData.splice(index, 1)
							this.count--;
						// }
					}, data => {
						console.log('错误')
					})
				}).catch(() => {});
			},
			//新建 编辑弹窗
			show_alert(tr, index) {
				this.alert.new_diagnoseType = true;
				if (tr) {
					this.title = "编辑就诊类别";
					setTimeout(() => {
						this.tableData[index] = tr;
						this.form = this.copy(tr);
					}, 0)
				} else {
					this.title = "新建就诊类别";
				}
			},
			//新增||编辑_保存
			save_diagnoseType(resolve) {
				if (this.title == '新建就诊类别') {
					var url = location.insertStayInsu;
					var form = this.copy(this.form);
				} else {
					var url = location.updateStayInsu;
					var form = this.copy(this.form);
				};
				form.systemID = this.radiation;
				this.$http.post(url, form).then(data => {
					data = data.body;
					this.query_list(true);
					// if (data.httpCode == "OK") {
						this.$message({
							type: 'success',
							message: '保存成功!',
							duration: 1000
						});
						resolve()
					// }
				}, data => {
					console.log('错误')
				});
			},
		}
};
</script>
<style lang="less">
@import "../../../assets/css/element.less";
.diagnoseType {
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
	.el-color-picker {
		width: 100%;
		.el-color-picker__trigger {
			display: flex;
			align-items: center;
			width: 100%;
			.el-color-picker__color {
				.el-color-picker__color-inner {
					border-radius: 7px;
				}
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 90%;

			}
			.el-color-picker__icon {
					top:0
				}
		}
	}
	.this_section {
		.colorfill {
			border-radius: 6px;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			height: 24px;
			margin-top: 6px;
			/*border: 1px solid #999;*/
		}
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
		/*.alert-minwidth{min-width: 400px;}*/
	}
}
</style>

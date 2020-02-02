<template>
	<div class="radiationPlugin">
		<div class="header">
			<el-breadcrumb separator="/" class="crumbs">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>插件管理</el-breadcrumb-item>
			</el-breadcrumb>
			<nav class="this_nav">
				<el-form :inline="true" :rules="rules" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
					<el-form-item label="菜单名称:" prop="nav_menu">
						<el-cascader v-model="nav_form.nav_menu" placeholder="请选择菜单" :options="options" :props="CascaderProps" filterable change-on-select></el-cascader>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="loadTableData(true)" class="btn">查询</el-button>
				<el-button :plain="true" type="info" @click="resetForm('nav_form','loadTableData')" class="btn">重 置</el-button>
			</nav>
		</div>
		<div class="total">
			<el-button class='refresh' type="info" @click="loadTableData(true)" :plain="true">
				<!--<i class="icon el-icon-loading"></i>-->
				刷新</el-button>
			<span>放射插件共<em> {{count}} </em>条</span>
		</div>
		<div class="content">
			<el-table highlight-current-row class="table" height=" " :data="tableData" border stripe v-scroll="loadTableData">
				<el-table-column :show-overflow-tooltip="true" prop="menuCode" label="菜单编码" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="menuName" label="菜单名称" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="urlAdress" label="URL" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="parentMenuID" label="父菜单编码" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="parentMenuName" label="父菜单名称" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="menuClass" label="菜单类型" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="state" label="启用状态" align="center">
					<template scope="scope">
						<span :style="{color:scope.row.state=='停用'?'':'#009933'}">{{scope.row.state}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
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
				count: 0,
				// 页码
				page: 0,
				// 当前被编辑行的索引
				editIndex: 0,
				// 是否编辑模式
				isEdit: false,
				//是否加载
				isload: false,
				//表格表头宽度
				formLabelWidth: '120px',
				//用户地区选择
				nav_form: {
					nav_menu: [],
					parentMenuID: '',
				},
				rules: {},
				options: [],
				//地区信息说明
				CascaderProps: {
					value: 'id',
					label: 'menuName',
					children: 'data'
				},
				tableData: [],
			}
		},
		computed: {
			...mapState([
				"pageSize",
				"platform",
				"platform",
			])
		},
		created() {
			//获取下拉列表
			this.loadOptionsData();
			//获取表格数据
			this.loadTableData(true);

		},
		methods: {
			//发送页面的操作信息
			showMsg(type, message) {
				this.$message({
					type,
					message,
					duration: 1000
				});
			},
			// 加载搜索条件数据
			loadOptionsData() {
				this.$http.get(location.queryMenuManagerTree, {
					params: {
						systemID: this.platform,
					}
				}).then(data => {
					data = data.body;
					this.options = data.data || [];
				})
			},

			//刷新页面
			loadTableData(reload) {
				reload ? this.page = 0 : this.page++;
				//console.log(this.nav_form.nav_menu[this.nav_form.nav_menu.length-1])
				this.$http.get(location.queryMenuManager, {
					params: {
						page: this.page,
						pageSize: this.pageSize,
						count: -1,
						id: this.nav_form.nav_menu[this.nav_form.nav_menu.length - 1] || '',
						systemID: this.platform,
					}
				}).then(data => {
					if (reload) {
						var list = data.body.data.data;
						console.log("刷新页面----------list")
						console.log(list)
						for (var i = 0; i < list.length; i++) {
							list[i].menuClass = list[i].menuClass == "0" ? "分类" : "菜单";
							list[i].state = list[i].state == "0" ? "停用" : "启用";
						}
						this.tableData = list || [];
						this.count = data.body.data.count;
					} else {
						this.tableData.push(...data.body.data.data);
					}
				});
			},
		}
};
</script>
<style lang="less">
.radiationPlugin {
	.header {
		.crumbs {
			width: 96%;
			margin: 10px auto;
			flex-shrink: 0;
		}
		.this_nav {
			background: #f2f2f2;
			width: 96%;
			margin: 10px auto;
			padding: 1em;
			display: flex;
			align-items: center;
			.el-form-item {
				margin-bottom: 0;
			}
			.btn {
				margin-left: 1em;
			}
			.demonstration {
				margin-right: 1em;
				margin-left: 1em;
			}
		}
	}
	.total {
		width: 96%;
		text-align: right;
		margin: 10px auto 10px;
		em {
			color: #4bc889;
		}
		.refresh {
			margin-right: 1em;
		}
	}
	.content {
		width: 96%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		padding-bottom: 20px;
		.table {
			height: 0;
			flex-grow: 1;
			.el-button + .el-button {
				margin-left: 0;
			}
		}
	}
	.dialog {
		.tree {
			width: 100%;
			height: 200px;
			overflow: auto;
			border: 1px solid rgb(191, 217, 202);
			.el-tree {
				border: none;
			}
		}
	}
}
</style>

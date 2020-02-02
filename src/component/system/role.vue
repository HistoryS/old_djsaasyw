<template>
    <section class="role">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <h2 class="total">
        <el-button type="primary" @click="show_new_role(null)" class="btn">新建</el-button>
            <el-button  :plain="true" class='refresh' type="primary" :loading="false">刷新</el-button>
            共 <em class="em" v-text="count">1000</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="show_new_role" v-scroll="show_new_role" stripe class="this_table" :data="tableData" border style="width: 100%">
                    <el-table-column label="操作" width="90">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button size="mini" @click="show_new_role(scope.row)" :plain="true" type="success" icon="edit"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="delete_role(scope.row.id,scope.$index)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色名称">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="state" label="状态" width="100">
                        <template scope="scope">
                            <span :class="{'start_using':scope.row.state==1}">{{scope.row.state==1?'启用':'停用'}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog top="5%" v-drag @close="resetForm('form');$refs.tree.setCheckedKeys([])" :close-on-click-modal="false" size="small" :title="title" v-model="alert.new_role">
                <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="角色名称:" prop="roleName" >
                                <el-input v-model="form.roleName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="状态:" prop="state" >
                                <el-select v-model.number="form.state">
                                    <el-option label="启用" :value="1"> </el-option>
                                    <el-option label="停用" :value="0"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角色描述:"  prop="roleDesc" >
                                <el-input v-model="form.roleDesc" type="textarea" :rows="5" placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角色权限:">
                                <div class="tree">
                                    <el-tree :data="regions" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
                                    </el-tree>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn" type="primary" @click="submitForm('form','save_role','new_role')">保 存</el-button>
                    <el-button v-show="title=='新建角色'" class="btn" type="primary" @click="submitForm('form','save_role')">保存并新建</el-button>
                    <el-button class="btn" @click="alert.new_role=false">取 消</el-button>
                </div>
            </el-dialog>
        </aside>
    </section>
</template>
<script>
import location from '../../location/location.js';
import {
    mapState
} from 'vuex';
export default {
    data() {
            return {
                page: 0,
                count: 1,
                alert: {
                    new_role: false
                },
                regions: [],
                defaultProps: {
                    label: 'menuName',
                    children: 'data'
                },
                formLabelWidth: '120px',
                rules: {
                    roleName: [{
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                },
                form: {
                    roleName: '',
                    state: 1,
                    roleDesc: '',
                },
                options: [],
                tableData: [],
                title:'新建角色'
            };
        },
        computed: {
            ...mapState([
                "pageSize",
                "radiation",
                "platform",
            ])
        },
        created() {
            //获取角色
            this.get_role(true);
            //获取用户权限
            this.get_tree();
        },
        methods: {
            //新建||编辑 角色
            show_new_role(tr) {
                this.alert.new_role = true;
                if (tr) {
                    this.title = '编辑角色';
                    setTimeout(() => {
                        this.form =this.copy(tr);
                        this.$refs.tree.setCheckedKeys(tr.selectMenu);
                    }, 0)
                } else {
                    this.title = '新建角色';
                }
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            //获取角色
            get_role(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.queryRoleMananger, {
                    params: {
                        page: this.page,
                        count: -1,
                        systemID: this.platform,
                        pageSize: this.pageSize,
                    }
                }).then(data => {
                    data = data.body.data;
                    console.log(data)
                    this.count = data.count;
                    if (can) {
                        this.tableData = data.data || [];
                        // this.$message({
                        //     type: 'success',
                        //     message: '查询成功',
                        //     duration: 1000
                        // });
                    } else {
                        this.tableData.push(...data.data)
                    }

                }, data => {
                    console.log('错误')
                })
            },
            //删除角色
            delete_role(id, index) {
                this.$confirm('是否确认删除该条信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.deleteRoleMananger, {
                        params: {
                            id: id,
                        }
                    }).then(data => {
                        data = data.body;
                        if (data.httpCode == 'OK') {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
                            });
                            this.tableData.splice(index, 1)
                            this.count--;
                        }
                    }, data => {
                        console.log('错误')
                    })
                }).catch(() => {});
            },
            //获取角色
            get_tree(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.getUserDataAndTreeData).then(data => {
                    data = data.body.data;
                    this.regions = data.treeData;
                }, data => {
                    console.log('错误')
                })
            },
            //新建||保存 角色
            save_role(resolve) {
                var url;
                if (this.title=='编辑角色') {
                    url=location.updateRoleMananger
                }else{
                    url=location.addRoleMananger
                }
                this.form.selectMenu=this.$refs.tree.getCheckedKeys()
                this.form.systemID=this.platform;
                this.$http.post(url,this.form).then(data => {
                    data = data.body.data;
                    this.$message({
                        type: 'success',
                        message: '保存成功',
                        duration: 1000
                    });
                    resolve()
                    this.get_role(true);
                }, data => {
                    console.log('错误')
                })
            }
        }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/element.less";
.role {
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
        }
    }
    .total {
        // border:1px solid red;
        font-size: 14px;
        width: 96%;
        margin: 10px auto 0;
        text-align: right;
        .btn {
            margin-right: 1em;
        }
        .refresh {
            margin-right: 15px;
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
        .btn {
            margin-left: 1em;
        }
        .label {
            width: 80px;
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 14px;
            line-height: 1;
            padding: 11px 12px 11px 0;
        }
        .tree {
            border: 1px solid rgb(191, 217, 202);
            display: inline-block;
            width: 100%;
            height: 200px;
            overflow: auto;
            .el-tree {
                border: none;
            }
        }
        .el-input,
        .el-select {
            width: 190px;
        }
    }
}
</style>

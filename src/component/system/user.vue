<template>
    <section class="user">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="this_nav">
                <el-form :inline="true" :rules="rules" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
                    <el-form-item label="姓名:" prop="nav_username">
                        <el-input v-model="nav_form.nav_username" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="query_user(true)" class="btn">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('nav_form','query_user')" class="btn">重 置</el-button>
            </nav>
        </header>
        <h2 class="total">
            <el-button type="primary" @click="show_new_user(null)" class="btn">新建</el-button>
            <el-button  :plain="true" class='refresh' type="primary" :loading="false" @click="query_user(true)">刷新</el-button>
            共 <em class="em" v-text="count">1000 </em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="show_new_user" v-scroll="query_user" stripe class="this_table" :data="tableData" border style="width: 100%">
                    <el-table-column label="操作" width="130">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button size="mini" @click="show_new_user(scope.row)" :plain="true" type="success" icon="edit"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="delete_user(scope.row.id,scope.$index)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="icon iconfont icon-yaochi" @click="reset_userInfo(scope.row,scope.$index)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" width="100">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="fullName" label="姓名" width="100">
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template scope="scope">
                            <p :class="{'start_using':scope.row.state==1}">{{ scope.row.state==1?'启用':'停用'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="eMail" label="邮箱">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true"  label="角色">
                        <template scope="scope">
                            <span class="mr" v-for="item in scope.row.roles" v-text="item.roleName"></span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="phone" label="手机">
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog top="5%" @close="resetForm('form')" v-drag :close-on-click-modal="false" class="new_region" size="small" :title="title" v-model="alert.new_user">
                <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="用户名:" prop="username">
                                <el-input disabled v-model="form.username" class="short"></el-input>
                                <el-button type="primary" size="small" @click="get_FullName">重新获取</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="姓名:" prop="fullName">
                                <el-input v-model="form.fullName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="手机号码:" prop="phone">
                                <el-input v-model="form.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="短号:" prop="shortPhone">
                                <el-input v-model="form.shortPhone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="邮箱:" prop="eMail">
                                <el-input v-model="form.eMail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="性别:" prop="sex">
                                <el-select v-model="form.sex" placeholder="请选择">
                                    <el-option label="不详" :value="0"></el-option>
                                    <el-option label="男" :value="1"></el-option>
                                    <el-option label="女" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="有效期" prop="foreverState">
                                <template>
                                    <el-radio class="radio" v-model.number="form.foreverState" :label="1">永久</el-radio>
                                    <el-radio class="radio" v-model.number="form.foreverState" :label="0">日期范围</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item  prop="date">
                                <el-date-picker v-model="form.date" v-show="form.foreverState==0" type="daterange" placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="状态" prop="state">
                                <el-select v-model="form.state" placeholder="请选择">
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="停用" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <span class="label">输入法:</span>
                            <span class="value">搜狗输入法</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角色:"  class="long" prop="roleIds">
                                <el-select v-model="form.roleIds" multiple filterable placeholder="请选择">
                                    <el-option v-for="item in rolename" :key="item.id" :label="item.roleName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角色描述:" prop="resume">
                                <el-input v-model="form.resume" type="textarea" :rows="5" placeholder="请输入内容">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn" type="primary" @click="submitForm('form','save_user','new_user')">保 存</el-button>
                    <el-button v-show="title=='新建用户'" class="btn" type="primary" @click="submitForm('form','save_user')">保存并新建</el-button>
                    <el-button class="btn" @click="alert.new_user=false">取 消</el-button>
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
                alert: {
                    new_user: false
                },
                //角色列表
                rolename: [],
                title: '新建用户',
                radio: '',
                formLabelWidth: '120px',
                rules: {
                    username: [{
                        required: true,
                        message: '请获取用户名',
                        trigger: 'blur'
                    }],
                    fullName: [{
                        required: true,
                        message: '请填写姓名',
                        trigger: 'blur'
                    }],
                    roleIds: [{
                        type: 'array',
                        required: true,
                        message: '请选择角色',
                        trigger: 'blur'
                    }],
                    nav_username: [{
                        min: 0,
                        max: 30,
                        message: '长度在 0 到 30 个字符',
                        trigger: 'blur'
                    }],
                    phone:[{
                        trigger:'blur',
                        message:'手机号码输入有误',
                        validator:(rule, value, callback)=>{
                            if (!value&&value!==0) {
                                callback();
                            }else if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value))){
                                callback(new Error());
                            }else{
                                callback();
                            }
                        }
                    }],
                    eMail:[{
                        trigger:'blur',
                        message:'输入邮箱格式有误',
                        validator:(rule, value, callback)=>{
                            if (!value&&value!==0) {
                                callback();
                            }else if (!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value))){
                                callback(new Error());
                            }else{
                                callback();
                            }
                        }
                    }]
                },
                nav_form: {
                    nav_username: '',
                },
                page: 0,
                count: -1,
                form: {
                    username: '',
                    fullName: '',
                    phone: '',
                    shortPhone: '',
                    eMail: '',
                    sex: 0,
                    foreverState: 1,
                    state: 1,
                    date: [],
                    roleIds: [],
                    resume: '',
                },
                options: [],
                tableData: [],
                user_choose: 1,
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
            this.query_user(true);
            //获取角色
            this.get_role();
        },
        methods: {
            //新建||编辑 用户
            show_new_user(tiem) {
                console.log(tiem)
                this.user_choose = tiem;
                this.alert.new_user = true;
                if (tiem) {
                    this.title = "编辑用户";
                    setTimeout(() => {
                        var id=[]
                        var table=this.copy(tiem)
                        table.roles.forEach((el,index)=>{
                            id.push(el.id)
                        })
                        table.roleIds=id;
                        this.form = table
                    }, 0)
                } else {
                    this.title = "新建用户";
                }
            },
            //查询用户
            query_user(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.getPlaUserInfos, {
                    params: {
                        fullname: this.nav_form.nav_username,
                        page: this.page,
                        count: -1,
                        pageSize: this.pageSize,
                        systemID: this.platform
                    }
                }).then(data => {
                    data = data.body;
                    this.count = data.data.count;
                    if (can) {
                        this.tableData = data.data.data;
                    } else {
                        this.tableData.push(...data.data)
                    }
                    this.tableData.map((el,index)=>{
                        el.date=[el.startDate,el.endDate]
                        return el;
                    })
                }, data => {
                    console.log('错误')
                })
            },
            //删除用户
            delete_user(id, index) {
                this.$confirm('是否确认删除该条信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.deleteUserInfo, {
                        params:{
                            id: id,
                        }
                    }).then(data => {
                        data = data.body;
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            duration:1000
                        });
                        this.tableData.splice(index, 1)
                        this.count--;
                    }, data => {
                        console.log('错误')
                    })
                }).catch(() => {});
            },
            //保存||编辑用户
            save_user(resolve) {
                var url,form;
                if (this.title == '新建用户') {
                    url = location.addUserInfo;
                    form = this.copy(this.form);
                } else {
                    url = location.updateUserInfo
                    form = this.copy(this.form);
                    form.id=this.user_choose.id;
                }
                // if (!!form.date[1]) {
                    try{
                        [form.startDate,form.endDate]=[this.form.date[0].toLocaleDateString(),this.form.date[1].toLocaleDateString()]
                    }catch(err){
                        //无日期
                    }
                // }
                form.systemID=this.platform;
                this.$http.post(url,form).then(data => {
                    data = data.body;
                    if (data.httpCode=="OK") {
                       this.$message({
                            type: 'success',
                            message: '保存成功!',
                            duration:1000
                        });
                        resolve();
                        this.query_user(true);
                    }
                }, data => {
                    console.log('错误')
                })
            },
            //获取用户名
            get_FullName() {
                this.$http.get(location.createUsername).then(data => {
                    data = data.body;
                    console.log(data)
                    if (data.httpCode == "OK") {
                        this.form.username = data.data;
                    }
                }, data => {
                    console.log('错误')
                })
            },
            //重置用户密码
            reset_userInfo(item, index) {
                this.$confirm('是否确认重置该用户密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.resetUserInfoPassword, {
                        params:{
                            id: item.id,
                        }
                    }).then(data => {
                        data = data.body;
                        console.log(data)
                        if (data.httpCode == 'OK') {
                            this.$message({
                                type: 'success',
                                message: '重置密码为888888',
                                duration:2000
                            });
                        }
                    }, data => {
                        console.log('错误')
                    })
                }).catch(() => {});
            },
            //查询角色
            get_role() {
                this.$http.get(location.getRoleManangers,{
                    params:{
                        roleDesc:'',
                    }
                }).then(data => {
                    data = data.body;
                    this.rolename=data.data;
                    console.log(data);
                }, data => {
                    console.log('错误')
                })
            }
        }
};
</script>
<style lang="less" scoped>
    @import "../../assets/css/element.less";
    .user {
        .this_header {
            height: 100px;
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
                .el-input,
                .el-select {
                    width: 193px;
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
            // border:1px solid red;
            font-size: 14px;
            width: 96%;
            margin: 10px auto 0;
            text-align: right;
            // letter-spacing:1px;
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
            .el-input,
            .el-select {
                width: 1.6rem;
            }
            .short {
                width: 0.8rem;
            }
            .value {
                width: 100px;
                text-align: left;
                vertical-align: middle;
                float: left;
                font-size: 14px;
                line-height: 1;
                padding: 11px 12px 11px 0;
            }
            .long {
                .el-input,
                .el-select {
                    width: 3.43rem;
                }
            }
            .btn {
                margin-left: 1em;
            }
        }
    }
</style>

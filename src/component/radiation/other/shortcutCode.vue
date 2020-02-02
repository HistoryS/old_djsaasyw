<template>
    <section class="shortcutCode">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>放射设置</el-breadcrumb-item>
                <el-breadcrumb-item>其他</el-breadcrumb-item>
                <el-breadcrumb-item>常用符号</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="this_nav">
                <el-form :inline="true" :rules="rules" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
                    <el-form-item label="检查类型:" prop="nav_region">
                        <el-select v-model="nav_form.nav_region">
                            <el-option v-for="item in options" :label="item.examineType" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="loadTableData(true)" class="btn">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('nav_form','loadTableData')" class="btn">重 置</el-button>
            </nav>
        </header>
        <section class="topCy">
            <h2 class="total">
                <el-button type="primary" @click="alert.newAgent = true;saveandnew=true" class="btn">新建
                </el-button>
                <el-button class='refresh' type="info" :loading="isload" @click="loadTableData(true)" :plain="true">
                    刷新
                </el-button>
                共 <em class="em">{{count}}</em> 条记录
            </h2>
            <section class="this_section">
                <template>
                    <el-table highlight-current-row stripe class="this_table" :data="tableData" border stripe style="width: 100%"
                              height="100%" @row-dblclick="dataLoad" stripe>
                        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="100">
                            <template scope="scope">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button class="btnCy" size="mini" :plain="true" type="success" icon="edit"
                                           @click="dataLoad(scope.$index)"></el-button>
                                </el-tooltip>  
                                <el-tooltip content="删除" placement="top">
                                    <el-button class="btnCy" size="mini" :plain="true" type="danger" icon="delete"
                                           @click="del(scope.$index)"></el-button>
                                </el-tooltip>
                                <!-- <el-button class="btnCy" size="mini" :plain="true" type="success" icon="caret-top"
                                           @click="up(scope.$index)"></el-button>
                                <el-button class="btnCy" size="mini" :plain="true" type="success" icon="caret-bottom"
                                           @click="down(scope.$index)"></el-button> -->
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="examineType" label="检查类型">
                        </el-table-column>
                        <!-- <el-table-column :show-overflow-tooltip="true" prop="id" label="符号编码">
                        </el-table-column> -->
                        <el-table-column :show-overflow-tooltip="true" prop="signName" label="符号名称">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="state" label="状态">
                            <template scope="scope">
                                <span :style="{color:scope.row.state=='停用'?'':'#009933'}">{{scope.row.state}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="" label="">
                        </el-table-column>
                    </el-table>
                </template>
            </section>
        </section>
        <div class="alert">
            <!-- 常用符号 -->
            <el-dialog @close="resetForm('form')"  v-drag size="tiny" :title="saveandnew?'新建常用符号':'编辑常用符号'" v-model="alert.newAgent"
                       :close-on-click-modal="false">
                <el-form label-position="right" :model="form" :rules="rules" label-width="120px" ref='form'>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="检查类型:" prop="examineType">
                                <el-select v-model="form.examineType">
                                    <el-option v-for="item in option" :label="item.examineType" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="常用符号:" prop="signName">
                                <el-input v-model="form.signName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form','save','newAgent')">保 存
                    </el-button>
                    <el-button type="primary" @click="submitForm('form','save');" v-if="saveandnew">
                        保存并新建
                    </el-button>
                    <el-button @click="alert.newAgent=false">取 消</el-button>
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
                count: 0,
                // 页码
                page: 0,
                // 当前被编辑行的索引
                editIndex: 0,
                // 是否编辑模式
                editorIndex:0,
                input: '',
                formLabelWidth: '120px',
                isload: false,
                isload2: false,
                saveandnew: false,
                formdata: '',
                alert: {
                    newAgent: false,
                },
                rules: {
                    signName: [{
                        required: true,
                        message: '请输入常用符号',
                        trigger: 'blur'
                    }],
                    examineType: [{
                        required: true,
                        message: '请选择检查类型',
                        trigger: 'blur'
                    }]
                },
                form: {
                    examineType: '',
                    signName: '',
                },
                //用户地区选择
                nav_form:{
                    nav_region:'',
                },
                options: [],
                //地区信息说明
                
                option: [],
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

            //初始化带下拉的菜单
            this.loadOptionsData();
        },
        methods: {
            //发送页面的操作信息
            showMsg(type, message){
                this.$message({type, message,duration:1000});
            },
            //编辑时加载数据到编辑框
            dataLoad(index){
                this.alert.newAgent = true;
                this.saveandnew = false;
                this.editorIndex=index; 
                setTimeout(() => {
                    this.form = isNaN(index)?this.copy(index):this.copy(this.tableData[index]);
                    //this.form = this.copy(this.tableData[index]);
                }, 0);
            },
            //点击删除当前行的提示框操作
            del(index) {
                this.$confirm(`您确认要删除“${this.tableData[index].examineType}”？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.deleteCommonSign,{
                        params:{
                            id: this.tableData[index].id
                        }
                    }).then(data => {
                        data=data.body;
                        console.log(data)
                        this.showMsg('success', '删除成功！');
                        this.tableData.splice(index,1);
                        this.count--;
                    });
                });
            },
            // 加载搜索条件数据
            loadOptionsData() {
                this.$http.get(location.loadExamineType,{
                    params:{
                        systemID:this.radiation,
                        page:0,
                        pageSize:this.pageSize,
                        count:-1,
                    }
                }).then(data => {
                    data=data.body;
                    console.log(data)
                    this.option = data.data.data || [];
                    this.options= data.data.data || [];
                    this.nav_form.nav_region = this.options[0].id;
                    this.form.examineType=this.option[0].id;
                    //初始化页面数据
                    this.loadTableData(true);
                })
            },
            //刷新页面
            loadTableData(reload) {
                reload ?this.page= 0 : this.page ++;
                console.log(this.nav_form.nav_region)
                this.$http.get(location.loadCommonSign,{
                    params:{
                        page: this.page,
                        pageSize: this.pageSize,
                        count: -1,
                        examineTypeID: this.nav_form.nav_region||'', 
                        systemID:this.radiation,
                    }
                }).then(data => {
                    data=data.body;
                    console.log(data)
                    if (reload) {
                        let dataList=data.data.data || []; 
                        for(var i=0;i<dataList.length;i++){
                            dataList[i].state=dataList[i].state=="0"?"禁用":"启用";
                        }
                        this.tableData = dataList;
                        this.count = data.data.count;
                    }
                    else {
                        this.tableData.push(...data.data.data);
                    }
                });
            },
            //保存编辑或新建的表单
            save(resolve) {
                // 如果是编辑模式就更新，否则就新建
                if (!this.saveandnew) {
                    let data = this.copy(this.form);
                    data.state=data.state=="启用"?"1":"0";
                    this.$http.post(location.updateCommonSign, {
                        id:data.id,
                        state:data.state,
                        examineTypeID:data.examineType,
                        signName:data.signName,
                    }).then(data => {
                        this.showMsg('success', '更新成功！');
                        this.loadTableData(true);
                        resolve();
                    })
                } else {
                    let data = this.copy(this.form);
                    this.$http.post(location.insertCommonSign, {
                        systemID:this.radiation,
                        examineTypeID:data.examineType,
                        signName:data.signName,
                    }).then(data => {
                        this.showMsg('success', '创建成功！');
                        this.loadTableData(true);
                        resolve();
                    })
                }
            },
            //上移
            // up(index){
            //     if(index==0){
            //         this.$message({
            //             type: 'success',
            //             message: '已经在最上面了!'
            //         });
            //         return ;
            //     }
            //         let temp=this.tableData[index];
            //         this.$set(this.tableData,index,this.tableData[index-1]);
            //         this.$set(this.tableData,index-1,temp);
            // },
            //下移
            // down(index){
            //      if(index==this.tableData.length-1){
            //         this.$message({
            //             type: 'success',
            //             message: '已经在最下面了!'
            //         });
            //         return ;
            //     }
            //     let temp=this.tableData[index];
            //     this.$set(this.tableData,index,this.tableData[index+1]);
            //     this.$set(this.tableData,index+1,temp);
            // },
            
        }
    };
</script>
<style lang="less">
    @import "../../../assets/css/element.less";

    .shortcutCode {
        .el-button + .el-button {
            margin-left: 1em !important;
        }
        .this_header {
            // padding-top: 10px;
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
                display: flex;
                align-items: center;
                .el-form-item{
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
        .topCy {
            height: 100%;
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

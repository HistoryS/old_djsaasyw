<template>
    <section class="log">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="this_nav">
                <el-form :inline="true" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
                    <el-form-item label="日志类型:" prop="type">
                        <el-select v-model="nav_form.type" placeholder="请选择日志类型">
                            <el-option label="登录日志" value="0"></el-option>
                            <el-option label="新增数据" value="1"></el-option>
                            <el-option label="修改数据" value="2"></el-option>
                            <el-option label="删除数据" value="3"></el-option>
                            <el-option label="查询数据" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作日期:" prop="date">
                        <el-date-picker class="long" v-model="nav_form.date" :editable="false" type="daterange" align="left" placeholder="选择操作日期范围" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                            <el-button type="primary" @click="query_log(true)" class="btn">查询</el-button>
                            <!-- <el-button :plain="true" type="info" @click="resetForm('nav_form','query_log')" class="btn">重 置</el-button> -->
                    </el-form-item>
                </el-form>
            </nav>
        </header>
        <h2 class="total">
            <el-button class='refresh' type="primary" :loading="false">刷新</el-button>
            共 <em class="em" v-text="count">1000</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="look_log" v-scroll="query_log" stripe class="this_table" :data="calculate_table" border style="width: 100%" height="100%">
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <el-button @click="look_log(scope.row)" size="mini" :plain="true" type="success" icon="icon iconfont icon-chakan2"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="logType" label="日志类型" width="100">
                        <!-- <template scope="scope"> -->
                            <!-- <span>{{scope.row.logType==0?'登录日志':scope.row.logType==1?'新增数据':scope.row.logType==2?'修改数据':scope.row.logType==3?'删除数据':'查询数据'}}</span> -->
                        <!-- </template> -->
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="userName" label="操作用户">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="iPAddresspe" label="ip地址">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="eventTime" label="操作时间">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="description" label="日志内容">
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog v-drag title="查看系统日志" v-model="alert.log">
                <section class="alert_conetnt">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">日志类型:</span>
                            <span v-text="form.logType"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">操作用户:</span>
                            <span v-text="form.userName"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six"> IP地址:</span>
                            <span v-text="form.iPAddresspe"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">操做时间:</span>
                            <span v-text="form.eventTime"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <span class="six">日志内容:</span>
                            <el-input v-model="form.description" disabled type="textarea" :rows="12" placeholder="请输入内容">
                            </el-input>
                        </el-col>
                    </el-row>
                </section>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="alert.log=false">关 闭</el-button>
                </div>
            </el-dialog>
        </aside>
    </section>
</template>
<script>
import location from '../../location/location.js';
import {mapState} from 'vuex';
export default {
    data() {
            return {
                alert: {
                    log: false
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                formLabelWidth: '120px',
                rules: {
                    name: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 5,
                        message: '长度在 3 到 5 个字符',
                        trigger: 'blur'
                    }],
                    region: [{
                        required: true,
                        message: '请选择活动区域',
                        trigger: 'change'
                    }],
                    date1: [{
                        type: 'date',
                        required: true,
                        message: '请选择日期',
                        trigger: 'change'
                    }],
                    date2: [{
                        type: 'date',
                        required: true,
                        message: '请选择时间',
                        trigger: 'change'
                    }],
                    type: [{
                        type: 'array',
                        required: true,
                        message: '请至少选择一个活动性质',
                        trigger: 'change'
                    }],
                    resource: [{
                        required: true,
                        message: '请选择活动资源',
                        trigger: 'change'
                    }],
                    desc: [{
                        required: true,
                        message: '请填写活动形式',
                        trigger: 'blur'
                    }]
                },
                nav_form: {
                    date: [],
                    type: "",
                },
                page: 0,
                count: -1,
                form: {
                    logType:'',
                    userName:'',
                    iPAddresspe:'',
                    eventTime:'',
                    description:'',
                },
                tableData: []
            };
        },
        computed: {
            //动态计算日志内容
            calculate_table:function () {
                 this.tableData.forEach((item,index)=>{
                    switch(item.logType){
                        case "0":
                            item.logType='登录日志'
                            break;
                        case "1":
                            item.logType='新增日志'
                            break;
                        case "2":
                            item.logType='修改日志'
                            break;
                        case "3":
                            item.logType='删除删除'
                            break;
                        case "4":
                            item.logType='查询数据'
                            break;
                    }
                })
                return this.tableData;
            },
            ...mapState([
                "pageSize",
                "radiation",
                "platform",
            ])
        },
        created() {
            this.query_log(true)
        },
        methods: {
            //查询日志
            query_log(can) {
                if (this.nav_form.date.length==2) {
                    var [startTime,overTime]=[this.nav_form.date[0].toLocaleDateString(),this.nav_form.date[1].toLocaleDateString()]
                }
                can?this.page=0:this.page++;
                this.$http.get(location.loadServerLog, {
                    params:{
                        logType:this.nav_form.type,
                        page: this.page,
                        count: -1,
                        pageSize: 40,
                        systemID:this.platform,
                        startTime:startTime,
                        overTime:overTime
                    }
                }).then(data => {
                    data = data.body;
                    this.count = data.data.count;
                    if (can) {
                        this.tableData=data.data.data||[];
                    }else{
                        this.tableData.push(...data.data.data);
                    }
                })
            },
            //查询日志内容详情
            look_log(item) {
                this.alert.log=true;
                this.form = this.copy(item)
            },
        }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/element.less";
.log {
    .this_header {
        // padding-top: 10px;
        // height: 100px;
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
            .el-form-item{
                margin-bottom: 10px;
            }
            .demonstration {
                margin-right: 1em;
                margin-left: 1em;
            }
            .el-input,
            .el-select {
                width: 190px;
            }
            .long {
                width:220px;
            }
            .btn {
                margin-left: 1em;
            }
            // border-top: 1px solid rgb(238, 246, 243);
            // margin-top: 30px;
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
                width: 20px;
                &:hover {
                    color: #4bc889;
                }
            }
        }
    }
    .alert {
        .el-input,
        .el-select {
            width: 190px;
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
            .el-row {
                min-height: 3em;
                // display:flex;
                // align-items:center;
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

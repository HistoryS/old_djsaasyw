<template>
    <section class="parameter">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>平台参数</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <h2 class="total">
            <!-- <el-button type="primary" @click="dialogFormVisible = true" class="btn">新建</el-button> -->
            <el-button  :plain="true" class='refresh' type="primary" :loading="false" @click="get_parameter(true)">刷新</el-button>
            共 <em class="em" v-text="count">1000</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="edit_parameter" v-scroll="get_parameter" stripe class="this_table" :data="tableData" border style="width: 100%">
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button size="mini" :plain="true" @click="edit_parameter(scope.row)" type="success" icon="edit"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="序号" width="80">
                        <template scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paraGroup" label="参数分组" width="100">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paraCode" label="参数代码">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paraName" label="参数名称">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paraValue" label="参数值">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="paraDesc" label="参数说明">
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog v-drag @close="resetForm('form')" title="默认开发商" v-model="alert.parameter">
                <section class="alert_conetnt">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">参数代码:</span>
                            <span v-text="form.paraCode"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">参数名称:</span>
                            <span v-text="form.paraName"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form :inline="true" :model="form" :rules="rules" ref="form" class="alert-minwidth">
                                <el-form-item prop="paraValue" label-width="6em" >
                                    <span class="six">参数值:</span>
                                    <!-- <el-input v-model="form.paraValue" auto-complete="off" class="lang"></el-input> -->
                                    <el-input v-model="form.paraValue" v-if="form.paraValueType==0" auto-complete="off"></el-input>
                                    <el-select v-model="form.paraValue" v-else placeholder="请选择院区的等级">
                                        <el-option v-for="item in form.option" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <span class="six">参数说明:</span>
                            <span v-text="form.address"></span>
                        </el-col>
                    </el-row>
                </section>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form','save_parameter','parameter')" class="btn">保存</el-button>
                    <el-button @click="alert.parameter=false">关 闭</el-button>
                </div>
            </el-dialog>
        </aside>
    </section>
</template>
<script>
import location from '../../location/location.js';
import {mapState } from 'vuex';
export default {
    data() {
            return {
                alert: {
                    parameter: false,
                },
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
                page: 1,
                count: -1,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                options: [],
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
        created() {
            //获取平台参数
            this.get_parameter(true)
        },
        methods: {
            //获取平台参数
            get_parameter(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.loadPlaParameter, {
                    params: {
                        pageSize: this.pageSize,
                        page: this.page,
                        count: -1,
                        systemID: this.platform
                    }
                }).then(data => {
                    data = data.body;
                    console.log(data);
                    this.count = data.data.count;
                    if (can) {
                        this.tableData = data.data.data || [];
                    } else {
                        this.table.push(...data.data.data);
                    }
                }, data => {
                    console.log('错误')
                })
            },
            //编辑
            edit_parameter(item) {
                this.alert.parameter = true;
                this.form = this.copy(item)
            },
            //保存编辑
            save_parameter(resolve) {
                this.$http.post(location.updateParameter, {
                    paraValue: this.form.paraValue,
                    sysParaID: this.form.sysParaID
                }).then(data => {
                    data = data.body;
                    resolve();
                    this.get_parameter(true);
                }, data => {
                    console.log('错误')
                })
            },
        }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/element.less";
.parameter {
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
            width: 190px;
        }
        .long {
            .el-input,
            .el-select {
                width: 543px;
            }
        }
        .lang{
            width:380px;
        }
        .alert_conetnt {
            width: 80%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            .el-row {
                min-height: 3em;
                display: flex;
                align-items: center;
            }
        }
        .el-form--inline .el-form-item{
            margin-bottom: 0;
        }
        .btn{
            margin-right: 1em;
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

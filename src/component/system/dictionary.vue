<template>
    <section class="dictionary">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>平台字典</el-breadcrumb-item>
            </el-breadcrumb>
        </header>
        <h2 class="total">
            <!-- <el-button class="btn" type="primary" @click="dialogFormVisible = true">新建</el-button> -->
            <el-button @click="get_dictionary(true)" :plain="true" class='refresh' type="primary" :loading="false">刷新</el-button>
            共 <em class="em" v-text="count">1000</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="show_edit" height="100%" v-scroll="get_dictionary" stripe class="this_table" :data="tableData" border style="width: 100%">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="edit" @click="show_edit(scope.row)"></el-button>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="delete_dictionary(scope.row,scope.$index)"></el-button>
                            </el-tooltip> -->
                            <!-- <el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button> -->
                            <!-- <el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="id" label="序号" width="80">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dataDicGroup" label="字典分组" width="100">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dataDicCode" label="字典标识">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="dataDicName" label="字典名称">
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog v-drag :close-on-click-modal="false" size="small" :title="title" v-model="alert.dictionary">
                <section class="alert_conetnt">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">字典标识:</span>
                            <span v-text="alert_tableData.dataDicCodee"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">字典名称:</span>
                            <span v-text="alert_tableData.dataDicName"></span>
                        </el-col>
                    </el-row>
                    <hr class="hr">
                    <aside class="alertTable">
                        <p>
                            <span>选项列表(<em class="em" v-text="alert_count">17</em>)</span>
                            <el-button :disabled="choose_dictionary.operateFlag==0" type="primary" size="mini" @click="show_new(null)">新建</el-button>
                        </p>
                        <template>
                            <el-table highlight-current-row height="300" :data="alert_tableData" border style="width: 100%">
                                <el-table-column label="操作" width="100">
                                    <template scope="scope">
                                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                            <el-button :disabled="choose_dictionary.operateFlag==0" size="mini"  :plain="true" type="success" icon="edit" @click="show_new(scope.row,scope.$index)"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                            <el-button :disabled="choose_dictionary.operateFlag==0" size="mini" :plain="true" type="danger" icon="delete" @click="delete_dictionary(scope.row,scope.$index)" ></el-button>
                                        </el-tooltip>
                                        <!-- <el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button> -->
                                        <!-- <el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button> -->
                                    </template>
                                </el-table-column>
                                <el-table-column prop="dataDicValueCode" label="选项代码">
                                </el-table-column>
                                <el-table-column prop="dataDicValueName" label="选项名称">
                                </el-table-column>
                                <el-table-column prop="state" label="启用状态">
                                    <template scope="scope">
                                        <p :class="{'start_using':scope.row.state==1}">{{scope.row.state==1?'启用':'停用'}}</p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </aside>
                </section>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="alert.dictionary=false">关 闭</el-button>
                </div>
            </el-dialog>
            <el-dialog v-drag @close="resetForm('form')" :close-on-click-modal="false" size="tiny" :title="alert_title" v-model="alert.sysdatadicvalue">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="选项代码" :label-width="formLabelWidth" prop="dataDicValueCode">
                        <el-input v-model="form.dataDicValueCode" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选项名称" :label-width="formLabelWidth" prop="dataDicValueName">
                        <el-input v-model="form.dataDicValueName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态" prop="state" :label-width="formLabelWidth">
                        <el-select v-model.number="form.state" placeholder="请选择活动区域">
                            <el-option label="启用" :value="1"></el-option>
                            <el-option label="停用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form','save_dictionary','sysdatadicvalue')" class="btn">保 存</el-button>
                    <el-button v-show="alert_title=='新建类型'" type="primary" @click="submitForm('form','save_dictionary')" class="btn">保存并新建</el-button>
                    <el-button @click="alert.sysdatadicvalue=false">关 闭</el-button>
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
                    dictionary: false,
                    sysdatadicvalue: false,
                },
                title: '编辑',
                alert_title: '编辑字典名称',
                dialogFormVisible: false,
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
                    }],
                    dataDicValueCode: [{
                        required: true,
                        message: '请填写选项代码',
                        trigger: 'blur'
                    }],
                    dataDicValueName: [{
                        required: true,
                        message: '请填写选项名称',
                        trigger: 'blur'
                    }]
                },
                form: {
                    dataDicValueCode: '',
                    dataDicValueName: '',
                    state: 1,
                },
                page: 0,
                alert_page: 0,
                count: -1,
                alert_count: -1,
                tableData: [],
                alert_tableData: [],
                choose_dictionary_child: '',
                choose_dictionary: '',
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
            //获取平台字典
            this.get_dictionary(true);
        },
        methods: {
            //获取平台字典
            get_dictionary(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.loadSysDataDic, {
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
                        this.tableData.push(...data.data);
                    }
                }, data => {
                    console.log('错误')
                })
            },
            //编辑字典
            show_edit(tr) {
                this.alert.dictionary = true;
                this.title = '编辑' + tr.dataDicName;
                this.choose_dictionary = tr;
                this.$http.get(location.loadSysDataDicValue, {
                    params: {
                        page: this.alert_page,
                        pageSize: this.pageSize,
                        count: -1,
                        forTpye: 0,
                        dataDicID: tr.id,
                    }
                }).then(data => {
                    data = data.body;
                    console.log(data)
                    this.alert_count = data.data.count;
                    this.alert_tableData = data.data.data;
                    this.$set(this.alert_tableData, 'dataDicCodee', tr.dataDicCode)
                    this.$set(this.alert_tableData, 'dataDicName', tr.dataDicName)
                }, data => {
                    console.log('错误')
                })
            },
            //编辑||新建_字典内码
            show_new(tr) {
                this.alert.sysdatadicvalue = true;
                this.choose_dictionary_child = tr
                if (tr) {
                    this.alert_title = "编辑";
                    setTimeout(() => {
                        this.form = this.copy(tr);
                    }, 0)
                } else {
                    this.alert_title = "新建";
                }
            },
            //保存字典值
            save_dictionary(resolve) {
                if (this.alert_title == '新建') {
                    var url = location.insertSysDataDicValue;
                    var form = this.copy(this.form);
                    form.dataDicID = this.choose_dictionary.id;
                } else {
                    var url = location.updateSysDataDicValue;
                    var form = this.copy(this.form);
                }
                this.$http.post(url, form).then(data => {
                    data = data.body;
                    this.show_edit(this.choose_dictionary);
                    resolve()
                }, data => {
                    console.log('错误')
                });
            },
            //删除字典内码
            delete_dictionary(item, index) {
                this.$confirm('是否确认删除该条信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.deleteSysDataDicValue, {
                        params: {
                            id: item.id
                        }
                    }).then(data => {
                        data = data.body;
                        if (data.httpCode == "OK") {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
                            });
                        }
                        this.alert_tableData.splice(index, 1);
                        this.alert_count--;
                    }, data => {});
                }).catch(() => {

                });
            }
        }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/element.less";
.dictionary {
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
                margin-left: 1em;
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
        .el-input,
        .el-select {
            width: 300px;
        }
        .btn {
            margin-right: 1em;
        }
        .alertTable {
            p {
                display: flex;
                justify-content: space-between;
                // margin-bottom: 10px;
            }
        }
    }
}
</style>

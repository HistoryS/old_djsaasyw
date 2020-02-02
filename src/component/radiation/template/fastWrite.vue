<template>
    <div class="fastWrite">
        <!--头部包含面包屑导航和搜索栏部分-->
        <div class="header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>放射设置</el-breadcrumb-item>
                <el-breadcrumb-item>模版设置</el-breadcrumb-item>
                <el-breadcrumb-item>快速书写模版</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="nav">
                <el-form :inline="true" ref="condition" :model="condition">
                    <el-form-item label="检查类型:" prop="examineType">
                        <el-select v-model="condition.examineType" placeholder="请选择检查类型">
                            <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="loadTemplateList(true)">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('condition','loadTemplateList')">重置</el-button>
            </nav>
        </div>
        <!--包含新建、刷新按钮和表格条目数量显示部分-->
        <div class="total">
            <el-button type="primary" @click="handleCreate()">新增</el-button>
            <el-button class='refresh' :plain="true" type="info" @click="loadTemplateList(true)">刷新
            </el-button>
            <span>快速书写模版共
                <em> {{count}} </em>条</span>
        </div>
        <!--表格部分-->
        <div class="content">
            <el-table highlight-current-row @row-dblclick='handleEdit' v-scroll="loadTemplateList" class="table" height=" " :data="templateList" border stripe>
                <el-table-column label="操作" align="center" width="100">
                    <template scope="scope">
                        <el-tooltip content="编辑" placement="top">
                            <el-button size="mini" :plain="true" type="success" icon="edit" @click="handleEdit(scope.$index)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button size="mini" :plain="true" type="danger" icon="delete" @click="handleDelete(scope.$index)"></el-button>
                        </el-tooltip>
                        <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                        <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                    </template>
                </el-table-column>
                <el-table-column width='100' :show-overflow-tooltip="true" prop="examineType" label="检查类型" align="center"></el-table-column>
                <el-table-column width='100' :show-overflow-tooltip="true" prop="templateName" label="模版名称" align="center"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="findings" label="影像所见" align="center"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="diagnosis" label="影像诊断" align="center"></el-table-column>
            </el-table>
        </div>
        <!--新建和编辑公用弹窗-->
        <div class="dialog">
            <el-dialog top='5%' @close="resetForm('form')" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑快速书写模版':'新建快速书写模版'" v-model="alert.dialogFormVisible">
                <el-form label-position="right" :model="form" ref="form" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查类型:" prop="examineTypeID">
                                <el-select v-model="form.examineTypeID" placeholder="请选择检查类型">
                                    <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="模版名称:" prop="templateName">
                                <el-input v-model="form.templateName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="影像所见:" prop="findings">
                                <el-input type="textarea" v-model="form.findings" :rows="8"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="影像诊断:" prop="diagnosis">
                                <el-input type="textarea" v-model="form.diagnosis" :rows="4"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form','handleSave','dialogFormVisible')">保 存
                    </el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form','handleSave')">保存并新建
                    </el-button>
                    <el-button @click="alert.dialogFormVisible=false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import location from '../../../location/location.js'
import { mapState } from 'vuex';

export default {
    data() {
        return {
            // 条目总数
            count: -1,
            // 页码
            page: 0,
            // 是否编辑模式
            isEditing: false,
            // 弹窗是否显示
            alert: {
                dialogFormVisible: false,
            },
            // 表单校验规则
            rules: {
                examineTypeID: [{
                    required: true,
                    message: '请选择检查类型',
                    trigger: 'change'
                }],
                templateName: [{
                    required: true,
                    message: '模版名称不能为空',
                    trigger: 'blur'
                }],
                findings: [{ max: 1000, message: '最多只能输入1000个字', trigger: 'change' }],
                diagnosis: [{ max: 1000, message: '最多只能输入1000个字', trigger: 'change' }]
            },
            // 弹窗表单数据
            form: {
                examineTypeID: '',
                templateName: '',
                findings: '',
                diagnosis: '',
            },
            // 表格数据
            templateList: [],
            // 下拉框列表项
            optionList: {
                examineType: []
            },
            // 选中的下拉列表项
            condition: {
                examineType: ''
            }
        }
    },
    methods: {
        /* 发送get请求的公共方法
         * @param url 是请求地址
         * @param data 请求数据
         * @param callback 成功回调函数
         */
        get(url, data, callback) {
            this.$http.get(url, { params: data } || {}).then(res => {
                callback(res.body.data)
            })
        },
        /**
         * 发送post请求的公共方法
         * @param url 请求地址
         * @param data 请求数据
         * @param callback 成功回调函数
         */
        post(url, data, callback) {
            this.$http.post(url, data || {}).then(res => {
                callback(res.body.data)
            })
        },
        /**
         * 顶部消息提示公共方法
         * @param type 消息类型
         * @param message 消息文本
         */
        showMsg(type, message) {
            this.$message({ type, message, duration: 1000 })
        },
        /**
         *  加载表格数据
         * @param reload 是否重新从第一页加载数据，默认false
         * @param condition 搜索条件
         */
        loadTemplateList(reload) {
            this.page = reload ? 0 : this.page + 1
            let data = {
                systemID: this.radiation,
                page: this.page,
                pageSize: this.pageSize,
                count: -1,
                examineTypeID: this.condition.examineType
            }
            this.get(location.loadQuickWriteTemplate, data, res => {
                this.count = res.count
                if (reload) {
                    this.templateList = res.data || []
                    return
                }
                this.templateList.push(...res.data)
            })
        },
        // 加载搜索条件数据
        loadOptionList() {
            this.get(location.loadExamineType, { systemID: this.radiation }, res => {
                this.optionList.examineType = res.data || []
                this.condition.examineType = res.data[0].id
                this.loadTemplateList(true)
            })
        },
        // 保存或保存并新建按钮点击处理
        handleSave(resolve) {
            // 如果是编辑模式就修改，否则就新建
            let url = this.isEditing ? location.updateQuickWriteTemplate : location.insertQuickWriteTemplate
            let data = this.copy(this.form)
            data.systemID = this.radiation
            console.log(data)
            this.post(url, data, () => {
                this.showMsg('success', '保存成功！')
                this.loadTemplateList(true)
                if (this.isEditing) {
                    this.condition.examineType = []
                }
                resolve()
            })
        },
        // 删除按钮点击处理
        handleDelete(index) {
            this.$confirm(`您确认要删除名称为“${this.templateList[index].templateName}”的快速书写模板吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = { systemID: this.radiation, id: this.templateList[index].id }
                this.get(
                    location.deleteQuickWriteTemplate, data, () => {
                        this.showMsg('success', '删除成功！')
                        this.templateList.splice(index, 1)
                        this.count--
                    })
            })
        },
        // 新建按钮点击处理
        handleCreate() {
            this.alert.dialogFormVisible = true
            this.isEditing = false
            this.form.examineTypeID = this.optionList.examineType[0].id
        },
        // 编辑按钮点击处理
        handleEdit(x) {
            this.alert.dialogFormVisible = true
            this.isEditing = true
            setTimeout(() => {
                this.form = this.copy(isNaN(x) ? this.copy(x) : this.templateList[x])
            }, 0)
        }
    },
    computed: {
        ...mapState([
            "pageSize",
            "radiation",
            "platform",
        ])
    },
    // 初始化加载数据
    created() {
        this.loadOptionList()
    }
};
</script>
<style lang="less">
.el-tooltip__popper {
    max-width: 90%;
    word-break: break-all;
}

.fastWrite {
    .nav,
    .total {
        .el-button {
            margin: 0 .5em;
        }
        .el-form-item {
            margin-right: .5em;
        }
    }
    .header {
        .crumbs {
            width: 96%;
            margin: 10px auto;
            flex-shrink: 0;
        }
        .nav {
            width: 96%;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            margin: 0 auto;
            padding: 1em;
            background: #f2f2f2;
            .el-input {
                // width: 190px;
            }
            .el-form-item {
                margin-bottom: 0;
            }
        }
    }
    .total {
        width: 96%;
        margin: 10px auto 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-shrink: 0;
        em {
            color: #4bc889;
        }
        .el-button {
            margin: 0 .5em;
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
            .el-button+.el-button {
                margin-left: 0;
            }
        }
    }
    .dialog {
        .el-select {
            width: 100%;
        }
        .el-button {
            margin: 0 .5em;
        }
        textarea {
            font-size: 16px;
        }
    }
}
</style>

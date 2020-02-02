<template>
    <div class="reportWrite">
        <div class="header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>放射设置</el-breadcrumb-item>
                <el-breadcrumb-item>模版设置</el-breadcrumb-item>
                <el-breadcrumb-item>报告书写模版</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="nav">
                <el-form :inline="true" ref="condition" :model="condition">
                    <el-form-item label="检查类型:" prop="examineType">
                        <el-select @change="loadExaminePart" v-model="condition.examineType" placeholder="请输入或选择检查类型">
                            <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检查部位:" prop="examinePart">
                        <el-cascader change-on-select v-model="condition.examinePart" placeholder="请输入或选择检查部位" :options="optionList.examinePart" :props="cascaderProps" filterable></el-cascader>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="loadTemplateList(true,condition)">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('condition','loadTemplateList');optionList.examinePart=[]">重置</el-button>
            </nav>
        </div>
        <div class="total">
            <el-button type="primary" @click="handleCreate()" :disabled="condition.examinePart.length<2">新增</el-button>
            <el-button class='refresh' :plain="true" type="info" @click="loadTemplateList(true)">刷新
            </el-button>
            <span>报告书写模版共
                <em> {{count}} </em>条</span>
        </div>
        <div class="content">
            <div class="wrap">
                <!--左侧表格区-->
                <el-table stripe ref="table" @row-dblclick='handleEdit' v-scroll="loadTemplateList" highlight-current-row @current-change="handleCurrentChange" class="table" height=" " :data="templateList" border stripe>
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
                        .
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="templateName" label="模版名称" align="center">132
                    </el-table-column>
                </el-table>
                <!--右侧编辑区-->
                <div class="editarea">
                    <el-form label-position="right" :model="currentRow" label-width="85px">
                        <el-row>
                            <el-col :span="20" :offset="2">
                                <el-form-item label="模版名称:">
                                    <el-input disabled v-model="currentRow.templateName"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20" :offset="2">
                                <el-form-item label="阴阳性:">
                                    <el-radio-group v-model="currentRow.masculine">
                                        <el-radio disabled label="0">阴性</el-radio>
                                        <el-radio disabled label="1">阳性</el-radio>
                                        <el-radio disabled label="2">不详</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20" :offset="2">
                                <el-form-item label="影像所见:">
                                    <el-input disabled resize="none" type="textarea" v-model="currentRow.findings" :rows="10"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20" :offset="2">
                                <el-form-item label="影像诊断:">
                                    <el-input disabled resize="none" type="textarea" v-model="currentRow.diagnosis" :rows="10"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="dialog">
            <el-dialog top="5%" @open='form.examineTypeID = condition.examineType' @close="resetForm('form')" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑报告书写模版':'新建报告书写模版'" v-model="alert.dialogFormVisible">
                <el-form label-position="right" :model="form" ref="form" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查类型:" prop="examineTypeID">
                                <el-select :disabled="true" v-model="form.examineTypeID" placeholder="请输入或选择检查类型">
                                    <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item prop="defaultTemplate">
                                <el-checkbox :true-label="1" :false-label="0" v-model="form.defaultTemplate">默认模版
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="模版名称:" prop="templateName">
                                <el-input v-model="form.templateName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="阴阳性:" prop="masculine">
                                <el-radio-group v-model="form.masculine">
                                    <el-radio label="0">阴性</el-radio>
                                    <el-radio label="1">阳性</el-radio>
                                    <el-radio label="2">不详</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="影像所见:" prop="findings">
                                <el-input type="textarea" v-model="form.findings" :rows="7"></el-input>
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
                    <el-button @click="alert.dialogFormVisible = false">取 消</el-button>
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
            // 页码
            page: 0,
            // 表格数据条目总数
            count: 0,
            // 当前被点击行的数据
            currentRow: {},
            // 当前被编辑行的索引
            editIndex: 0,
            // 是否编辑模式
            isEditing: false,
            // 弹窗是否显示
            alert: {
                dialogFormVisible: false,
            },
            // 弹窗表单校验规则
            rules: {
                templateName: [{
                    required: true,
                    message: '请输入模版名称',
                    trigger: 'blur'
                }],
                examineTypeID: [{
                    required: true,
                    message: '请选择检查类型',
                    trigger: 'change'
                }],
                diagnosis: [
                    { max: 1000, message: '最多可以输入1000个字', trigger: 'change' }
                ],
                findings: [
                    { max: 1000, message: '最多可以输入1000个字', trigger: 'change' }
                ]
            },
            // 弹窗表单数据
            form: {
                examineTypeID: '',
                defaultTemplate: 0,
                templateName: '',
                masculine: '0',
                findings: '',
                diagnosis: '',
            },
            // 下拉框列表项
            optionList: {
                examineType: [],
                examinePart: []
            },
            // 选中的下拉列表项
            condition: {
                examineType: '',
                examinePart: [],
            },
            // 表格数据
            templateList: [],
            cascaderProps: {
                value: 'id',
                label: 'partName',
                children: 'childs'
            }
        }
    },
    methods: {
        showMsg(type, message) {
            this.$message({ type, message, duration: 1000 })
        },
        post(url, data, callback) {
            this.$http.post(url, data || {}).then(res => {
                callback(res.body.data);
            })
        },
        get(url, data, callback) {
            this.$http.get(url, { params: data } || {}).then(res => {
                callback(res.body.data)
            })
        },
        // 加载表格数据
        loadTemplateList(reload) {
            this.page = reload ? 0 : this.page + 1
            let data = {
                systemID: this.radiation,
                page: this.page,
                pageSize: this.pageSize,
                count: -1,
                examineTypeID: this.condition.examineType,
                classRealtedID: this.condition.examinePart[this.condition.examinePart.length - 1] || ''
            }
            this.get(location.loadWriteTemplate, data, res => {
                this.count = res.count
                if (reload) {
                    this.templateList = res.data || []
                    setTimeout(() => {
                        // this.$refs.table.setCurrentRow(this.templateList[0]);
                    }, 0);
                    return
                }
                this.templateList.push(...res.data)
            })
        },
        // 选择检查类型以后加载检查部位
        loadExaminePart() {
            this.condition.examinePart = []
            if (!this.condition.examineType) return
            this.get(location.getExaminePartAndChildParts, {
                systemID: this.radiation,
                examineTypeID: this.condition.examineType
            }, res => {
                for (let i = 0; i < res.length; i++) {
                    res[i].childs = res[i].childs.length == 0 ? undefined : res[i].childs
                }
                this.optionList.examinePart = res || []
                this.condition.examinePart = res[0].childs ? [res[0].id, res[0].childs[0].id] : []
                if (this.templateList.length == 0)
                    this.loadTemplateList(true)
            })
        },
        // 加载检查类型
        loadExamineType() {
            this.get(location.loadExamineType, { systemID: this.radiation }, res => {
                this.optionList.examineType = res.data || []
                this.condition.examineType = res.data[0].id
            })
        },
        // 点击行的操作
        handleCurrentChange(val) {
            this.currentRow = val || {}
        },
        // 保存或保存并新建按钮点击处理
        handleSave(resolve) {
            // 如果是编辑模式就修改，否则就新建
            let url = this.isEditing ? location.updateWriteTemplate : location.insertWriteTemplate
            let data = this.copy(this.form)
            data.classRealtedID = this.isEditing ? data.classRealtedID : this.condition.examinePart[this.condition.examinePart.length - 1]
            data.systemID = this.radiation
            this.post(url, data, () => {
                this.showMsg('success', '保存成功！')
                this.loadTemplateList(true)
                resolve()
            })
        },
        // 删除按钮点击处理
        handleDelete(index) {
            this.$confirm(`您确认要删除“${this.templateList[index].templateName}”报告书写模板？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = { systemID: this.radiation, id: this.templateList[index].id }
                this.get(
                    location.deleteWriteTemplate, data, () => {
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
        },
        // 编辑按钮点击处理
        handleEdit(index) {
            this.alert.dialogFormVisible = true
            this.isEditing = true
            setTimeout(() => {
                this.form = isNaN(index) ? this.copy(index) : this.copy(this.templateList[index])
            }, 0)
        }
    },
    created() {
        this.loadExamineType()
    },
    computed: {
        ...mapState([
            "pageSize",
            "radiation"
        ])
    }
}
</script>
<style lang="less">
.reportWrite {
    .el-tooltip__popper {
        max-width: 90%;
        word-break: break-all;
    }
    .el-dialog__body {
        padding-bottom: 0;
    }
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
            .el-button {
                margin: 0 .5em;
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
    .dialog {
        .el-button {
            margin: 0 .5em;
        }
    }
    .content {
        width: 96%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        .wrap {
            height: 0;
            flex-grow: 1;
            .table {
                width: 50%;
                height: 100%;
                float: left;
                .el-button+.el-button {
                    margin-left: 0;
                }
            }
            .editarea {
                border: 1px solid #dfe6ec;
                border-left: none;
                width: 50%;
                height: 100%;
                float: left;
                padding: 20px;
                overflow: auto;
                input,
                textarea,
                .el-radio span {
                    color: #666
                }
            }
        }
    }
}
</style>

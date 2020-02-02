<template>
    <div class="qualityScore">
        <!--头部包含面包屑导航和搜索栏部分-->
        <div class="header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>放射设置</el-breadcrumb-item>
                <el-breadcrumb-item>模版设置</el-breadcrumb-item>
                <el-breadcrumb-item>质控评分模版</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="nav">
                <el-form :inline="true" ref="condition" :model="condition">
                    <el-form-item label="评分类型:" prop="qcScoreType">
                        <el-select v-model="condition.qcScoreType" placeholder="请选择评分类型">
                            <el-option v-for="item in optionList.qcScoreType" :label="item.text" :value="item.val"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="检查类型:" prop="examineType">
                        <el-select v-model="condition.examineType" placeholder="请选择检查类型">
                            <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模版名称:" prop="templateName">
                        <el-input v-model="condition.templateName" placeholder="请输入模版名称"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="loadTemplateList(true)">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('condition','loadTemplateList')">重置</el-button>
            </nav>
        </div>
        <!--包含新建、刷新按钮和表格条目数量显示部分-->
        <div class="total">
            <el-button type="primary" @click="handleCreate_template">新增</el-button>
            <el-button class='refresh' :plain="true" type="info" @click="loadTemplateList(true)">
                刷新
            </el-button>
            <span>质控评分模版共
                <em> {{count.template}} </em>条</span>
        </div>
        <!--表格部分-->
        <div class="content">
            <div class="top-table">
                <el-table @row-dblclick='handleEdit_template' highlight-current-row @current-change="handleCurrentChange" v-scroll="loadTemplateList" class="table" height=" " :data="templateList" border stripe>
                    <el-table-column label="操作" align="center" width="100">
                        <template scope="scope">
                            <el-tooltip content="编辑" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="edit" @click="handleEdit_template(scope.$index)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="handleDelete_template(scope.$index)"></el-button>
                            </el-tooltip>
                            <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                            <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                        </template>
                    </el-table-column>
                    <el-table-column width="120" :show-overflow-tooltip="true" prop="pflx" label="评分类型" align="center"></el-table-column>
                    <el-table-column width="120" :show-overflow-tooltip="true" prop="examineType" label="检查类型" align="center"></el-table-column>
                    <el-table-column width="120" :show-overflow-tooltip="true" prop="templateName" label="模版名称" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="scoreLevel" label="得分等级" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="bottom-table">
                <div class="total">
                    <el-button type="primary" @click="handleCreate_norm" :disabled="!currentRow">新增
                    </el-button>
                    <el-button class='refresh' :plain="true" type="info" @click="loadNormList(true)" :disabled="!currentRow">刷新
                    </el-button>
                    <span>指标管理共
                        <em> {{count.norm}} </em>条</span>
                </div>
                <el-table highlight-current-row @row-dblclick='handleEdit_norm' v-scroll="loadNormList" class="table" height=" " :data="normList" border stripe>
                    <el-table-column label="操作" align="center" width="100">
                        <template scope="scope">
                            <el-tooltip content="编辑" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="edit" @click="handleEdit_norm(scope.$index)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="handleDelete_norm(scope.$index)"></el-button>
                            </el-tooltip>
                            <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                            <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="qcScoreNormName" label="指标" align="center"></el-table-column>
                    <el-table-column width="100" :show-overflow-tooltip="true" prop="normScore" label="对应分数" align="center"></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" align="center"></el-table-column>
                </el-table>
    
            </div>
        </div>
        <!--新建和编辑质控评分模版弹窗-->
        <div class="dialog">
            <el-dialog top='5%' @close="resetForm('form_template')" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑质控评分模版':'新建质控评分模版'" v-model="alert.template">
                <el-form label-position="right" :model="form_template" ref="form_template" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="评分类型:" prop="pflx">
                                <el-select v-model="form_template.pflx" placeholder="请选择评分类型">
                                    <el-option v-for="item in optionList.qcScoreType" :label="item.text" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="模版名称:" prop="mbmc">
                                <el-input v-model="form_template.mbmc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查类型:" prop="jclx">
                                <el-select v-model="form_template.jclx" placeholder="请选择检查类型">
                                    <el-option v-for="item in optionList.examineType" :label="item.examineType" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="总评分:" prop="zpf">
                                <el-input-number :min='0' :max='10000' v-model="form_template.zpf"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="优秀:" prop="yx1">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.yx1"></el-input-number>
                                    </el-col>
                                    <el-col :span="6">
                                        <span class="separator">——</span>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item prop="yx2">
                                            <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.yx2"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="良好:" prop="lh1">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.lh1"></el-input-number>
                                    </el-col>
                                    <el-col :span="6">
                                        <span class="separator">——</span>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item prop="lh2">
                                            <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.lh2"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="合格:" prop="hg1">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.hg1"></el-input-number>
                                    </el-col>
                                    <el-col :span="6">
                                        <span class="separator">——</span>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item prop="hg2">
                                            <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.hg2"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="不合格:" prop="bhg1">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input-number :disabled='false' :min='0' :max='0' :controls='false' v-model="form_template.bhg1"></el-input-number>
                                    </el-col>
                                    <el-col :span="6">
                                        <span class="separator">——</span>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item prop="bhg2">
                                            <el-input-number :min='0' :max='10000' :controls='false' v-model="form_template.bhg2"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="pjnr" label="评价内容:">
                                <el-input type="textarea" v-model="form_template.pjnr" :rows="7"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form_template','handleSave_template','template')">保 存
                    </el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form_template','handleSave_template')">保存并新建
                    </el-button>
                    <el-button @click="alert.template = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <!--新建和编辑指标弹窗-->
        <div class="dialog">
            <el-dialog @close="resetForm('form_norm')" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑指标':'新建指标'" v-model="alert.norm">
                <el-form label-position="right" :model="form_norm" ref="form_norm" :rules="rules" label-width="180px">
                    <el-row>
                        <el-col :span="24" :offset="1">
                            <el-form-item :label="'模版“'+(currentRow?currentRow.templateName:'')+'”下指标'"></el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="指标名称:" prop="qcScoreNormName">
                                <el-input v-model="form_norm.qcScoreNormName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="对应分数:" prop="normScore">
                                <el-input-number :min='0' :max='10000' v-model="form_norm.normScore"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="备注:" prop="remark">
                                <el-input type="textarea" :rows="5" v-model="form_norm.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form_norm','handleSave_norm','norm')">保 存
                    </el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form_norm','handleSave_norm')">保存并新建
                    </el-button>
                    <el-button @click="resetForm('form_norm','norm')">取 消</el-button>
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
            page: {
                template: 0,
                norm: 0
            },
            count: {
                template: 0,
                norm: 0
            },
            // 是否编辑模式
            isEditing: false,
            // 弹窗是否显示
            alert: {
                template: false,
                norm: false,
            },
            // 表单校验规则
            rules: {
                pflx: [{
                    type: 'number',
                    required: true,
                    message: '请选择评分类型',
                    trigger: 'blur'
                }],
                jclx: [{
                    required: true,
                    message: '请选择检查类型',
                    trigger: 'blur'
                }],
                mbmc: [{
                    required: true,
                    message: '请输入模版名称',
                    trigger: 'blur'
                }],
                zpf: [{ required: true }],
                yx1: [{
                    // type: 'number',
                    required: true,
                    message: '优秀范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.yx1 > this.form_template.yx2) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                yx2: [{
                    // type: 'number',
                    required: true,
                    message: '优秀范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.yx2 > this.form_template.zpf) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                lh1: [{
                    // type: 'number',
                    required: true,
                    message: '良好范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.lh1 > this.form_template.lh2) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                lh2: [{
                    // type: 'number',
                    required: true,
                    message: '良好范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.lh2 >= this.form_template.yx1) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                hg1: [{
                    // type: 'number',
                    required: true,
                    message: '合格范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.hg1 > this.form_template.hg2) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                hg2: [{
                    // type: 'number',
                    required: true,
                    message: '合格范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.hg2 >= this.form_template.lh1) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                    // }
                }],
                bhg1: [{
                    // type: 'number',
                    required: true,
                    message: '不合格范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.bhg1 > this.form_template.bhg2) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                bhg2: [{
                    // type: 'number',
                    required: true,
                    message: '不合格范围错误',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.form_template.bhg2 >= this.form_template.hg1) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }
                }],
                qcScoreNormName: [{
                    required: true,
                    message: '请输入指标名称',
                    trigger: 'blur'
                }],
                normScore: [{
                    required: true
                }],
                remark: [{ max: 250, message: '最多只能输入250个字', trigger: 'blur' }],
                pjnr: [{ max: 250, message: '最多只能输入250个字', trigger: 'blur' }]
            },
            // 新建或编辑质控评分模版表单数据
            form_template: {
                pflx: '',
                mbmc: '',
                jclx: '',
                zpf: 100,
                yx1: '',
                yx2: '',
                lh1: '',
                lh2: '',
                hg1: '',
                hg2: '',
                bhg1: '',
                bhg2: '',
                pjnr: ''
            },
            // 新建或编辑指标表单数据
            form_norm: {
                qcScoreNormName: '',
                normScore: '',
                remark: ''
            },
            // 顶部表格数据
            templateList: [],
            // 底部表格数据
            normList: [],
            // 被点击那行的数据
            currentRow: null,
            // 下拉菜单列表
            optionList: {
                qcScoreType: [
                    { text: '报告评分', val: 1 },
                    { text: '摄片评分', val: 2 }
                ],
                examineType: []
            },
            condition: {
                qcScoreType: '',
                examineType: '',
                templateName: ''
            }
        };
    },
    methods: {
        // 评分转换
        scoreTranslate(data) {
            for (let i = 0; i < data.length; i++) {
                for (let j in data[i]) {
                    if (j == 'excellentScope') {
                        let arr = data[i][j].split('^')
                        data[i].scoreLevel = `优 ${arr[0]}-${arr[1]} 分；`;
                    } else if (j == 'goodScope') {
                        let arr = data[i][j].split('^')
                        data[i].scoreLevel += `良 ${arr[0]}-${arr[1]} 分；`;
                    } else if (j == 'passScope') {
                        let arr = data[i][j].split('^')
                        data[i].scoreLevel += `及格 ${arr[0]}-${arr[1]} 分；`;
                    } else if (j == 'failScope') {
                        let arr = data[i][j].split('^')
                        data[i].scoreLevel += `不及格 ${arr[0]}-${arr[1]} 分`;
                    }
                }
            }
            return data
        },
        handleCurrentChange(val) {
            this.currentRow = val;
            val ? this.loadNormList(true) : this.normList = []
        },
        get(url, data, callback) {
            this.$http.get(url, { params: data } || {}).then(res => {
                callback(res.body.data)
            })
        },
        post(url, data, callback) {
            this.$http.post(url, data || {}).then(res => {
                callback(res.body.data)
            })
        },
        showMsg(type, message) {
            this.$message({ type, message, duration: 1000 });
        },
        // 加载模板列表
        loadTemplateList(reload) {
            this.page.template = reload ? 0 : this.page.template + 1;
            let data = {
                systemID: this.radiation,
                page: this.page.template,
                pageSize: this.pageSize,
                count: -1,
                qcScoreType: this.condition.qcScoreType,
                examineTypeID: this.condition.examineType,
                templateName: this.condition.templateName
            }
            this.get(location.queryQCScoreTemplate, data, res => {
                this.count.template = res.count;
                for (let i = 0; i < res.data.length; i++) {
                    for (let j in res.data[i]) {
                        if (j === 'qcScoreType') {
                            res.data[i].pflx = res.data[i][j] == '1' ? '报告评分' : '摄片评分'
                        }
                    }
                }
                if (reload) {
                    this.templateList = this.scoreTranslate(res.data) || []
                    return;
                }
                this.templateList.push(...data);
            });
        },
        // 加载指标列表
        loadNormList(reload) {
            this.page.norm = reload ? 0 : this.page.norm + 1;
            let data = {
                systemID: this.radiation,
                page: this.page.norm,
                pageSize: this.pageSize,
                count: -1,
                qcScoreTemplateID: this.currentRow.id
            };
            this.get(location.queryQCScoreNorm, data, res => {
                this.count.norm = res.count;
                if (reload) {
                    this.normList = res.data || [];
                    return;
                }
                this.normList.push(...res.data);
            });
        },
        // 加载下拉框列表项
        loadOptionList() {
            this.get(location.loadExamineType, { systemID: this.radiation }, res => {
                this.optionList.examineType = res.data || []
                this.condition.examineType = res.data[0].id
                this.loadTemplateList(true);
            })
        },
        // 顶部表格编辑按钮点击处理
        handleEdit_template(index) {
            this.alert.template = true;
            this.isEditing = true;
            setTimeout(() => {
                if (!isNaN(index)) {
                    this.form_template = {
                        pflx: this.copy(this.templateList[index].qcScoreType),
                        mbmc: this.copy(this.templateList[index].templateName),
                        jclx: this.copy(this.templateList[index].examineTypeID),
                        zpf: this.copy(this.templateList[index].totalScroe),
                        yx1: this.copy(this.templateList[index].excellentScope.split('^')[0]),
                        yx2: this.copy(this.templateList[index].excellentScope.split('^')[1]),
                        lh1: this.copy(this.templateList[index].goodScope.split('^')[0]),
                        lh2: this.copy(this.templateList[index].goodScope.split('^')[1]),
                        hg1: this.copy(this.templateList[index].passScope.split('^')[0]),
                        hg2: this.copy(this.templateList[index].passScope.split('^')[1]),
                        bhg1: this.copy(this.templateList[index].failScope.split('^')[0]),
                        bhg2: this.copy(this.templateList[index].failScope.split('^')[1]),
                        pjnr: this.copy(this.templateList[index].describe),
                    };
                } else {
                    this.form_template = {
                        pflx: this.copy(index.qcScoreType),
                        mbmc: this.copy(index.templateName),
                        jclx: this.copy(index.examineTypeID),
                        zpf: this.copy(index.totalScroe),
                        yx1: this.copy(index.excellentScope.split('^')[0]),
                        yx2: this.copy(index.excellentScope.split('^')[1]),
                        lh1: this.copy(index.goodScope.split('^')[0]),
                        lh2: this.copy(index.goodScope.split('^')[1]),
                        hg1: this.copy(index.passScope.split('^')[0]),
                        hg2: this.copy(index.passScope.split('^')[1]),
                        bhg1: this.copy(index.failScope.split('^')[0]),
                        bhg2: this.copy(index.failScope.split('^')[1]),
                        pjnr: this.copy(index.describe),
                    };
                }
            }, 0)
        },
        // 底部编辑按钮点击处理
        handleEdit_norm(index) {
            this.alert.norm = true;
            this.isEditing = true;
            setTimeout(() => {
                this.form_norm = isNaN(index) ? this.copy(index) : this.copy(this.normList[index]);
                console.log(this.form_norm)
            }, 0)
        },
        // 顶部表格删除按钮点击处理
        handleDelete_template(index) {
            this.$confirm(`您确认要删除“${this.templateList[index].templateName}”快速书写模板？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = { id: this.templateList[index].id };
                this.get(location.deleteQCScoreTemplate, data, () => {
                    this.showMsg('success', '删除成功！');
                    this.templateList.splice(index, 1);
                    this.count.template--
                });
            });
        },
        // 底部删除按钮点击处理
        handleDelete_norm(index) {
            this.$confirm(`您确认要删除“${this.normList[index].qcScoreNormName}”指标？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = { id: this.normList[index].id };
                this.get(location.deleteQCScoreNorm, data, res => {
                    this.showMsg('success', '删除成功！');
                    this.normList.splice(index, 1);
                    this.count.norm--
                });
            });
        },
        // 质控评分模版保存或保存并新建按钮点击处理
        handleSave_template(resolve) {
            // 如果是编辑模式就更新，否则就新建
            let url = this.isEditing ? location.updateQCScoreTemplate : location.addQCScoreTemplate;
            let data = {
                systemID: this.radiation,
                templateName: this.form_template.mbmc,
                qcScoreType: this.form_template.pflx,
                examineTypeID: this.form_template.jclx,
                totalScroe: this.form_template.zpf,
                excellentScope: this.form_template.yx1 + '^' + this.form_template.yx2,
                goodScope: this.form_template.lh1 + '^' + this.form_template.lh2,
                passScope: this.form_template.hg1 + '^' + this.form_template.hg2,
                failScope: this.form_template.bhg1 + '^' + this.form_template.bhg2,
                describe: this.form_template.pjnr,
            };
            if (this.isEditing) {
                data.id = this.currentRow.id || ''
            }
            this.post(url, data, res => {
                this.showMsg('success', '保存成功！');
                this.loadTemplateList(true);
                resolve()
            });
        },
        // 指标保存或保存并新建按钮点击处理
        handleSave_norm(resolve) {
            let url = this.isEditing ? location.updateQCScoreNorm : location.addQCScoreNorm;
            let data = this.copy(this.form_norm);
            data.qcScoreTemplateID = this.currentRow.id
            this.post(url, data, () => {
                this.showMsg('success', '保存成功！');
                this.loadNormList(true);
                resolve()
            });
        },

        // 新建按钮点击处理
        handleCreate_template() {
            this.alert.template = true
            this.isEditing = false
            this.form_template.jclx = this.optionList.examineType[0].id
            console.log(this.optionList.examineType[0].id)
        },
        // 新建按钮点击处理
        handleCreate_norm() {
            this.alert.norm = true
            this.isEditing = false
        },
    },
    // 初始化加载数据
    created() {
        this.loadOptionList();
    },
    computed: {
        ...mapState([
            "pageSize",
            "radiation"
        ])
    },
};
</script>
<style lang="less">
.qualityScore {
    .el-tooltip__popper {
        max-width: 90%;
        word-break: break-all;
    }
    .nav {
        .el-form {
            display: flex;
            align-items: center;
        }
        .el-form-item {
            display: flex;
            align-items: center;
            .el-select,
            .el-input {
                width: 12vw;
                min-width: 120px;
                max-width: 190px;
            }
        }
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
        .top-table {
            height: 50%;
        }
        .bottom-table {
            height: 50%;
            display: flex;
            flex-direction: column;
            .total {
                width: 100%;
                flex-shrink: 0;
            }
        }
        .table {
            height: 100%;
            flex-shrink: 1;
            .el-button+.el-button {
                margin-left: 0;
            }
        }
    }
    .dialog {
        .separator {
            display: inline-block;
            width: 100%;
            text-align: center;
        }
        .el-button {
            margin: 0 .5em;
        }
        .el-input-number,
        .el-select {
            width: 100%;
        }
    }
}
</style>

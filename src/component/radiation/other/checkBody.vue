<template>
    <div class="checkBody">
        <!--头部包含面包屑导航和搜索栏部分-->
        <div class="header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>放射设置</el-breadcrumb-item>
                <el-breadcrumb-item>其他设置</el-breadcrumb-item>
                <el-breadcrumb-item>检查部位</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--包含新建、刷新按钮和表格条目数量显示部分-->
        <div class="total">
            <el-button type="primary" @click="create_top">新增</el-button>
            <el-button class='refresh' :plain="true" type="info" @click="loadTopTableData(true);">刷新</el-button>
            <span>检查部位共
                <em> {{count.top}} </em>条</span>
        </div>
        <!--表格部分-->
        <div class="content">
            <!--树形-->
            <div class="treeArea">
                <el-tree highlight-current :data="treeData" :props="treeProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="wrap">
                <div class="top-table">
                    <el-table @row-dblclick='edit_top' highlight-current-row @current-change="click_top" class="table" height=" " :data="topTableData" border>
                        <el-table-column label="操作" align="center" width="100">
                            <template scope="scope">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button size="mini" :plain="true" type="success" icon="edit" @click="edit_top(scope.$index)"></el-button>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-button size="mini" :plain="true" type="danger" icon="delete" @click="del_top(scope.$index)"></el-button>
                                </el-tooltip>
                                <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                                <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                            </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="partCode" label="部位代码" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="partName" label="部位名称" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="parentPartCode" label="上级部位代码" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="parentPartName" label="上级部位名称" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="spliteCount" label="拆分部位数" align="center"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="examineFees" label="检查费用" align="center"></el-table-column>
                        <el-table-column width="80" :show-overflow-tooltip="true" prop="filmCount" label="胶片数" align="center"></el-table-column>
                    </el-table>
                </div>
                <div class="bottom-table">
                    <div class="left">
                        <section class="btm-total">
                            <el-button :disabled="!topTableSelectedRow" type="primary" @click="alert.left  = true;isEditing = false">新增
                            </el-button>
                            <el-button class="refresh" :disabled="!topTableSelectedRow" :plain="true" type="info" @click="loadLeftTableData(true)">刷新
                            </el-button>
                            <span>拆分部位共
                                <em> {{count.left}} </em>条</span>
                        </section>
                        <el-table @row-dblclick='edit_left' highlight-current-row @current-change="click_left" class="table" height=" " :data="topTableSelectedRow?leftTableData:[]" border>
                            <el-table-column label="操作" align="center" width="100">
                                <template scope="scope">
                                    <el-tooltip content="编辑" placement="top">
                                        <el-button size="mini" :plain="true" type="success" icon="edit" @click="edit_left(scope.$index)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="删除" placement="top">
                                        <el-button size="mini" :plain="true" type="danger" icon="delete" @click="del_left(scope.$index)"></el-button>
                                    </el-tooltip>
                                    <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                                    <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="splitePartName" label="拆分部位" align="center"></el-table-column>
                        </el-table>
                    </div>
                    <div class="right">
                        <section class="btm-total">
                            <el-button :disabled="!leftTableSelectedRow" type="primary" @click="alert.right = true;isEditing = false">新增
                            </el-button>
                            <el-button class="refresh" :disabled="!leftTableSelectedRow" :plain="true" type="info" @click="loadRightTableData(true)">刷新
                            </el-button>
                            <span>部位参数共
                                <em> {{count.right}} </em>条</span>
                        </section>
                        <el-table highlight-current-row @row-dblclick='edit_right' class="table" height=" " :data="leftTableSelectedRow?rightTableData:[]" border>
                            <el-table-column label="操作" align="center" width="100">
                                <template scope="scope">
                                    <el-tooltip content="编辑" placement="top">
                                        <el-button size="mini" :plain="true" type="success" icon="edit" @click="edit_right(scope.$index)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="删除" placement="top">
                                        <el-button size="mini" :plain="true" type="danger" icon="delete" @click="del_right(scope.$index)"></el-button>
                                    </el-tooltip>
                                    <!--<el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>-->
                                    <!--<el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>-->
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="paramName" label="参数名称" align="center"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="paramValue" label="参数值" align="center"></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="paramUnit" label="参数单位" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!--新建和编辑检查部位弹窗-->
        <div class="dialog-jcbw">
            <el-dialog top='5%' @close="resetForm('form_top')" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑检查部位':'新建检查部位'" v-model="alert.top">
                <el-form label-position="right" :model="form_top" ref="form_top" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查类型:" prop="examineTypeID">
                                <el-select :disabled='isEditing' @change="interact" v-model="form_top.examineTypeID" placeholder="请选择检查类型">
                                    <el-option v-for="item in options.examineType" :label="item.examineType" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset='2'>
                            <el-form-item label="父级部位:" prop="parentPartID">
                                <el-select :disabled='isEditing&&!!currentNode.childs' v-model="form_top.parentPartID" placeholder="不选择默认录入为父级部位">
                                    <el-option v-for="item in options.parentPart" :label="item.partName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="部位代码:" prop="partCode">
                                <el-input v-model="form_top.partCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="部位名称:" prop="partName">
                                <el-input v-model="form_top.partName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="英文名称:" prop="englishName">
                                <el-input v-model="form_top.englishName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="拼音缩写:" prop="spell">
                                <el-input v-model="form_top.spell"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查项目:" prop="examineItemID">
                                <el-select v-model="form_top.examineItemID" placeholder="请选择检查项目">
                                    <el-option v-for="item in options.examineItem" :label="item.examineItem" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="HIS编码:" prop="hISCode">
                                <el-input v-model="form_top.hISCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='11'>
                            <el-form-item prop="basicflag">
                                <el-checkbox :true-label="1" :false-label="0" v-model="form_top.basicflag">基本部位
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span='11' :offset='2'>
                            <el-form-item prop="isDeveloped">
                                <el-checkbox :true-label="1" :false-label="0" v-model="form_top.isDeveloped">是否增强
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查费用:" prop="examineFees">
                                <el-input v-model="form_top.examineFees"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item class='number' label="拆分数:" prop="spliteCount">
                                <el-input-number class='number' :min='1' :max='99' v-model="form_top.spliteCount"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="胶片数:" prop="filmCount">
                                <el-input-number :min='1' :max='99' v-model="form_top.filmCount"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="胶片规格:" prop="filmSpecID">
                                <el-select v-model="form_top.filmSpecID" placeholder="请选择胶片规格">
                                    <el-option v-for="item in options.filmSpec" :label="item.dataDicValueName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="检查方法:" prop="examTechnique">
                                <el-input type="textarea" v-model="form_top.examTechnique" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="注意事项:" prop="attention">
                                <el-input type="textarea" v-model="form_top.attention" :rows="2"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form_top','save_top','top')">保 存</el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form_top','save_top')">保存并新建
                    </el-button>
                    <el-button @click="alert.top = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <!--新建和编辑拆分部位弹窗-->
        <div class="dialog-cfbw">
            <el-dialog @close="resetForm('form_left')" v-drag size="tiny" :close-on-click-modal="false" :title="isEditing?'编辑拆分部位':'新建拆分部位'" v-model="alert.left">
                <el-form label-position="right" :model="form_left" ref="form_left" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="16" :offset="4">
                            <el-form-item label="检查类型:">{{topTableSelectedRow ? topTableSelectedRow.examineType : ''}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16" :offset="4">
                            <el-form-item label="检查部位:">{{topTableSelectedRow ? topTableSelectedRow.partName : ''}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16" :offset="4">
                            <el-form-item label="拆分部位:" prop="splitePartName">
                                <el-input v-model="form_left.splitePartName">
                                    <el-button @click="form_left.splitePartName = topTableSelectedRow ? topTableSelectedRow.partName : ''" slot="append">=
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form_left','save_left','left')">保 存
                    </el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form_left','save_left')">保存并新建
                    </el-button>
                    <el-button @click="alert.left=false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <!--新建和编辑部位参数弹窗-->
        <div class="dialog-bwcs">
            <el-dialog @close="resetForm('form_right');csdw=''" v-drag size="small" :close-on-click-modal="false" :title="isEditing?'编辑部位参数':'新建部位参数'" v-model="alert.right">
                <el-form label-position="right" :model="form_right" ref="form_right" :rules="rules" label-width="85px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="检查类型:">{{topTableSelectedRow ? topTableSelectedRow.examineType : ''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset='2'>
                            <el-form-item label="检查部位:">{{topTableSelectedRow ? topTableSelectedRow.partName : ''}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="拆分部位:">
                                {{leftTableSelectedRow ? leftTableSelectedRow.splitePartName : ''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="参数名称:" prop="paramNameID">
                                <el-select :disabled="isEditing" @change="handleSelectChange" v-model="form_right.paramNameID">
                                    <el-option v-for="item in options.examParameter" :label="item.examParamName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="参数值:" prop="paramValue">
                                <el-input v-model="form_right.paramValue"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="参数单位:">{{csdw}}</el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('form_right','save_right','right')">保 存
                    </el-button>
                    <el-button v-if="!isEditing" type="primary" @click="submitForm('form_right','save_right')">保存并新建
                    </el-button>
                    <el-button @click="alert.right=false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import location from '../../../location/location.js';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            // 当前选中的树节点
            currentNode: [],
            csdw: '',
            // 顶部表格被选中的行
            topTableSelectedRow: null,
            leftTableSelectedRow: null,
            // 分别代表三个表格的页数
            page_top: 0,
            page_left: 0,
            page_right: 0,
            count: {
                top: 0,
                left: 0,
                right: 0
            },
            // 是否编辑模式
            isEditing: false,
            // 弹窗是否显示
            alert: {
                // 检查部位
                top: false,
                // 拆分部位
                left: false,
                // 部位参数
                right: false
            },
            // 表单校验规则
            rules: {
                examineTypeID: [{
                    required: true,
                    message: '请选择检查类型',
                    trigger: 'change'
                }],
                partCode: [{
                    required: true,
                    message: '请输入部位代码',
                    trigger: 'blur'
                }],
                partName: [{
                    required: true,
                    message: '请输入部位名称',
                    trigger: 'blur'
                }],
                spliteCount: [{
                    required: true,
                }],
                filmCount: [{
                    required: true,
                }],
                splitePartName: [{
                    required: true,
                    message: '请输入拆分部位',
                    trigger: 'change'
                }],
                paramNameID: [{
                    required: true,
                    message: '请选择参数名称',
                    trigger: 'change'
                }],
                paramValue: [{
                    required: true,
                    message: '请输入参数值',
                    trigger: 'blur'
                }],
                examTechnique: [{ max: 250, message: '最多只能输入250个字', trigger: 'change' }],
                attention: [{ max: 250, message: '最多只能输入250个字', trigger: 'change' }],
                examineFees: [{
                    type: 'number',
                    message: '费用格式错误',
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback()
                        } else if (isNaN(Number(value)) || value > 9999999 || !(/^\d+(\.\d+)?$/.test(value))) {
                            callback(new Error());
                        } else {
                            callback()
                        }
                    }

                }],
                spell: [{
                    message: '请输入字母',
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (!(/^[A-z]*$/.test(value))) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }

                }],
                englishName: [{
                    message: '请输入字母',
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (!(/^[A-z]*$/.test(value))) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    }

                }],
            },
            // 检查部位弹窗表单数据
            form_top: {
                systemID: this.radiation,
                examineTypeID: '',
                parentPartID: '',
                partCode: '',
                partName: '',
                englishName: '',
                spell: '',
                examineItemID: '',
                hISCode: '',
                basicflag: 0,
                isDeveloped: 0,
                examineFees: '',
                spliteCount: 1,
                filmCount: 1,
                filmSpecID: '',
                examTechnique: '',
                attention: ''
            },
            // 拆分部位弹窗表单数据
            form_left: {
                splitePartName: ''
            },
            // 部位参数弹窗表单数据
            form_right: {
                paramNameID: '',
                paramValue: ''
            },
            // 表格数据
            topTableData: [],
            leftTableData: [],
            rightTableData: [],
            // 下拉框列表项
            options: {
                examineType: [],
                examineItem: [],
                examParameter: [],
                filmSpec: [],
                parentPart: []
            },
            treeData: [],
            treeProps: {
                children: 'childs',
                label: 'partName'
            }
        };
    },
    methods: {
        get(url, data, callback) {
            this.$http.get(url, { params: data } || {}).then(res => {
                callback(res.body)
            })
        },
        post(url, data, callback) {
            this.$http.post(url, data || {}).then(res => {
                callback(res.body)
            })
        },
        showMsg(type, message) {
            this.$message({ type, message, duration: 1000 })
        },
        create_top() {
            this.alert.top = true
            let temp = ''
            this.isEditing = false
            if (this.currentNode.childs) {
                this.form_top.examineTypeID = this.currentNode.id
            } else {
                this.form_top.examineTypeID = this.currentNode.examineTypeID
                temp = this.currentNode.parentPartID
            }
            this.interact(this.form_top.examineTypeID)
            this.form_top.parentPartID = temp

        },
        // 树节点被点击
        handleNodeClick(data) {
            console.log(data)
            this.currentNode = data;
            this.loadTopTableData(true);
        },
        // 参数名称下拉列表点击处理
        handleSelectChange(x) {
            for (let i = 0; i < this.options.examParameter.length; i++) {
                for (let j in this.options.examParameter[i]) {
                    if (this.options.examParameter[i][j] === x) {
                        this.csdw = this.options.examParameter[i].examParamUnit;
                    }
                }
            }
        },
        // 顶部表格编辑按钮点击处理
        edit_top(val) {
            this.alert.top = true;
            this.isEditing = true;
            setTimeout(() => {
                this.form_top = isNaN(val) ? this.copy(val) : this.copy(this.topTableData[val])
                this.interact(this.form_top.examineTypeID)
                setTimeout(() => {
                    this.form_top.parentPartID = isNaN(val) ? this.copy(val.parentPartID) : this.copy(this.topTableData[val].parentPartID)
                    this.form_top.examineItemID = isNaN(val) ? this.copy(val.examineItemID) : this.copy(this.topTableData[val].examineItemID)
                }, 0);
            }, 0);
        },
        // 左侧表格编辑按钮点击处理
        edit_left(val) {
            this.alert.left = true;
            this.isEditing = true;
            this.form_left = isNaN(val) ? this.copy(val) : this.copy(this.leftTableData[val]);
        },
        // 右侧表格编辑按钮点击处理
        edit_right(val) {
            this.alert.right = true;
            this.isEditing = true;
            this.form_right = isNaN(val) ? this.copy(val) : this.copy(this.rightTableData[val]);
        },
        // 顶部表格行点击处理
        click_top(val) {
            this.topTableSelectedRow = val
            if (val) {
                this.loadLeftTableData(true)
            }
        },
        // 左侧表格行点击处理
        click_left(val) {
            this.leftTableSelectedRow = val
            if (val) {
                this.loadRightTableData(true)
                this.loadExamineParameter(this.topTableSelectedRow.examineTypeID)
            }
        },
        // 删除顶部表格条目
        del_top(index) {
            this.$confirm(`您确认要删除“${this.topTableData[index].partName}”检查部位？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get(
                    location.deleteExamineBodyPart,
                    { id: this.topTableData[index].id },
                    res => {
                        this.showMsg('success', '删除成功！');
                        this.topTableData.splice(index, 1);
                        this.count.top--
                        this.leftTableData = [];
                        this.topTableSelectedRow = null;
                        this.rightTableData = [];
                        this.leftTableSelectedRow = null;
                        this.loadTree()
                    });
            });
        },
        // 删除左侧表格条目
        del_left(index) {
            this.$confirm(`您确认要删除“${this.leftTableData[index].splitePartName}”拆分部位？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get(
                    location.deleteExamPartSplit,
                    { id: this.leftTableData[index].id },
                    res => {
                        this.showMsg('success', '删除成功！');
                        this.leftTableData.splice(index, 1);
                        this.count.left--
                        this.rightTableData = [];
                        this.leftTableSelectedRow = null;
                    });
            });
        },
        // 删除右侧表格条目
        del_right(index) {
            this.$confirm(`您确认要删除“${this.rightTableData[index].paramName}”部位参数？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get(
                    location.deleteSpliteExamPartParam,
                    { id: this.rightTableData[index].id },
                    () => {
                        this.showMsg('success', '删除成功！');
                        this.rightTableData.splice(index, 1);
                        this.count.right--
                    });
            });
        },
        // 加载顶部表格数据
        loadTopTableData(reload) {
            this.page_top = reload ? 0 : this.page_top + 1;
            let data = {
                systemID: this.radiation,
                page: this.page_top,
                pageSize: this.pageSize,
                examineTypeID: this.currentNode.childs ? this.currentNode.id : null,
                partID: this.currentNode.partCode ? this.currentNode.id : null,
                count: -1
            };
            this.get(location.queryExamineBodyPart, data, res => {
                this.count.top = res.data.count;
                if (reload) {
                    this.topTableData = res.data.data || [];
                    return;
                }
                this.topTableData.push(...res.data);

            });
        },
        // 加载左侧表格数据
        loadLeftTableData(reload) {
            this.page_left = reload ? 0 : this.page_left + 1;
            let data = {
                systemID: this.radiation,
                partID: this.topTableSelectedRow.id,
                page: this.page_left,
                pageSize: this.pageSize,
                count: -1
            };
            this.get(location.queryExamPartSplit, data, res => {
                this.count.left = res.data.count;
                if (reload) {
                    this.leftTableData = res.data.data || [];
                    return;
                }
                this.leftTableData.push(...res.data.data);
            });
        },
        // 加载右侧表格数据
        loadRightTableData(reload) {
            this.page_right = reload ? 0 : this.page_right + 1;
            let data = {
                splitePartID: this.leftTableSelectedRow.id,
                page: this.page_right,
                pageSize: this.pageSize,
                count: -1
            };
            this.get(location.querySpliteExamPartParam, data, res => {
                this.count.right = res.data.count;
                if (reload) {
                    this.rightTableData = res.data.data || [];
                    return;
                }
                this.rightTableData.push(...res.data.data);
            });
        },
        save_top(resolve) {
            let url = this.isEditing ? location.updateExamineBodyPart : location.addExamineBodyPart
            let data = this.copy(this.form_top)
            data.systemID = this.radiation
            this.post(url, data, () => {
                this.showMsg('success', '保存成功！')
                this.loadTree()
                this.loadTopTableData(true)
                resolve();
            });
        },
        save_left(resolve) {
            let url = this.isEditing ? location.updateExamPartSplit : location.addExamPartSplit;
            let data = this.copy(this.form_left);
            data.partID = this.topTableSelectedRow.id;
            this.post(url, data, () => {
                this.showMsg('success', '成功！');
                this.loadLeftTableData(true)
                resolve();
            });
        },
        save_right(resolve) {
            let url = this.isEditing ? location.updateSpliteExamPartParam : location.addSpliteExamPartParam;
            let data = this.copy(this.form_right)
            data.splitePartID = this.leftTableSelectedRow.id;
            this.post(url, data, () => {
                this.showMsg('success', '保存成功！');
                this.loadRightTableData(true)
                resolve();
            });
        },
        // 切换检查类型联动
        interact(examineTypeID) {
            console.log(0)
            this.form_top.parentPartID = ''
            this.options.parentPart = []
            this.form_top.examineItemID = ''
            this.options.examineItem = []
            if (!examineTypeID) return
            this.loadParentPart(examineTypeID)
            this.loadExamineItem(examineTypeID)
        },
        // 加载胶片规格
        loadFilmSpec() {
            let data = { dataDicCode: 'RISFilmSpecification', forTpye: 33 }
            this.get(location.loadSysDataDicValue, data, res => {
                this.options.filmSpec = res.data.data
            })
        },
        //  加载父级部位
        loadParentPart(examineTypeID) {
            let data = { systemID: this.radiation, examineTypeID }
            this.get(location.getParentPart, data, res => {
                this.options.parentPart = res.data || []
            })
        },
        // 加载检查项目
        loadExamineItem(examineTypeID) {
            let data = { systemID: this.radiation, examineTypeID }
            this.get(location.loadExamineItem, data, res => {
                this.options.examineItem = res.data.data || []
            })
        },
        // 加载检查参数
        loadExamineParameter(examineTypeID) {
            let data = { systemID: this.radiation, examineTypeID }
            this.get(location.queryExamParameter, data, res => {
                this.options.examParameter = res.data.data || []
            })
        },
        // 加载检查类型
        loadExamineType() {
            let data = { systemID: this.radiation }
            this.get(location.loadExamineType, data, res => {
                this.options.examineType = res.data.data || []
            })
        },
        // 加载树
        loadTree() {
            this.get(location.getExamineTypeAndPartVoList, { systemID: this.radiation }, res => {
                this.treeData = res.data || []
            })
        }
    },
    created() {
        this.loadTree();
        this.loadExamineType()
        this.loadFilmSpec()
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
.checkBody {
    .number {
        height: 36px;
    }
    .el-tooltip__popper {
        max-width: 90%;
        word-break: break-all;
    }
    .number {
        height: 36px;
    }
    .el-form-item__error {
        padding-top: 1px;
    }
    .el-form-item {
        margin: 7px 0;
    }
    .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 0; // padding-top: 15px;
    }
    .nav,
    .total,
    section {
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
        margin: 1em auto 1em;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        em {
            color: #4bc889;
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
        padding-bottom: 20px;
        justify-content: space-between;
        .treeArea {
            height: 100%;
            width: 15%;
            border: 1px solid #dfe6ec;
            overflow: auto;
            .el-tree {
                border: none;
                display: inline-block;
                min-width: 100%;
                .el-tree-node__children {
                    overflow: visible;
                }
            }
        }
        .wrap {
            width: 84%;
            height: 100%;
            .top-table {
                height: 50%;
                .table {
                    height: 100%;
                    .el-button+.el-button {
                        margin-left: 0;
                    }
                }
            }
            .bottom-table {
                height: 50%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .left {
                    width: 40%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .btm-total {
                        padding: 1em 0;
                        text-align: right;
                        flex-grow: 0;
                    }
                    .table {
                        height: 0;
                        flex-grow: 1;
                        .el-button+.el-button {
                            margin-left: 0;
                        }
                    }
                }
                .right {
                    width: calc(60% - 1em);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .btm-total {
                        padding: 1em 0;
                        text-align: right;
                        flex-grow: 0;
                    }
                    .table {
                        height: 0;
                        flex-grow: 1;
                        .el-button+.el-button {
                            margin-left: 0;
                        }
                    }
                }
                .btm-total {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    em {
                        color: #4bc889;
                    }
                    .refresh {
                        margin-right: 1em;
                    }
                }
            }
        }
    }
    .dialog-jcbw,
    .dialog-cfbw,
    .dialog-bwcs {
        .el-input-number,
        .el-select {
            width: 100%;
        }
    }
}
</style>

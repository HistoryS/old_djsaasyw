<template>
    <section class="campus">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>院区管理</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="this_nav">
                <el-form :inline="true" :rules="rules" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
                    <el-form-item label="院区地区:" prop="nav_region">
                        <el-cascader v-model="nav_form.nav_region" placeholder="请选择地区" :options="now_options" :props="now_CascaderProps" change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item label="医院编号:" prop="nav_number">
                        <el-input v-model="nav_form.nav_number" placeholder="请输入医院编号"></el-input>
                    </el-form-item>
                    <el-form-item label="医院名称:" prop="nav_name">
                        <el-input v-model="nav_form.nav_name" placeholder="请输入医院名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="query_campus(true)" class="btn">查询</el-button>
                        <el-button :plain="true" type="info" @click="resetForm('nav_form','query_campus')" class="btn">重 置</el-button>
                    </el-form-item>
                </el-form>
            </nav>
        </header>
        <h2 class="total">
            <el-button type="primary"  @click="show_new_region(null)" class="btn">新建</el-button>
            <el-button  :plain="true" class='refresh' type="primary" :loading="false"  @click="query_campus(true)">刷新</el-button>
            共 <em class="em" v-text="count">1000</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row @row-dblclick="show_new_region" v-scroll="query_campus" stripe class="this_table" :data="tableData" border style="width: 100%">
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="edit" @click="show_new_region(scope.row,scope.$index)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button size="mini" :plain="true" type="danger" icon="delete" @click="delete_campus(scope.row,scope.$index)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="icon iconfont icon-chakan2" @click="look_campus(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="管理员" placement="top">
                                <el-button size="mini" :plain="true" type="success" icon="icon iconfont icon-user" @click="look_admin(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="hospitalCode" label="院区编号" width="130">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="hospitalGrade" label="院区等级" width="100"> </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="hospitalName" label="院区名称"> </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="hospitalAdd" label="地区">
                        <template scope="scope">
                            <span>{{scope.row.province+scope.row.city+scope.row.town}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="phone" label="联系电话" width="130">
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog v-drag title="管理员" v-model="alert.look_admin">
                <section class="alert_conetnt">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">院区编号:</span>
                            <span v-text="alert.admin.hospitalCode"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">院区名称:</span>
                            <span v-text="alert.admin.hospitalName"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">省份:</span>
                            <span v-text="alert.admin.province"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">地级市:</span>
                            <span v-text="alert.admin.city"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <span class="six">区/县:</span>
                            <span v-text="alert.admin.town"></span>
                        </el-col>
                    </el-row>
                    <hr class="hr">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">管理员用户:</span>
                            <span v-text="alert.admin.adminName"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">默认密码:</span>
                            <span v-text="alert.admin.defaultPwd">8888888</span>
                            <el-button class="reset" type="primary" size="mini" @click="alter_password">重置密码</el-button>
                        </el-col>
                    </el-row>
                </section>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="hide_alert('look_admin')">关 闭</el-button>
                </div>
            </el-dialog>
            <el-dialog v-drag title="查看院区" v-model="alert.look_campus">
                <section class="alert_conetnt">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">总院:</span>
                            <span v-text="alert.campus.topLevelHospitalName"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">上级医院:</span>
                            <span v-text="alert.campus.highLevelHospitalName"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">院区编号:</span>
                            <span v-text="alert.campus.hospitalCode"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">院区名称:</span>
                            <span v-text="alert.campus.hospitalName"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">院区等级:</span>
                            <span v-text="alert.campus.hospitalGrade"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">联系电话:</span>
                            <span v-text="alert.campus.phone"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">省份:</span>
                            <span v-text="alert.campus.province"></span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">地级市:</span>
                            <span v-text="alert.campus.city"></span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">区/县:</span>
                            <span v-text="alert.campus.town"></span>
                        </el-col>
                        <!--  <el-col :span="12">
                            <span class="six">上级医院:</span>
                            <span v-text="alert.campus.highLevelHospitalName"></span>
                        </el-col> -->
                    </el-row>
                    <!-- <hr class="hr">
                    <el-row>
                        <el-col :span="12">
                            <span class="six">登记工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">机房工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">诊断工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">统计工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">系统工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">WokeList:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <span class="six">QA工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                        <el-col :span="12">
                            <span class="six">存档工作站:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <span class="six">链接设备数:</span>
                            <span>共10套,剩 <em class="em">2</em> 套</span>
                        </el-col>
                    </el-row> -->
                </section>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="hide_alert('look_campus')">关 闭</el-button>
                </div>
            </el-dialog>
            <el-dialog @close="resetForm('form')" v-drag :close-on-click-modal="false" :title="title" class="new_region" size="small" v-model="alert.new_region">
                <el-form :rules="rules" ref="form" :model="form" label-width="90px">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="上级医院:" prop="highLevelHospitalID">
                                <el-cascader v-model="form.highLevelHospitalID" :placeholder="hospotalName" :options="hospotalTree" :props="hospotalTreeProps" change-on-select></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" prop="hospitalCode">
                            <el-form-item prop="hospitalCode" label="院区编号:">
                                <el-input v-model="form.hospitalCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="hospitalName" label="院区名称:">
                                <el-input v-model="form.hospitalName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="hospitalGradeID" label="院区等级:">
                                <el-select v-model="form.hospitalGradeID" placeholder="请选择院区的等级">
                                    <el-option v-for="item in campus_level" :key="item.id" :label="item.dataDicValueName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="phone" label="联系电话:">
                                <el-input v-model="form.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item>
                                <el-checkbox v-model="form.highLevel" :true-label="1" :false-label="0">上级医院</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="region" label="地区:">
                                <el-cascader v-model="form.region" :placeholder="placeholder" :options="options" :props="CascaderProps"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <span class="label">医院图标:</span>
                            <el-upload class="avatar-uploader" ref="upload" name="hospitalLogo" action="http://192.168.0.188:8011/pla/uploadPlaHospitalLogo" :on-success="handleAvatarSuccess" :show-file-list="false" :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!--
                        <el-col :span="11">
                            <el-form-item prop="town" label="区/县">
                                <el-input v-model="form.town"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <!-- :action="location.loadPlaHospitalLogo+'pla/insertPlaHospitalManager'" -->
                        <el-col :span="11">
                            <!-- <el-button type="primary" size="small">添加</el-button> -->
                        </el-col>
                    </el-row>
                    <!-- <hr class="hr">
                    <h1>放射(剩余100天)</h1>
                    <hr class="hr">
                    <el-form-item label="序列号:" class="long">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="注册码:" class="long">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="登记工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="机房工作站;">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="诊断工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="统计工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="系统工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="WokeList:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="QA工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="存档工作站:">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="连接设备数:">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn" type="primary" @click="submitForm('form','post_region','new_region')">保 存</el-button>
                    <el-button v-show="title=='新建院区'" class="btn" type="primary" @click="submitForm('form','post_region')">保存并新建</el-button>
                    <el-button class="btn" @click="alert.new_region=false">取 消</el-button>
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
                imgData: '',
                //弹框数据
                location: location,
                alert: {
                    look_admin: false,
                    look_campus: false,
                    new_region: false,
                    admin: {},
                    campus: {},
                },
                title: '新建院区',
                //表格表头宽度
                formLabelWidth: '120px',
                //验证信息
                rules: {
                    nav_number: [{
                        min: 0,
                        max: 30,
                        message: '长度在 0 到 30 个字符',
                        trigger: 'blur'
                    }],
                    nav_name: [{
                        min: 0,
                        max: 30,
                        message: '长度在 0 到 30 个字符',
                        trigger: 'blur'
                    }],
                    nav_regio: [{
                        min: 0,
                        max: 30,
                        message: '长度在 0 到 30 个字符',
                        trigger: 'blur'
                    }],
                    hospitalCode: [{
                        required: true,
                        message: '请输入院区编号',
                        trigger: 'blur'
                    }],
                    hospitalName: [{
                        required: true,
                        message: '请输入院区名称',
                        trigger: 'blur',
                    }],
                    hospitalGrade: [{
                        required: true,
                        message: '请输入院区等级',
                        trigger: 'blur'
                    }],
                    highLevelHospitalID: [{
                        type: 'array',
                        required: true,
                        message: '请选择上级医院',
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (!value[0] && this.title == '新建院区') {
                                callback(new Error());
                            } else if (this.title == '编辑院区' || value.length == 3) {
                                callback();
                            } else {
                                callback();
                            }
                        }
                    }],
                    region: [{
                        type: 'array',
                        required: true,
                        message: '请选择省份',
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            value = value || [];
                            if (!value[0] && this.title == '新建院区') {
                                callback(new Error());
                            } else if (this.title == '编辑院区' || value.length == 3) {
                                callback();
                            } else {
                                callback();
                            }
                        }
                    }],
                    phone: [{
                        trigger: 'blur',
                        message: '手机号码输入有误',
                        validator: (rule, value, callback) => {
                            if (!value && value !== 0) {
                                callback();
                            } else if (!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value))) {
                                callback(new Error());
                            } else {
                                callback();
                            }
                        }
                    }],
                },
                //表单
                nav_form: {
                    nav_region: [],
                    nav_number: '',
                    nav_name: '',
                },
                //新建表单
                form: {
                    hospitalCode: '',
                    hospitalName: '',
                    hospitalGradeID: '',
                    phone: '',
                    province: '',
                    city: '',
                    town: '',
                    region: [],
                    highLevelHospitalID: [],
                    highLevel: "",
                },
                placeholder: '浙江/杭州市/滨江区',
                //获取已有院区地区
                now_options: [],
                //院区等级
                campus_level: [],
                //已有院区地区信息说明
                now_CascaderProps: {
                    value: 'postCode',
                    label: 'name',
                    children: 'list'
                },
                //用户选择省份
                choose_province: 0,
                //用户选择市
                choose_city: 0,
                //用户选择编辑条数
                user_choose: 0,
                //表格信息
                tableData: [],
                //总数
                count: -1,
                page: 0,
                imageUrl: "",
                //院区树形
                hospotalTree: [],
                hospotalTreeProps: {
                    value: 'id',
                    label: 'hospitalName',
                    children: 'list'
                },
                hospotalName: '',
                //地区树形信息
                options: [],
                //地区信息说明
                CascaderProps: {
                    value: 'postCode',
                    label:'name',
                    children: 'list'
                },
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
            //获取省份
            // this.get_province();
            //获取院区
            this.query_campus(true)
                //获取所有院区等级
            this.loadSysDataDicValue()
                //获取已有院区地区
            this.loadLeftHospotalMenu()
                //获取院区树形
            this.loadHighHospotalTree()
            //获取地区
            this.getRegion();
        },
        methods: {
            //图片上传
            handleAvatarSuccess(data, file) {
                this.imgData = data.data;
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //图片上传判断
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //新建||编辑 院区
            show_new_region(tr) {
                this.user_choose = tr;
                this.alert.new_region = true;
                // this.$refs.upload.clearFiles();
                this.imgData = "";
                this.imageUrl = "";
                if (tr) {
                    this.title = '编辑院区';
                    this.hospotalName = tr.highLevelHospitalName;
                    console.log(tr.highLevelHospitalName);
                    this.placeholder = `${tr.province||'无'}/${tr.city||'无'}/${tr.town||'无'}`;
                    setTimeout(() => {
                        this.form = this.copy(tr)
                        this.form.highLevelHospitalID = [];
                    }, 0)
                } else {
                    this.title = '新建院区';
                    this.placeholder = '请选择地区'
                    this.hospotalName = '请选择上级医院'
                }
            },
            //保存院区
            post_region(resolve) {
                if (this.title == '新建院区') {
                    var url = location.insertPlaHospitalManager;
                    var form = this.copy(this.form)
                    form.postCode = form.region[form.region.length - 1];
                    form.highLevelHospitalID = _.last(form.highLevelHospitalID);
                } else {
                    var url = location.updatePlaHospitalManager
                    var form = this.copy(this.form);
                    form.id = this.user_choose.id;
                    if (!!form.region) {
                        form.postCode = form.region[form.region.length - 1];
                    }
                    if (!!form.highLevelHospitalID) {
                        form.highLevelHospitalID = _.last(form.highLevelHospitalID);
                    }
                }
                form.hospitalLogo = this.imgData;
                this.$http.post(url, form).then(data => {
                    data = data.body;
                    resolve()
                    this.query_campus(true);
                })
            },
            //查看管理员
            look_admin(item) {
                this.alert.look_admin = true;
                this.alert.admin = item;
                // this.$http.post(location.findPlaHospitalManagerUser, {
                //     hospitalID: id
                // }).then(data => {
                //     data = data.body;
                // }, data => {
                //     console.log('错误')
                // })
            },
            //重置管理员密码
            alter_password() {
                this.$http.get(location.resetUserInfoPassword, {
                    params: {
                        id: this.alert.admin.adminID
                    }
                }).then(data => {
                    data = data.body;
                    this.$message({
                        type: 'success',
                        message: '密码重置成功!'
                    });
                    // this.alert.admin.adminID="888888"
                    // this.look_admin(this.alert.admin.id)
                }, data => {
                    console.log('错误')
                })
            },
            //查看院区
            look_campus(item) {
                this.alert.look_campus = true;
                this.alert.campus = item;
                // this.$http.post(location.findPlaHospitalManagerUser, {
                //     hospitalID: id
                // }).then(data => {
                //     data = data.body;
                //     console.log(data)
                //     this.alert.campus = data.data;
                // }, data => {
                //     console.log('错误')
                // })
            },
            //查询院区
            query_campus(can) {
                can ? this.page = 0 : this.page++;
                this.$http.get(location.findPlaHospitals, {
                    params: {
                        hospitalCode: this.nav_form.nav_number,
                        hospitalName: this.nav_form.nav_name,
                        postCode: this.nav_form.nav_region[this.nav_form.nav_region.length - 1],
                        count: -1,
                        page: this.page,
                        pageSize: this.pageSize,
                    }
                }).then(data => {
                    data = data.body;
                    this.count = data.data.count;
                    console.log(data)
                    if (can) {
                        this.tableData = data.data.data;
                    } else {
                        this.tableData.push(...data.data.data)
                    }
                }, data => {
                    console.log('错误')
                })
            },
            //省市区三联调
            // alignment(val) {
            //     switch (val.length) {
            //         case 1:
            //             this.options.forEach((el, index) => {
            //                     if (el.postCode == val[0]) {
            //                         this.choose_province = index;
            //                     }
            //                 })
            //                 //获取地级市
            //             this.$http.get(location.loadCity, {
            //                 params: {
            //                     postCode: val[0]
            //                 }
            //             }).then(data => {
            //                 data = data.body;
            //                 data.data = data.data || [];
            //                 data.data.forEach((el, idnex) => {
            //                     el.children = [];
            //                 })
            //                 this.options[this.choose_province].children = data.data;
            //             }, data => {
            //                 console.log('错误')
            //             })
            //             break;
            //         case 2:
            //             this.options[this.choose_province].children.forEach((el, index) => {
            //                     if (el.postCode == val[1]) {
            //                         this.city = index;
            //                     }
            //                 })
            //                 //获取镇乡
            //             this.$http.get(location.loadTown, {
            //                 params: {
            //                     postCode: val[1]
            //                 }
            //             }).then(data => {
            //                 data = data.body;
            //                 data.data = data.data || [];
            //                 this.options[this.choose_province].children[this.city].children = data.data;
            //             }, data => {
            //                 console.log('错误')
            //             })
            //             break;
            //     }
            // },
            //获取所有省份
            // get_province() {
            //     this.$http.get(location.loadProvince).then(data => {
            //         data = data.body;
            //         data.data = data.data || [];
            //         data.data.forEach((el, idnex) => {
            //             el.children = [];
            //         })
            //         this.options = data.data;
            //     }, data => {
            //         console.log('错误')
            //     })
            // },
            //删除院区
            delete_campus(item, index) {
                this.$confirm('是否确认删除该条信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get(location.deletePlaHospitalManager, {
                        params: {
                            hospitalID: item.id,
                        }
                    }).then(data => {
                        data = data.body;
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.tableData.splice(index, 1)
                        this.count--;
                    }, data => {
                        console.log('错误')
                    })
                }).catch(() => {});
            },
            //获取医院等级
            loadSysDataDicValue() {
                this.$http.get(location.loadSysDataDicValue, {
                    params: {
                        dataDicCode: 'hospitalGrade',
                        forTpye: 1
                    }
                }).then(data => {
                    data = data.body
                    this.campus_level = data.data.data;
                }, data => {
                    console.log('错误')
                })
            },
            //获取已有院区地区
            loadLeftHospotalMenu() {
                this.$http.get(location.loadLeftHospotalMenu).then(data => {
                    data = data.body
                    console.log(data);
                    this.now_options = data.data;
                }, data => {
                    console.log('错误')
                })
            },
            //获取院区树形
            loadHighHospotalTree() {
                this.$http.get(location.loadHighHospotalTree, ).then(data => {
                    data = data.body;
                    this.hospotalTree = data.data.data
                    console.log(data);
                })
            },
            //获取地区
            getRegion() {
                this.$http.get(location.loadLeftAreaManager).then(data => {
                    data = data.body;
                    this.options = data.data || [];
                }, data => {
                    console.log('错误')
                })
            }
        }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/element.less";
.campus {
    .this_header {
        // height: 100px;
        .crumbs {
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
            // flex-wrap:wrap;
            .demonstration {
                margin-right: 1em;
                margin-left: 1em;
            }
            .el-form-item {
                margin-bottom: 10px;
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
        .btn {
            margin-right: 1em;
        }
        .refresh {
            margin-right: 1em;
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
            width: 190px;
        }
        .btn {
            margin-left: 1em;
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
                height: 2.5em;
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
            .avatar-uploader .el-upload {
                // border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                img {
                    margin-left: 10px;
                }
            }
            .avatar-uploader .avatar-uploader-icon:hover {
                border-color: #20a0ff;
            }
            .avatar-uploader-icon {
                margin-left: 10px;
                font-size: 14px;
                color: #8c939d;
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border: 1px dashed #d9d9d9;
            }
            .avatar {
                width: 40px;
                height: 40px;
            }
        }
    }
}
</style>

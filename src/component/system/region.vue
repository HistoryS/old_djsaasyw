<template>
    <section class="region">
        <header class="this_header">
            <el-breadcrumb separator="/" class="crumbs">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>地区管理</el-breadcrumb-item>
            </el-breadcrumb>
            <nav class="this_nav">
                <el-form :inline="true" :rules="rules" ref="nav_form" :model="nav_form" class="demo-form-inline btn">
                    <el-form-item label="地区名称:" prop="nav_region">
                        <el-cascader v-model="nav_form.nav_region" placeholder="请输入或者选择地区" :options="options" :props="CascaderProps" filterable change-on-select></el-cascader>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="get_region(true)" class="btn">查询</el-button>
                <el-button :plain="true" type="info" @click="resetForm('nav_form','get_region')" class="btn">重 置</el-button>
            </nav>
        </header>
        <h2 class="total">
            <!-- <el-button type="primary" class="btn" @click="show_alert(null)">新建</el-button> -->
            <el-button @click="get_region(true)" :plain="true" class='refresh' type="primary" >刷新</el-button>
            共 <em class="em" v-text="count">10001</em> 条记录
        </h2>
        <section class="this_section">
            <template>
                <el-table highlight-current-row v-scroll="get_region" stripe class="this_table" :data="tableData" height="100%" border style="width: 100%" >
                    <!-- <el-table-column label="操作" width="150" prop="id">
                        <template scope="scope">
                            <el-button size="mini" @click="show_alert(scope.row)" :plain="true" type="success" icon="edit"></el-button>
                            <el-button :plain="true" size="mini" type="danger" icon="delete" @click="deleted(scope.$index)"></el-button>
                            <el-button size="mini" :plain="true" type="success" icon="caret-bottom"></el-button>
                            <el-button size="mini" :plain="true" type="success" icon="caret-top"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column :show-overflow-tooltip="true" prop="postCode" label="地区代码" width="130">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="地区名称" >
                        <template scope="scope">
                            <p>{{ scope.row.province+scope.row.city+scope.row.town }}</p>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column :show-overflow-tooltip="true" prop="address" label="上级代码">
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="address" label="上级地区名称">
                    </el-table-column> -->
                </el-table>
            </template>
        </section>
        <aside class="alert">
            <el-dialog v-drag :close-on-click-modal="false" size="tiny" :title="title" v-model="alert.new_region">
                <el-form :model="content_form" :rules="rules" ref="content_form">
                    <el-form-item label="地区代码" :label-width="formLabelWidth">
                        <el-input :disabled="true" v-model="content_form.region" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地区名称" prop="area" :label-width="formLabelWidth">
                        <el-select v-model="content_form.area" placeholder="请选择活动区域">
                            <el-option label="上海" value="shanghai"></el-option>
                            <el-option label="北京" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上级代码" :label-width="formLabelWidth">
                        <el-input :disabled="true" v-model="content_form.code" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上级名称" :label-width="formLabelWidth">
                        <el-input :disabled="true" v-model="content_form.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button class="btn" type="primary" @click="submitForm('content_form','dosome','new_region')">保 存</el-button>
                    <el-button v-show="title=='新建地区'" class="btn" type="primary" @click="submitForm('content_form','dosome')">保存并新建</el-button>
                    <el-button class="btn" @click="resetForm('content_form','new_region')">取 消</el-button>
                </div>
            </el-dialog>
        </aside>
    </section>
</template>
<script>
import location         from '../../location/location.js';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            value:'',
            //弹框信息
            alert: {
                new_region:false
            },
            //当前页
            page:0,
            //名称
            title: '新建地区',
            //表格表头宽度
            formLabelWidth: '120px',
            //验证信息
            rules: {
                area: [{
                    required: true,
                    message: '请输入地区名称',
                    trigger: 'blur'
                }],
                nav_region:[{
                    min: 0,
                    max: 30,
                    message: '长度在 0 到 30 个字符',
                    trigger: 'blur'
                }],
            },
            //用户地区选择
            nav_form:{
                nav_region:[],
            },
            //表单信息
            content_form: {
                region: '',
                area: '',
                code: '',
                name: '',
            },
            //地区树形信息
            options: [],
            //地区信息说明
            CascaderProps: {
              value: 'postCode',
              label:'name',
              children: 'list'
            },
            //表格信息
            tableData: [],
            //总条数
            count:-1
        };
    },
    created(){
        //初始化地区
        this.get_region(true);
        //获取地区名称
        this.$http.get(location.loadLeftAreaManager).then(data=>{
            data=data.body;
            this.options=data.data||[];
        }, data=>{
            console.log('错误')
        })
    },
    computed:{
        ...mapState([
          'pageSize',
          'platform',
        ])
    },
    methods: {
        //删除
        delete_regin(index) {
            this.$confirm('是否确认删除该条信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.tableData.splice(index, 1)
                this.count--
            }).catch(() => {

            });
        },
        //后台请求数据
        get_region(can) {
            can?this.page=0:this.page++;
            this.$http.get(location.loadAreaManagers,{
                params:{
                    postCode: this.nav_form.nav_region[this.nav_form.nav_region.length-1]||0,
                    page:this.page,
                    count:-1,
                    pageSize:this.pageSize
                }
            }).then(data=>{
                data=data.body;
                this.count=data.data.count;
                if (can) {
                    this.tableData=data.data.data||[];
                }else{
                    this.tableData.push(...data.data.data)
                }
            }, data=>{
                console.log('错误')
            })
        },
        //新建||编辑 地区  暂时不做
        show_alert(tr) {
            this.alert.new_region = true;
            if (tr) {
                this.title="编辑地区";
                setTimeout(() => {
                    this.content_form.area = tr.name;
                },0)
            } else {
                this.title="新建地区";
            }
        }
    }
};
</script>
<style lang="less" scoped>
    @import "../../assets/css/element.less";
    .region {
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
                .el-button+.el-button {
                    margin-left: 0;
                }
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
                margin-left: 1em;
            }
        }
    }
</style>

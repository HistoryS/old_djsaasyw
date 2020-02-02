<template>
    <section class="app">
        <header class="this_header">
            <h1>
                <img src="./assets/img/djlogo.png" alt="logo">
                岱江saas运维平台
            </h1>
            <el-dropdown @command="userinfo" class="user" trigger="click">
                <span class="el-dropdown-link">
                用户信息<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="account">账户信息</el-dropdown-item>
                    <el-dropdown-item command="password">修改密码</el-dropdown-item>
                    <el-dropdown-item command="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </header>
        <section class="this_section">
            <nav class="this_nav">
                <el-menu :router="true" default-active="2" class="el-menu-vertical-demo">
                    <!-- <el-submenu index="1">
                        <template slot="title"><i class="el-icon-setting icon iconfont icon-fangshe-copy"></i>放射设置</template>
                        <el-submenu index="1-1">
                            <template slot="title">系统设置</template>
                            <el-menu-item index="radiationPlugin">放射插件</el-menu-item>
                        </el-submenu>
                        <el-submenu index="1-2">
                            <template slot="title">模板设置</template>
                            <el-menu-item index="fastWrite">快速书写模板</el-menu-item>
                            <el-menu-item index="reportWrite">报告书写模板</el-menu-item>
                            <el-menu-item index="qualityScore">质控评分模板</el-menu-item>
                        </el-submenu>
                        <el-submenu index="1-3">
                            <template slot="title">其他设置</template>
                            <el-menu-item index="examineType">检查类型</el-menu-item>
                            <el-menu-item index="examineProject">检查项目</el-menu-item>
                            <el-menu-item index="examineArguments">检查参数</el-menu-item>
                            <el-menu-item index="diagnoseType">就诊类别</el-menu-item>
                            <el-menu-item index="shortcutCode">常用符号</el-menu-item>
                            <el-menu-item index="contrastAgent">造影剂</el-menu-item>
                            <el-menu-item index="checkBody">检查部位</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-setting icon iconfont icon-system"></i>系统设置</template>
                        <el-menu-item index="region">地区管理</el-menu-item>
                        <el-menu-item index="campus">院区管理</el-menu-item>
                        <el-menu-item index="role">角色管理</el-menu-item>
                        <el-menu-item index="user">用户管理</el-menu-item>
                        <el-menu-item index="dictionary">平台字典</el-menu-item>
                        <el-menu-item index="parameter">平台参数</el-menu-item>
                        <el-menu-item index="log">日志管理</el-menu-item>
                    </el-submenu>-->
                    <sr-nav :data="nav"></sr-nav>
                </el-menu>
            </nav>
            <router-view class="view router"></router-view>
            <aside class="alert">
                <el-dialog v-drag :close-on-click-modal="false" size="tiny" title="修改密码" v-model="alert.password">
                    <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="100px">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input type="password" v-model="form.oldPassword" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="repassword">
                            <el-input type="password" v-model="form.repassword" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button class="btn" type="primary" @click="submitForm('form','changePassword','password')">保 存</el-button>
                        <el-button class="btn" @click="resetForm('form','password')">取 消</el-button>
                    </div>
                </el-dialog>
            </aside>
        </section>
    </section>
</template>
<script>
import location from './location/location.js';
export default {
    name: 'app',
    data() {
        return {
            alert:{
                password:false
            },
            nav: [],
            activeIndex: '1',
            activeIndex2: '1',
            rules: {
                oldPassword: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur',
                }],
                newPassword: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入密码'));
                        } else {
                            callback();
                        }
                    }
                }],
                repassword: [{
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入密码'));
                        } else if (value !== this.form.newPassword) {
                            callback(new Error('两次输入密码不一致!'));
                        } else {
                            callback();
                        }
                    }
                }],
            },
            form: {
                oldPassword: '',
                newPassword: '',
                repassword: '',
            }
        };
    },
    created() {
        this.$http.get('http://192.168.0.68:8081/pla/login?username=admin&password=888888').then(data => {
            // console.log(data)
        }, data => {
            console.log('错误')
        })
        //获取用户登录权限
        this.queryUserMenuManagerTree()
        //获取用户登录信息
        this.getCreateUsername();
    },
    methods: {
        //获取用户登录状态
        queryUserMenuManagerTree() {
            this.$http.get(location.getUserDataAndTreeData).then(data => {
                data = data.body;
                // console.log(data);
                this.nav = data.data.treeData;
            }, data => {
                console.log('错误');
            });
        },
        //获取用户登录信息
        getCreateUsername(){
            this.$http.get(location.createUsername,).then(data => {
                data=data.body;
                // console.log(data)
            })
        },
        //用户信息
        userinfo(command) {
            switch (command) {
                case "account":
                    break;
                case "password":
                    this.alert.password=true;
                    break;
                case "exit":
                    this.logout()
                    break;
            }
        },
        //登出
        logout() {
            this.$http.get(location.logout).then(data => {})
        },
        changePassword(resolve) {
            this.$http.get(location.updatePassword,{
                params:{
                    ...form
                }
            }).then(data => {
                data=data.body;
                this.$message({
                    type: 'success',
                    message:data.messaqge
                })
                resolve()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.app {
    display: flex;
    flex-direction: column;
    height: 100%;
    .this_header {
        height: 60px;
        display: flex;
        align-items: center;
        border-bottom: 3px solid rgb(238, 246, 243);
        background: #009933;
        padding-left: .5em;
        justify-content: space-between;
        .user {
            margin-right: 1em;
            color: #fff;
            cursor: pointer;
        }
        h1 {
            img {
                height: 100%;
            }
            height: 80%;
            display:inline-flex;
            align-items:center;
            margin-left: .5em;
            font-size: 22px;
            font-weight: 400;
            color: #fff;
        }
    }
    .this_section {
        height: 100%;
        width: 100%;
        display: flex;
        // border:1px solid red;
        .this_nav {
            min-width: 200px;
            background: rgb(238, 246, 243);
            height: 100%;
            max-height: 100%;
            overflow: auto;
        }
        .view {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            flex-grow: 2;
        }
    }
}
</style>

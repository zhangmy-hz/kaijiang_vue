<template>
  <div id="app">
    <el-container>
      <el-header style="height: 50px;font-size: 20px;">
        <span style="text-align: left;margin: auto;float: left;color: darkkhaki">开疆录单系统</span>
        <el-button size="small" style="text-align: right;float: right;margin-top:10px;" @click="addVisible = true">
          修改密码
        </el-button>
        <el-button size="small" style="text-align: right;float: right;margin-top:10px;margin-right: 10px" @click="login_out">
          退出登陆
        </el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '180px'">
          <div class="toggle-button" @click="toggleCollapse">
            {{ zhedie }}
          </div>
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                :default-active="activePath"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#1E90FF"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                router
              >
                <!-- 一级菜单 -->
                <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
                  <!-- 一级菜单的模板区域 -->
                  <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]" />
                    <!-- 文本 -->
                    <span>{{ item.name }}</span>
                  </template>

                  <!-- 二级菜单 -->
                  <el-menu-item
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    :index="subItem.id + ''"
                    @click="saveNavState(subItem.id)">
                    <template slot="title">
                      <!-- 图标 -->
                      <i class="el-icon-menu" />
                      <!-- 文本 -->
                      <span>{{ subItem.name }}</span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer style="height: 30px;">
            杭州长臂猿科技有限公司 @2020-V-20.10.19
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="addVisible"
      width="400px"
      @close="handleClose">
      <span>
        <el-form ref="Formref" :model="addForm" :rules="formrules" label-width="100px">
          <el-form-item label="账号" prop="id">
            <el-input v-model="addForm.id" disabled/>
          </el-form-item>
          <el-form-item
            label="原密码"
            prop="password_old">
            <el-input
              v-model="addForm.password_old"
              type="password"
            />
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="password_new">
            <el-input
              v-model="addForm.password_new"
              type="password"
            />
          </el-form-item>
        </el-form>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="update_mima"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'// 引入文件,为了下面的全局挂载使用
export default {
  name: 'Home',
  data() {
    return {
      isCollapse: true, // 是否折叠
      zhedie: '<<',
      use_name: '',
      menulist: [], // 菜单列表
      iconsObj: {
        1: 'el-icon-s-order',
        2: 'el-icon-document-copy',
        3: 'el-icon-s-unfold',
        4: 'el-icon-user-solid',
        5: 'el-icon-house'

      },
      addForm: {
        id: '',
        password_new: '',
        password_old: ''
      },
      addVisible: false,
      formrules: {
        password_new: [
          {
            required: true,
            message: '密码不能为空!',
            trigger: ['blur', 'change']
          },
          {
            min: 8,
            max: 20,
            message: '长度在 8 到 20 之间',
            trigger: ['blur', 'change']
          }
        ],
        password_old: [
          {
            required: true,
            message: '原密码不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()// 运行
    this.addForm.id = window.sessionStorage.getItem('token')// 获得账号信息
    this.use_name = window.sessionStorage.getItem('token')// 获得账号信息
    this.get_role()
    this.get_user_name()//获得用户名称
  },
  mounted () {
    this.getMenuList()// 运行
    this.addForm.id = window.sessionStorage.getItem('token')// 获得账号信息
    this.use_name = window.sessionStorage.getItem('token')// 获得账号信息
    this.get_role()
    this.zhedie = '>>'
  },
  methods: {
    login_out () {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.zhedie = '>>'
      } else {
        this.zhedie = '<<'
      }
    },
    getMenuList() { // 获取权限列表函数
      var that = this
      // if (this.name){
      this.$http.post('quanxian_get/', { name: this.use_name })
        .then(function (res) {
          console.log(res)
          that.menulist = res.data
          if (res.status !== 200) {
            this.$message.error('权限加载失败')
          }
        })
        .catch(function (res) {
          this.$message.error('用户权限加载失败')
        })
      // }
    },
    saveNavState(activePath) {
      this.activePath = activePath
    },
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
    },
    update_mima() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('update_mima/', this.addForm)
            .then(function(res) {
              console.log(res)
              if (res.data === 'OK') {
                that.$message.success('修改成功')
                that.addVisible = false
              } else if (res.data === 300) {
                that.$message.error('原密码错误')
              } else {
                that.$message.error('密码修改失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {
        }
      })
    },
    get_user_name() {//获得用户的名字
      var that = this
      this.$http.post('get_user_name/',{user_name: this.use_name }).then(function (res) {
      if (res.data !== ''){
        window.sessionStorage.setItem('user_name',res.data)  //浏览器缓存
      }
      })
    },
    get_role() {
      var that = this
      // that.$message.success(this.user_name)
      // console.log('开始读取权限'+this.user_name)
      this.$http.post('get_role/', { user_name: this.use_name }).then(function (res) {
        if (res.status === 200) {
          const role_tree_list = res.data// 按钮权限读取成功,挂载全局函数
          window.sessionStorage.setItem('role_tree_list', role_tree_list)// 放入浏览器缓存中
          // Vue.prototype.$role_tree_list = role_tree_list
        } else {
          that.$message.error('权限拉取失败')
        }
      })
    }
  }
}
</script>

<style scoped>
  html,body,.el-container{
    margin: 0px;
    padding: 0px;
    min-height: 100%;
  }
  .el-header {
    background-color: #696969;
    color: #333;
    line-height: 50px;
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 30px;
    position: fixed;
    bottom: 0px;
    width: 100%;
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: left;
    line-height: 180px;
  }
  .el-aside.el-menu {
    border-right: none;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>

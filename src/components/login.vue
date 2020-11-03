<template>
  <div class="login_sty">
    <div class="login_neirong">
      <div class="tishi">
        <h2>开疆录单系统</h2>
      </div>
      <el-form
        ref="loginFormref"
        class="form_login"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            type="text"
            prefix-icon="el-icon-user-solid"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            prefix-icon="el-icon-s-goods"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="success"
            @click="loginIn"
            @keyup.enter="loginIn"
          >
            登录
          </el-button>
          <el-button @click="form_resert">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      杭州长臂猿科技有限公司出品 @2014--2020 Tel:13819136546
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      django_token: '', // token获取django的值
      rules: {
        username: [
          {
            required: true,
            message: '账号不能为空!',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 之间',
            trigger: ['blur', 'change']
          }
        ],
        password: [
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
        ]
      }
    }
  },
  created() {
    var that = this
    this.$http.get('foo/').then(function(res) {
      // console.log(res)
      that.django_token = res.data // 得到了token
    })
  },
  methods: {
    form_resert() {
      this.$refs.loginFormref.resetFields() // 订单重置
    },
    loginIn() {
      var that = this
      this.$refs.loginFormref.validate(async valid => {
        if (valid) {
          // 验证都通过
          // console.log('表单信息' + that.django_token)
          await this.$http
            .post(
              'login/',
              { form_data: this.loginForm, token: that.django_token },
              {
                headers: {
                  'Content-Type': 'application/x-www-fromurlencodeed',
                  'X-CSRFToken': that.django_token
                }
              }
            )
            .then(function(res) {
              if (res.data === 'OK') {
                console.log(res)
                that.$message.success('欢迎使用开疆录单系统！')
                that.$router.push('/home')
              } else {
                return that.$message.error('账号密码不对！')
              }
            }, window.sessionStorage.setItem('token', that.loginForm.username))
            .catch(function(res) {
              console.log(res)
              return that.$message.error('登录失败！')
            })
        } else {
          // 验证不通过
          return this.$message.error('账号密码填写不规范！')
        }
      })
    }
  }
}
</script>

<style scoped>
.login_sty {
  height: 100%;
  background-color: lavender;
}
.login_neirong {
  height: 300px;
  width: 400px;
  position: absolute;
  background-color: azure;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.form_login {
  margin-top: 40px;
  padding: 0 20px;
}
.btns {
  text-align: center;
}
.tishi {
  text-align: center;
}
.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: auto;
  text-align: center;
}
</style>

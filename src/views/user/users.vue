<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="7" class="el-row">
          <el-input
            v-model="input"
            placeholder="输入名称或者账号搜索"
            clearable @input="user_list()" @clear="user_list">
            <el-button
              slot="append" icon="el-icon-search" @click="user_list"/>
          </el-input>
        </el-col>
        <el-col class="el-row" :span="4">
          <el-button
            type="primary" v-if="role_tree_list.indexOf('4-1-1') !== -1" @click="addVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="user_li" :border="true" :header-row-style="{'height': '20px'}" :row-style="{'height': '20px'}" :cell-style="{'padding':'7px'}"
        :stripe="true" :highlight-current-row="true">
        <el-table-column type="index" label="#" width="60px"/>
        <el-table-column label="账号" prop="name"/>
        <el-table-column label="姓名" prop="nameid"/>
        <el-table-column label="地区" prop="address"/>
        <el-table-column label="邮箱" prop="email"/>
        <el-table-column label="电话" prop="iphone"/>
        <el-table-column label="角色" prop="role"/>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- -->
            <el-switch v-model="scope.row.status" active-text="启用" active-color="#13ce66" inactive-color="#ff4949"
              @change="status_change(scope.row.name,scope.row.status,scope)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" v-if="role_tree_list.indexOf('4-1-2') !== -1"
                       @click="showEditDialog(scope.row.name)"/>
            <el-button type="danger" icon="el-icon-delete" circle
              size="mini" v-if="role_tree_list.indexOf('4-1-3') !== -1"
              @click="delete_user(scope.row.name)"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <div style="margin-top: 10px;margin-bottom: -13px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10,20,50,100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="新增用户" :visible.sync="addVisible" width="40%" @close="handleClose">
      <span>
        <el-form ref="Formref" :model="addForm" :rules="formrules" label-width="100px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="addForm.username" />
          </el-form-item>
          <el-form-item label="用户名" prop="password">
            <el-input v-model="addForm.password" />
          </el-form-item>
          <el-form-item label="地区" prop="address">
            <el-select v-model="addForm.address" placeholder="选择地区" style="width: 100%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="邮 箱" prop="email">
            <el-input v-model="addForm.email" />
          </el-form-item>
          <el-form-item label="手 机" prop="iphone">
            <el-input v-model="addForm.iphone" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-autocomplete v-model="addForm.role" class="el-input" :fetch-suggestions="querySearchAsync" placeholder="点击选择角色"/>
          </el-form-item>
          <el-form-item label="订单权限">
              <el-radio-group v-model="addForm.radio" size="mini">
                <el-radio label="1" border>仅自己订单</el-radio>
                <el-radio label="2" border>本地区订单</el-radio>
                <el-radio label="3" border>所有订单</el-radio>
             </el-radio-group>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_user">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="addVisible2" width="40%" @close="handleClose2">
      <span>
        <el-form ref="Formupref" :model="updateForm" :rules="formuprules" label-width="100px">
          <el-form-item label="账号">
            <el-input v-model="updateForm.name" disabled/>
          </el-form-item>
          <el-form-item label="用户名" prop="nameid">
            <el-input v-model="updateForm.nameid" />
          </el-form-item>
          <el-form-item label="地区" prop="address">
            <el-select v-model="updateForm.address" placeholder="选择地区" style="width: 100%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="邮 箱" prop="email">
            <el-input v-model="updateForm.email" />
          </el-form-item>
          <el-form-item label="手 机" prop="iphone">
            <el-input v-model="updateForm.iphone" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-autocomplete v-model="updateForm.role" class="el-input" :fetch-suggestions="querySearchAsync" placeholder="点击选择角色"/>
          </el-form-item>
          <el-form-item label="订单权限">
              <el-radio-group v-model="updateForm.radio" size="mini">
                <el-radio label="1" border>仅自己订单</el-radio>
                <el-radio label="2" border>本地区订单</el-radio>
                <el-radio label="3" border>所有订单</el-radio>
             </el-radio-group>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="update_user">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      input: '',
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      user_li: [],
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      addForm: {
        username: '',
        password: '',
        address: '', // 地址
        email: '',
        iphone: '',
        role: '',
        radio: '1'
      },
      updateForm: {},
      // 表单的验证规则
      formrules: {
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
            message: '用户名不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        address: [
          {
            required: true,
            message: '地区不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        role: [
          {
            required: true,
            message: '角色不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      formuprules: {
        nameid: [
          {
            required: true,
            message: '用户名不能为空!',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '地区不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        role: [
          {
            required: true,
            message: '角色不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      options: [
        {
          value: '义乌',
          label: '义乌'
        },
        {
          value: '杭州',
          label: '杭州'
        }
      ]

    }
  },
  created() {
    this.user_list()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
  },
  methods: {
    user_list() {
      var that = this
      this.$http
        .post('user/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.input
        })
        .then(function(res) {
          // console.log(res)
          that.total = res.data.total
          that.user_li = res.data.user_list
        })
    },
    handleSizeChange(res) {
      // 监听页数改变
      this.pagesize = res
      this.user_list()
    },
    handleCurrentChange(res) {
      // 监听页码改变
      // console.log(res)
      this.currentPage = res
      this.user_list()
    },
    status_change(name, status, scope) {
      // 更改状态
      this.$http
        .post('user_status/', { name: name, status_c: status })
        .then(function(res) {
          if (res.data === 'OK') {
            this.$message.success('状态更新成功')
          } else {
            this.$message.error('状态更新失败')
            scope.row.status = !status
          }
        })
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields()// 订单重置
    },
    add_user() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http.post('add_user/', { form_data: this.addForm })
            .then(function (res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addVisible = false
                that.user_list()
              } else {
                that.$message.error('添加失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {

        }
      })
    },
    update_user() { // 修改用户信息确认
      var that = this
      this.$refs.Formupref.validate(valid => {
        if (valid) { // 修改验证都通过
          this.$http.post('user_update/', { data: this.updateForm })
            .then(function (res) {
              if (res.data === 'OK') {
                that.$message.success('用户修改成功')
                that.addVisible2 = false
                that.user_list()
              } else {
                that.$message.error('用户修改失败，请联系管理员')
              }
            })
        }
      })
    },
    showEditDialog(name) {
      var that = this
      this.addVisible2 = true
      this.$http.post('user_up_select/', { id: name })
        .then(function (res) {
          // console.log(res)
          that.updateForm = res.data
        })
    },
    delete_user(name) { // 删除用户，并提示
      var that = this
      if (name === 'admin') {
        that.$message.warning('admin账号不可删除!')
      } else {
        this.$confirm('此操作将永久删用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function (res) {
          if (res === 'confirm') {
            that.$http.post('delete_user/', { name: name })
              .then(function (res) {
                if (res.data === 'OK') { // 执行删除成功时
                  that.$message.success('删除用户成功')
                  that.user_list()// 刷新列表
                } else {
                  that.$message.error('删除失败')
                }
              })
          }
        }).catch(function (res) {
          console.log('删除失败')
          return res
        })
      }
    },
    querySearchAsync(queryString, cb) {
      this.$http.post('role_select/', { role: queryString })
        .then(({ data }) => {
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].role_name
          }
          cb(data)
        })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.el-card {
  margin-top: 10px;
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all 0.5s;
}
.input-with-select {
  margin-top: 10px;
}
.el-table tbody tr:hover>td {
    background-color:#ecf5ff!important
}

</style>

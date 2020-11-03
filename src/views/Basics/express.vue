<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>快递物流</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 10px;width: 700px">
      <el-row :gutter="20" style="margin-top: -10px;margin-bottom: 5px">
        <el-col class="el-row" :span="4">
          <el-button
            type="primary" size="small" v-if="role_tree_list.indexOf('1-2-1') !==-1" @click="addVisible = true">
            添加物流
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="wuliu_li"
        border size="small"
        :header-row-style="{'height': '15px'}"
        :row-style="{'height': '15px'}"
        :stripe="true"
      >
        <el-table-column type="index" />
        <el-table-column
          label="代码"
          prop="id"
        />
        <el-table-column
          label="物流名称"
          prop="name"
        />
        <el-table-column
          label="操作"
          width="90px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini" v-if="role_tree_list.indexOf('1-2-2') !==-1"
              @click="showEditDialog(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini" v-if="role_tree_list.indexOf('1-2-3') !==-1"
              @click="delete_wuliu(scope.row.id)"
            />
          </template>
        </el-table-column>

        <!--新增颜色-->
        <el-dialog
          title="新增物流"
          :visible.sync="addVisible"
          width="30%"
          :append-to-body="true"
          @close="handleClose"
        >
          <span>
            <el-form
              ref="Formref"
              :model="addForm"
              :rules="formrules"
              label-width="100px"
            >
              <el-form-item
                label="代号"
                prop="color_id"
              >
                <el-input v-model="addForm.color_id" />
              </el-form-item>
              <el-form-item
                label="物流名"
                prop="color_name"
              >
                <el-input v-model="addForm.color_name" />
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="add_color"
            >确 定</el-button>
          </span>
        </el-dialog>

        <!--修改颜色 -->
        <el-dialog
          title="修改物流"
          :visible.sync="addVisible2"
          :append-to-body="true"
          width="30%"
        >
          <span>
            <el-form
              ref="upFormref"
              :model="updateForm"
              :rules="formrulesup"
              label-width="100px"
            >
              <el-form-item
                label="代号"
                prop="id"
              >
                <el-input
                  v-model="updateForm.id"
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="物流名"
                prop="name"
              >
                <el-input v-model="updateForm.name" />
              </el-form-item>
            </el-form>
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="addVisible2 = false">取 消</el-button>
            <el-button
              type="primary"
              @click="update_wuliu"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-table>
    </el-card>
    <!-- 添加颜色的对话框 -->
  </div>
</template>

<script>
export default {
  name: 'Express',
  data() {
    return {
      user_name: '', // 读取登录信息
      role_tree_list: [],
      wuliu_li: [], // 颜色列表
      addVisible: false, // 是否弹窗
      addVisible2: false,
      addForm: {
        id: '',
        name: ''
      },
      updateForm: {}, // 修改
      formrules: {
        color_id: [
          {
            required: true,
            message: '代号不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        color_name: [
          {
            required: true,
            message: '名称不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      },
      formrulesup: {
        id: [
          {
            required: true,
            message: '代号不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          {
            required: true,
            message: '名称不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    wuliu_list() {
      var that = this
      this.$http.get('wuliu/').then(function(res) {
        // console.log(res)
        that.wuliu_li = res.data
      })
    },
    add_color() { // 新增物流
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('add_wuliu/', { form_data: this.addForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addVisible = false
                that.wuliu_list()// 刷新界面
              } else {
                that.$message.error('添加失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {
        }
      })
    },
    update_wuliu() {
      var that = this
      this.$refs.upFormref.validate(valid => {
        if (valid) {
          this.$http
            .post('update_wuliu/', { form_data: this.updateForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('修改成功')
                that.addVisible2 = false
                that.wuliu_list()// 刷新界面
              } else {
                that.$message.error('修改失败，请联系系统管理员')
                that.addVisible2 = false
              }
            })
        } else {

        }
      })
    },
    handleClose() {
      this.$refs.Formref.resetFields() // 重置
    },
    showEditDialog(name) {
      var that = this
      this.addVisible2 = true
      this.$http.post('wuliu_up_select/', { id: name }).then(function(res) {
        // console.log(res)
        that.updateForm = res.data
      })
    },
    delete_wuliu(name) { // 删除颜色，并提示
      var that = this
      this.$confirm('此操作将永久删物流, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function (res) {
        if (res === 'confirm') {
          that.$http.post('delete_wuliu/', { id: name })
            .then(function (res) {
              if (res.data === 'OK') { // 执行删除成功时
                that.$message.success('删除快递成功')
                that.wuliu_list()// 刷新列表
              } else {
                that.$message.error('删除失败')
              }
            })
        }
      }).catch(function (res) {
        console.log('删除失败')
        return res
      })
    },
    get_role() {
      var that = this
      // that.$message.success(this.user_name)
      // console.log('开始读取权限'+this.user_name)
      this.$http.post('get_role/', { user_name: this.user_name }).then(function (res) {
        if (res.status === 200) {
          that.role_tree_list = res.data// 按钮权限读取成功
        } else {
          that.$message.error('权限拉取失败')
        }
      })
    }
  },
  created() {
    this.wuliu_list()
    this.user_name = window.sessionStorage.getItem('token')
    this.get_role()
  }
}
</script>

<style scoped>
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>链条档案</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 10px;width: 700px">
      <el-row :gutter="20" style="margin-top: -10px;margin-bottom: 5px">
        <el-col class="el-row" :span="4">
          <el-button type="primary" @click="addVisible = true" v-if="role_tree_list.indexOf('1-1-1') !==-1">
            添加尺寸
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="color_li" size="small" border :header-row-style="{'height': '15px'}" :row-style="{'height': '15px'}"
                :cell-style="{'padding':'1px','height':'15px','margin':'0px'}" :stripe="true">
        <el-table-column type="index" />
        <el-table-column label="代码" prop="size_id"/>
        <el-table-column label="尺寸" prop="size_name"/>
        <el-table-column label="操作" width="90px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle
              size="mini" v-if="role_tree_list.indexOf('1-1-2') !==-1"
              @click="showEditDialog(scope.row.size_id)"/>
            <el-button type="danger" icon="el-icon-delete" circle
              size="mini" v-if="role_tree_list.indexOf('1-1-3') !==-1"
              @click="delete_color(scope.row.size_id)"/>
          </template>
        </el-table-column>

        <!--新增颜色-->
        <el-dialog
          title="新增尺寸" :visible.sync="addVisible" width="30%" :append-to-body="true" @close="handleClose">
          <span>
            <el-form ref="Formref" :model="addForm" :rules="formrules" label-width="100px">
              <el-form-item label="代号" prop="size_id">
                <el-input v-model="addForm.size_id" />
              </el-form-item>
              <el-form-item label="尺寸名" prop="size_name">
                <el-input v-model="addForm.size_name" />
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="add_color">确 定</el-button>
          </span>
        </el-dialog>

        <!--修改颜色 -->
        <el-dialog
          title="修改颜色"
          :visible.sync="addVisible2"
          :append-to-body="true"
          width="40%"
        >
          <span>
            <el-form ref="upFormref" :model="updateForm" :rules="formrulesup" label-width="100px">
              <el-form-item label="代号" prop="size_id">
                <el-input v-model="updateForm.size_id" disabled/>
              </el-form-item>
              <el-form-item label="颜色名" prop="size_name">
                <el-input v-model="updateForm.size_name" />
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="update_color">确 定</el-button>
          </span>
        </el-dialog>
      </el-table>
    </el-card>
    <!-- 添加颜色的对话框 -->
  </div>
</template>

<script>
export default {
  name: 'Size',
  data() {
    return {
      user_name: '',
      role_tree_list: [], // 三级列表权限
      color_li: [], // 颜色列表
      addVisible: false, // 是否弹窗
      addVisible2: false,
      addForm: {
        size_id: '',
        size_name: ''
      },
      updateForm: {}, // 修改
      formrules: {
        size_id: [
          {
            required: true,
            message: '代号不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        size_name: [
          {
            required: true,
            message: '名称不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      },
      formrulesup: {
        size_id: [
          {
            required: true,
            message: '代号不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        size_name: [
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
    color_list() {
      var that = this
      this.$http.get('size/').then(function(res) {
        // console.log(res)
        that.color_li = res.data
      })
    },
    add_color() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('add_size/', { form_data: this.addForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addVisible = false
                that.color_list()// 刷新界面
              } else {
                that.$message.error('添加失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {
        }
      })
    },
    update_color() {
      var that = this
      this.$refs.upFormref.validate(valid => {
        if (valid) {
          this.$http
            .post('update_size/', { form_data: this.updateForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('修改成功')
                that.addVisible2 = false
                that.color_list()// 刷新界面
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
      this.$http.post('size_up_select/', { id: name }).then(function(res) {
        // console.log(res)
        that.updateForm = res.data
      })
    },
    delete_color(name) { // 删除颜色，并提示
      var that = this
      this.$confirm('此操作将永久删尺寸, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function (res) {
        if (res === 'confirm') {
          that.$http.post('delete_size/', { color_id: name })
            .then(function (res) {
              if (res.data === 'OK') { // 执行删除成功时
                that.$message.success('删除成功')
                that.color_list()// 刷新列表
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
  mounted () {
    this.user_name = window.sessionStorage.getItem('token')
    // this.get_role()
  },
  created() {
    this.user_name = window.sessionStorage.getItem('token')
    this.get_role()
    this.color_list()
  }
}
</script>

<style scoped>
  /deep/ .el-table__body tr.current-row>td{
    background-color: #c2e7b0 !important;
  }
</style>

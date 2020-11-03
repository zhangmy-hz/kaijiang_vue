<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>产品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 10px;width: 900px">
      <el-row
        :gutter="20"
        style="margin-top: -10px;margin-bottom: 5px"
      >
        <el-col
          class="el-row"
          :span="4"
        >
          <el-button
            type="primary" v-if="role_tree_list.indexOf('1-5-1') !== -1"
            @click="addVisible = true"
          >
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="skutype_li"
        border
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
          label="产品类别"
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
              size="mini" v-if="role_tree_list.indexOf('1-5-2') !== -1"
              @click="showEditDialog(scope.row.id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini" v-if="role_tree_list.indexOf('1-5-3') !== -1"
              @click="delete_skutype(scope.row.id)"
            />
          </template>
        </el-table-column>

        <!--新增颜色-->
        <el-dialog
          title="新增颜色"
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
                prop="id"
              >
                <el-input v-model="addForm.id" />
              </el-form-item>
              <el-form-item
                label="产品分类"
                prop="name"
              >
                <el-input v-model="addForm.name" />
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="add_type"
            >确 定</el-button>
          </span>
        </el-dialog>

        <!--修改颜色 -->
        <el-dialog
          title="修改颜色"
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
                label="颜色名"
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
              @click="update_skutype"
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
  name: 'SkuType',
  data() {
    return {
      user_name: '',
      role_tree_list: [], // 三级列表权限
      skutype_li: [], // 颜色列表
      addVisible: false, // 是否弹窗
      addVisible2: false,
      addForm: {
        id: '',
        name: ''
      },
      updateForm: {}, // 修改
      formrules: {
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
    skytype_list() {
      var that = this
      this.$http.get('skutype/').then(function(res) {
        // console.log(res)
        that.skutype_li = res.data
      })
    },
    add_type() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('add_skutype/', { form_data: this.addForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addVisible = false
                that.skytype_list()// 刷新界面
              } else {
                that.$message.error('添加失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {
        }
      })
    },
    update_skutype() {
      var that = this
      this.$refs.upFormref.validate(valid => {
        if (valid) {
          this.$http
            .post('update_skutype/', { form_data: this.updateForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('修改成功')
                that.addVisible2 = false
                that.skytype_list()// 刷新界面
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
      this.$http.post('skutype_select/', { id: name }).then(function(res) {
        // console.log(res)
        that.updateForm = res.data
      })
    },
    delete_skutype(name) { // 删除颜色，并提示
      var that = this
      this.$confirm('此操作将永久删分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function (res) {
        if (res === 'confirm') {
          that.$http.post('delete_skutype/', { id: name })
            .then(function (res) {
              if (res.data === 'OK') { // 执行删除成功时
                that.$message.success('删除用户成功')
                that.skytype_list()// 刷新列表
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
  created() {
    this.skytype_list()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
  }
}
</script>

<style scoped>
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 10px">
      <el-row :gutter="20" style="margin: -10px">
        <el-col class="el-row" :span="4">
          <el-button type="primary" size="medium" @click="addrole = true" v-if="role_tree_list.indexOf('4-2-1') !== -1">
            添加权限
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="role_list"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px'}"
        :stripe="true"
        :highlight-current-row="true"
      >
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="序号" width="60px"/>
        <el-table-column label="角色名称" prop="role_name"/>
        <el-table-column label="角色描述" prop="role_explain"/>
        <el-table-column label="操作" width="233px">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delete_role(scope.row.role_name)" v-if="role_tree_list.indexOf('4-2-2') !== -1"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="update_role(scope.row.role_name)" v-if="role_tree_list.indexOf('4-2-3') !== -1"></el-button>
            <el-button type="primary" size="mini" @click="select_roles(scope.row.role_name)" v-if="role_tree_list.indexOf('4-2-4') !== -1">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色-->
    <el-dialog title="添加角色" :visible.sync="addrole" width="35%" @close="handleClose2">
      <span>
        <el-form ref="Formref" :model="addForm" :rules="formrules" label-width="100px">
          <el-form-item label="角色名称" prop="name" >
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="addForm.name_del" />
          </el-form-item>
        </el-form>
      </span>
      <el-button @click="addrole = false">取 消</el-button>
      <el-button type="primary" @click="role_new">确 定</el-button>
    </el-dialog>
    <!-- 修改角色-->
    <el-dialog title="修改角色" :visible.sync="addrole_update" width="35%">
      <span>
        <el-form ref="Formref" :model="UPForm" :rules="UPformrules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="UPForm.name" disabled/>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="UPForm.name_del" />
          </el-form-item>
        </el-form>
      </span>
      <el-button @click="addrole_update = false">取 消</el-button>
      <el-button type="primary" @click="role_update">确 定</el-button>
    </el-dialog>
    <!-- 分配权限-->
    <el-dialog title="分配权限" :visible.sync="showPower" width="35%" @close="handleClose"><!--权限列表开窗 -->
      <el-tree :data="role_tree" :props="defaultProps" @node-click="handleNodeClick" show-checkbox node-key="id" :default-checked-keys="role_check"
      ref="treeref"></el-tree>
      <el-button @click="showPower = false">取 消</el-button>
      <el-button type="primary" @click="role_save">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Power',
  data() {
    return {
      role_list: [], // 权限列表
      addrole_update: false, // 修改
      addrole: false, // 添加权限
      showPower: false, // 是否显示权限
      role_tree: [], // 权限显示列表-树状接口
      role_check: [], // 权限显示列表-树状接口,已经勾选中的权限信息
      role_name: '', // 目前选中的角色的名字
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      addForm: {
        name: '',
        name_del: ''
      },
      UPForm: {}, // 修改内容
      formrules: { // 表单校验规则
        name: [
          {
            required: true,
            message: '角色名称不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      },
      UPformrules: { // 表单校验规则
        name: [
          {
            required: true,
            message: '角色名称不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    get_role() { // 获取所有角色的信息
      var that = this
      this.$http.get('roles/').then(function (res) {
        if (res.data) {
          that.role_list = res.data
        } else {
          that.$message.error('加载失败')
        }
      })
    },
    select_roles(role_name) { // 分配权限按钮
      var that = this
      that.role_name = role_name// 更新目前选中的名字
      this.$http.get('quanxian_list_all/').then(function (res) { // 获取树状权限结构,全部内容
        if (res.status === 200) { // 接口加载成功
          that.role_tree = res.data// 树状接口赋值
          that.$http.post('role_check/', { role: role_name }).then(function (res2) { // 检查哪些权限已经勾选中了
            if (res2.status === 200) {
              that.role_check = res2.data
              that.showPower = true// 显示窗口
            } else {
              that.$message.error('权限拉取失败,请联系管理员')
            }
          })
        } else {
          that.$message.error('权限拉取失败,请联系管理员')
        }
      })
    },
    role_save() { // 保存选择的权限
      var that = this
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      // console.log(keys)
      this.$http.post('role_save/', { role: this.role_name, keys: keys }).then(function (res) {
        if (res.status === 200) {
          that.$message.success('保存成功')
          that.showPower = false
        } else {
          that.$message.error('数据更新失败')
        }
      })
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.role_tree = [], // 权限显示列表-树状接口
      this.role_check = [], // 权限显示列表-树状接口,已经勾选中的权限信息
      this.role_name = ''// 目前选中的角色的名字
    },
    handleClose2() {
      this.addForm = {}
    },
    role_new() { // 新增角色
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('role_new/', { form_data: this.addForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addrole = false
                that.get_role() // 刷新页面
              } else if (res.data === 'cuzai') {
                that.$message.error('名称已经存在')
              } else {
                that.$message.error('添加失败，请联系系统管理员')
              }
            })
        } else {
        }
      })
    },
    update_role(name) { // 修改用户
      var that = this
      this.$http.post('update_role_select/', { name: name }).then(function (res) {
        if (res.status === 200) {
          that.UPForm = res.data
          that.addrole_update = true // 打开开窗
        } else {
          that.$message.error('数据拉取失败')
        }
      })
    },
    role_update() { // 角色修改确认保存
      var that = this
      this.$http.post('role_up_save/', { upform: this.UPForm }).then(function (res) {
        if (res.data === 'OK') {
          that.$message.success('保存成功')
          that.addrole_update = false
          that.get_role()
        } else {
          that.$message.error('数据拉取失败')
        }
      })
    },
    delete_role(name) {
      var that = this
      this.$confirm('此操作将永久删角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function(res) {
          if (res === 'confirm') {
            that.$http.post('delete_role/', { role_name: name }).then(function(res) {
              if (res.data === 'OK') {
                // 执行删除成功时
                that.$message.success('删除角色成功')
                that.get_role() // 刷新列表
              } else {
                that.$message.error('删除失败')
              }
            })
          }
        })
        .catch(function(res) {
          console.log('删除失败')
          return res
        })//
    }
  },
  created () {
    this.get_role()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
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
  .el-table tbody tr:hover > td {
    background-color: #ecf5ff !important;
  }
  .el-dialog .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-dialog .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .el-dialog .el-upload el-upload--text {
    border: 1px;
  }
  .el-dialog .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .el-dialog .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

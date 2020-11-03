<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>材料信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20">
        <el-col :span="7" class="el-row">
          <el-input
            v-model="input"
            placeholder="输入编号或者名称搜索" clearable
            @clear="sku_list" @keyup.enter.native="sku_list">
            <el-button slot="append" icon="el-icon-search" @click="sku_list"/>
          </el-input>
        </el-col>
        <el-col class="el-row" :span="1.5">
          <el-button size="mini"
            type="primary" v-if="role_tree_list.indexOf('5-4-1') !== -1" @click="addVisible = true">
            新增
          </el-button>
        </el-col>
        <!--
        <el-col class="el-row" :span="1.5">
          <el-button type="primary" size="small" @click="excel_out">
            下载模板
          </el-button>
        </el-col>
        <el-col class="el-row" :span="1.5">
          <el-button type="primary" size="small" @click="addVisible_excel = true">
            导入
          </el-button>
        </el-col>  -->
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="sku_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px'}"
        :stripe="true"
        :highlight-current-row="true">
        <el-table-column type="index" width="60px"/>
        <el-table-column label="编号" prop="id"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="规格" prop="format"/>
        <el-table-column label="单位" prop="unit"/>
        <el-table-column label="单价" prop="price"/>
        <el-table-column label="备注" prop="note"/>
        <el-table-column label="创建日期" prop="create_date" width="160px"/>
        <el-table-column label="创建人" prop="create_user" width="100px"/>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status" active-text="启用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="status_change(scope.row.id,scope.row.status)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button
              type="primary" icon="el-icon-edit" circle
              size="mini" v-if="role_tree_list.indexOf('5-3-2') !== -1"
              @click="showEditDialog(scope.row)"/>
            <el-button
              type="danger" icon="el-icon-delete" circle
              size="mini" v-if="role_tree_list.indexOf('5-3-3') !== -1"
              @click="delete_sku(scope.row.id)"/>
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
    <el-dialog
      title="新增材料信息" :visible.sync="addVisible" width="35%" @close="handleClose">
      <span>
        <el-form
          ref="Formref"
          :model="addForm"
          :rules="formrules"
          label-width="100px">
          <div style="width:60%">
            <el-form-item label="编码" prop="id">
              <el-input v-model="addForm.id" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="规格">
              <el-input v-model="addForm.format" />
            </el-form-item>
            <el-form-item label="单位" >
              <el-input v-model="addForm.unit" />
            </el-form-item>
            <el-form-item label="采购单价" >
              <el-input v-model="addForm.price" type="number"/>
            </el-form-item>
            <el-form-item label="备注" >
              <el-input v-model="addForm.note"/>
            </el-form-item>
          </div>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_sku">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改材料信息" :visible.sync="addVisible2" width="35%" @close="handleClose2">
      <span>
        <el-form
          ref="Formupref"
          :model="updateForm" :rules="formuprules" label-width="100px">
              <el-form-item label="编号">
                <el-input v-model="updateForm.id" disabled/>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="updateForm.name" />
              </el-form-item>
              <el-form-item label="规格" >
                <el-input v-model="updateForm.format" />
              </el-form-item>
              <el-form-item label="单位">
                <el-input v-model="updateForm.unit" />
              </el-form-item>
              <el-form-item label="采购单价" >
                  <el-input v-model="updateForm.price" type="number"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="updateForm.note" />
              </el-form-item>
      </el-form>
      </span>
      <pan
        slot="footer" class="dialog-footer" style="margin-top: -20px">
        <el-button @click="addVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="update_sku">确 定</el-button>
      </pan>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      ahttp_excel: 'http://47.114.190.252:8888/store_excel', // 服务器地址,下载表格
      input: '',
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      sku_li: [],
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      addForm: {
        id: '',
        name: '',
        people: '', //
        phone: '',
        address: '',
        note: ''
      },
      img_name: '', // 上传文件的链接地址
      img_name2: '', // 上传文件的链接地址，新增时
      updateForm: {},
      // 表单的验证规则
      formrules: {
        id: [
          {
            required: true,
            message: '编号不能为空!',
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
      formuprules: {
        name: [
          {
            required: true,
            message: '名称不能为空!',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.sku_list()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
  },
  methods: {
    sku_list() {
      var that = this
      this.$http
        .post('cl_sku/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.input
        })
        .then(function(res) {
          // console.log(res)
          that.total = res.data.total
          that.sku_li = res.data.sku_list
        })
    },
    handleSizeChange(res) {
      // 监听页数改变
      this.pagesize = res
      this.sku_list()
    },
    handleCurrentChange(res) {
      // 监听页码改变
      // console.log(res)
      this.currentPage = res
      this.sku_list()
    },
    status_change(name, status) {
      var that = this
      // 更改状态
      this.$http
        .post('cl_sku_status/', { name: name, status_c: status })
        .then(function(res) {
          if (res.data === 'OK') {
            that.$message.success('状态更新成功')
          } else {
            that.$message.error('状态更新失败')
            scope.row.status = !status
          }
        })
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
      this.addForm.note = ''
      this.addForm.unit = ''
      this.addForm.format = ''
    },
    handleClose2() {
      this.updateForm = []
      this.sku_list()
    },
    excel_out() { // 导出表格,下载模板
      window.open(this.ahttp_excel)
    },
    add_sku() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('add_cl_sku/', {
              form_data: this.addForm,
              create_people: window.sessionStorage.getItem('token')
            })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('添加成功')
                that.addVisible = false
                that.sku_list() // 刷新页面
              } else {
                that.$message.error('添加失败，请联系系统管理员')
                that.addVisible = false
              }
            })
        } else {
        }
      })
    },
    update_sku() {
      // 修改商品基础信息
      var that = this
      this.$refs.Formupref.validate(valid => {
        if (valid) {
          // 修改验证都通过
          this.$http
            .post('cl_sku_update/', { data: this.updateForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('材料信息修改成功')
                that.addVisible2 = false
                that.sku_list()
              } else {
                that.$message.error('材料信息修改失败，请联系管理员')
              }
            })
        }
      })
    },
    showEditDialog(row) {
      var that = this
      this.addVisible2 = true
      that.updateForm = row
    },
    delete_sku(name) {
      // 删除用户，并提示
      var that = this
      this.$confirm('此操作将永久删材料产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function(res) {
          if (res === 'confirm') {
            that.$http.post('delete_cl_sku/', { name: name }).then(function(res) {
              if (res.data === 'OK') {
                // 执行删除成功时
                that.$message.success('删除商品成功')
                that.sku_list() // 刷新列表
              } else {
                that.$message.error('删除失败')
              }
            })
          }
        })
        .catch(function(res) {
          console.log('删除失败')
          return res
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

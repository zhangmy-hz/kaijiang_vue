<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>产品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20">
        <el-col :span="2" class="el-row">
          <el-select size="small"
            v-model="page_price" placeholder="包装单价" style="width: 100px">
            <el-option clearable v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-row">
          <el-select size="small"
                     v-model="draw_price" placeholder="画图单价" style="width: 100px">
            <el-option clearable v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="7" class="el-row">
          <el-input size="small"
            v-model="input"
            placeholder="输入编号或者名称搜索" clearable
            @clear="sku_list" @keyup.enter.native="sku_list">
            <el-button slot="append" icon="el-icon-search" @click="sku_list"/>
          </el-input>
        </el-col>
        <el-col class="el-row" :span="4">
          <el-button size="small"
            type="primary" v-if="role_tree_list.indexOf('1-6-1') !== -1" @click="addVisible = true">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="sku_li"
        :border="true"
        :header-row-style="{'height': '10px'}"
        :row-style="{'height': '10px'}"
        :cell-style="{'padding':'0px'}"
        :stripe="true"
        :highlight-current-row="true">
        <el-table-column type="index" width="60px"/>
        <el-table-column label="编号" prop="id" width="120px"/>
        <el-table-column label="名称" prop="name" width="250px"/>
        <el-table-column label="分类" prop="type" width="100px"/>
        <el-table-column label="风格" prop="unit" width="100px"/>
        <el-table-column label="工艺" prop="technology" width="100px"/>
        <el-table-column label="包装单价" prop="price" />
        <el-table-column label="画图单价" prop="draw_price" />
        <el-table-column label="成本" prop="cost_price" />
        <el-table-column label="款式数量" prop="style_num" />
        <el-table-column label="备注" prop="barcode"/>
        <el-table-column label="制单人" prop="people"/>
        <el-table-column label="创建日期" prop="create_date" width="180px"/>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <!-- -->
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="status_change(scope.row.id,scope.row.status,scope)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary" icon="el-icon-edit" circle
              size="mini" v-if="role_tree_list.indexOf('1-6-2') !== -1"
              @click="showEditDialog(scope.row.id)"/>
            <el-button
              type="danger" icon="el-icon-delete" circle
              size="mini" v-if="role_tree_list.indexOf('1-6-3') !== -1"
              @click="delete_sku(scope.row.id)"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <div style="margin-top: 10px;margin-bottom: -13px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[15,20,50,100]"
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
      title="新增商品"
      :visible.sync="addVisible" width="40%"
      @close="handleClose">
      <span>
        <el-form
          ref="Formref" size="small"
          :model="addForm"
          :rules="formrules"
          label-width="100px">
          <div style="width:60%">
            <el-form-item label="SKU编号" prop="id">
              <el-input v-model="addForm.id" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="分类" prop="type">
              <el-autocomplete
                v-model="addForm.type"
                class="el-input"
                :fetch-suggestions="querySearchAsync"
                placeholder="选择分类"
                @select="handleSelect"/>
            </el-form-item>
            <el-form-item label="风格" prop="unit">
              <el-autocomplete
                v-model="addForm.unit"
                class="el-input"
                :fetch-suggestions="querySearchAsync_style"
                placeholder="选择风格"
                @select="handleSelect"/>
            </el-form-item>
            <el-form-item label="工艺" prop="barcode">
              <el-input v-model="addForm.technology"/>
            </el-form-item>
            <el-form-item label="备注" prop="barcode">
              <el-input v-model="addForm.barcode" />
            </el-form-item>
            <el-form-item label="包装单价" >
              <el-input v-model="addForm.price" type="number"/>
            </el-form-item>
            <el-form-item label="画图单价">
              <el-input v-model="addForm.draw_price" type="number"/>
            </el-form-item>
            <el-form-item label="画图款式" >
              <el-input v-model="addForm.style_num" type="number"/>
            </el-form-item>
            <el-form-item label="成本" >
              <el-input v-model="addForm.cost_price" type="number"/>
            </el-form-item>
          </div>
        </el-form>
      </span>
      <el-upload
        class="avatar-uploader"
        style="margin-left: 350px;margin-top: -250px;border: 2px"
        :show-file-list="false"
        :http-request="upload_img_new"
      >
        <img
          v-if="img_name2"
          :src="img_name2"
          class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"/>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_sku">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改商品" :visible.sync="addVisible2" width="40%">
      <span>
        <el-form
          ref="Formupref" size="small"
          :model="updateForm" :rules="formuprules"
          label-width="100px">
          <el-form-item>
            <span>
              <el-upload style="margin-top: 10px"
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="upload_img">
                <img
                  v-if="img_name" :src="img_name" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </span>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="编号">
                <el-input v-model="updateForm.id" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="updateForm.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="分类" prop="type">
                <el-autocomplete
                  v-model="updateForm.type"
                  class="el-input"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="选择分类"
                  @select="handleSelect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风格" prop="unit">
                <el-autocomplete
                  v-model="updateForm.unit"
                  class="el-input"
                  :fetch-suggestions="querySearchAsync_style"
                  placeholder="选择风格"
                  @select="handleSelect"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="包装单价">
                <el-input v-model="updateForm.price" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="画图单价">
                <el-input v-model="updateForm.draw_price" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="画图款式">
                <el-input v-model="updateForm.style_num" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成本">
                <el-input v-model="updateForm.cost_price" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="barcode">
                <el-input v-model="updateForm.barcode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工艺" prop="barcode">
                <el-input v-model="updateForm.technology"/>
              </el-form-item>
            </el-col>
          </el-row>
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
      //ahttp: 'http://127.0.0.1:8881/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      input: '',
      page_price: '', //包装单价
      draw_price: '', //画图单价
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      sku_li: [],
      currentPage: 1, // 当前页
      pagesize: 20, // 每页显示行数
      total: 0, // 总计数量
      addForm: {
        id: '',
        name: '',
        type: '', // 地址
        technology:'',
        unit: '',
        barcode: '',
        price: 0,
        draw_price: 0,
        style_num: 0,
        cost_price: 0,
        create_people: '', // 登录者
        imageUrl: ''
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
        ],
        type: [
          {
            required: true,
            message: '分类不能为空!',
            trigger: ['blur', 'change']
          }
        ],
        unit: [
          {
            required: true,
            message: '风格不能为空!',
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
        ],
        unit: [
          {
            required: true,
            message: '风格不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      },
      options: [
        {
          value: '',
          label: ''
        },
        {
          value: '为0',
          label: '为0'
        },
        {
          value: '不为0',
          label: '不为0'
        }
      ],
      options1: [
        {
          value: '',
          label: ''
        },
        {
          value: '为0',
          label: '为0'
        },
        {
          value: '不为0',
          label: '不为0'
        }
      ],
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
        .post('sku/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.input,
          page_price: this.page_price,
          draw_price:this.draw_price
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
    status_change(name, status, scope) {
      // 更改状态
      this.$http
        .post('sku_status/', { name: name, status_c: status })
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
      this.$refs.Formref.resetFields() // 订单重置
      this.img_name2 = ''
    },
    add_sku() {
      var that = this
      this.$refs.Formref.validate(valid => {
        if (valid) {
          this.$http
            .post('add_sku/', {
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
            .post('sku_update/', { data: this.updateForm })
            .then(function(res) {
              if (res.data === 'OK') {
                that.$message.success('用户修改成功')
                that.addVisible2 = false
                that.sku_list()
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
      this.$http.post('sku_up_select/', { id: name }).then(function(res) {
        // console.log(res)
        that.updateForm = res.data
        that.img_name = that.ahttp + that.updateForm.imageUrl
      })
    },
    delete_sku(name) {
      // 删除用户，并提示
      var that = this
      this.$confirm('此操作将永久删商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function(res) {
          if (res === 'confirm') {
            that.$http.post('delete_sku/', { name: name }).then(function(res) {
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
    },
    querySearchAsync(queryString, cb) {
      this.$http
        .post('type_select/', { type: queryString })
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].type
          }
          cb(data)
        })
    },
    querySearchAsync_style(queryString, cb) {
      this.$http
        .post('style_select/', { type: queryString })
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].type
          }
          cb(data)
        })
    },
    handleSelect(item) {
      console.log(item)
    },
    beforeAvatarUpload(file) {
      // 图片上传时验证
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isLt1M
    },
    upload_img(file) {
      var that = this
      // 图片上传
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file.file)
      this.$http
        .post('img/', fileReq)
        .then(function(res) {
          // console.log(res)
          if (res.status === 200) {
            that.$message.success('上传成功')
            that.img_name = that.ahttp + res.data
            that.updateForm.imageUrl = res.data // 文件名称
            // console.log(that.img_name)
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
        })
    },
    upload_img_new(file) {
      var that = this
      // 图片上传
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file.file)
      this.$http
        .post('img/', fileReq)
        .then(function(res) {
          // console.log(res)
          if (res.status === 200) {
            that.$message.success('上传成功')
            that.img_name2 = that.ahttp + res.data
            that.addForm.imageUrl = res.data // 文件名称
            // console.log(that.img_name)
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
        })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 3px;
  display: flex;
  flex-wrap: wrap;
  margin-top: -4px;
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
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}
</style>

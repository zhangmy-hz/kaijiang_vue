<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="7" class="el-row">
          <el-input
            v-model="input"
            placeholder="输入单据任意信息搜索" clearable
            @clear="order_list">
          </el-input>
        </el-col>
        <el-col class="el-row" :span="2">
          <el-button
            type="primary"
            size="small" v-if="role_tree_list.indexOf('5-1-1') !== -1" @click="order_new">
            新增入库
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="order_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px'}"
        :stripe="true"
        :highlight-current-row="true">
        <el-table-column type="index" label="#" width="60px"/>
        <el-table-column label="入库单号" prop="id"/>
        <el-table-column label="日期" prop="date"/>
        <el-table-column label="备注" prop="note"/>
        <el-table-column label="创建人" prop="create_user" width="80px"/>
        <el-table-column label="创建时间" prop="create_time" width="180px"/>
        <el-table-column label="审核人" prop="examine" width="80px"/>
        <el-table-column label="审核时间" prop="examine_time" width="180px"/>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle
                       size="mini" v-if="role_tree_list.indexOf('5-1-2') !== -1 && (scope.row.examine === '' || scope.row.examine === null || scope.row.examine === 'undefined')"
                       @click="showEditDialog(scope.row.id)"/>
            <el-button type="primary" icon="el-icon-view" circle
                       size="mini" v-if="role_tree_list.indexOf('5-1-3') !== -1 && scope.row.examine "
                       @click="showEditDialog_see(scope.row.id)"/>
            <el-button type="danger" icon="el-icon-delete" circle
                       size="mini" v-if="role_tree_list.indexOf('5-1-4') !== -1"
                       @click="delete_order(scope.row.id,scope.row.examine)"/>
            <el-tooltip
              v-if="!scope.row.examine && role_tree_list.indexOf('5-1-5') !== -1 "
              class="item" effect="dark" content="审核入库"
              placement="top-start" enterable="false">
              <el-button type="success" icon="el-icon-check" circle
                         size="mini" @click="Approval(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip
              v-else-if="role_tree_list.indexOf('5-1-5') !== -1 && scope.row.examine !== ''"
              class="item" effect="dark" content="撤审入库" placement="top-start" enterable="false">
              <el-button type="warning"  disabled
                         icon="el-icon-refresh-left" circle size="mini" @click="cancel_Approval(scope.row.id)"/>
            </el-tooltip>
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
  </div>
</template>

<script>
export default {
  name: 'Warehousing',
  data() {
    return {
      input: '',
      user: '', // 记录当前用户
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      order_li: [],
      role_tree_list: [],
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      updateForm: {}
    }
  },
  created() {
    this.user = window.sessionStorage.getItem('token')
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
    this.order_list()
  },
  methods: {
    order_list() {
      var that = this
      this.$http
        .post('warehouse/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.input
        })
        .then(function(res) {
          // console.log(res)
          that.total = res.data.total
          that.order_li = res.data.user_list
        })
    },
    order_new() { // 订单新增
      this.$router.push('/5-1-1')// 调整订单新增页面
    },
    handleSizeChange(res) {
      // 监听页数改变
      this.pagesize = res
      this.order_list()
    },
    handleCurrentChange(res) {
      // 监听页码改变
      // console.log(res)
      this.currentPage = res
      this.order_list()
    },
    upload_excel(file) { // 上传表格
      var that = this
      // 图片上传
      const loading = that.$loading({ lock: true, text: '文件拼命上传中,请勿关闭,请稍等,...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file.file)
      this.$http
        .post('excel_file_store/', fileReq)
        .then(function(res) {
          console.log(res)
          if (res.data !== 'nothing') {
            that.$notify({ title: '提示', message: '文件上传成功', duration: 0, type: 'success', offset: 100 })
            that.InForm.infile = res.data // 文件名称
            loading.close()
            // console.log(that.img_name)
          } else {
            that.$notify.error({ title: '提示', message: '上传文件模板错误,请核对是否和模板列一致', duration: 0, offset: 100 })
            loading.close()
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
          loading.close()
        })
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
    },
    showEditDialog(id) {
      this.$router.push({ path: '/5-1-2', query: { order: id } })// 调整订单新增页面
    },
    showEditDialog_see(id) { // 查看订单
      this.$message.warning('审核订单只能查看')
      this.$router.push({ path: '/5-1-3', query: { order: id } })// 调整订单新增页面
    },
    delete_order(name, examine) {
      // 删除用户，并提示
      var that = this
      if (examine) {
        that.$message.warning('已经审核,不能删除')
      } else {
        this.$confirm('此操作将永久删除订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function (res) {
            if (res === 'confirm') {
              that.$http.post('delete_ware/', { name: name }).then(function (res) {
                if (res.data === 'OK') {
                  // 执行删除成功时
                  that.$message.success('删除订单成功')
                  that.order_list() // 刷新列表
                } else {
                  that.$message.error('删除失败')
                }
              })
            }
          })
          .catch(function (res) {
            console.log('删除失败')
            return res
          })
      }
    },
    Approval(id) { // 订单审核
      var that = this
      this.$http.post('pur_Approval/', { order: id, user: that.user })
        .then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('审核成功')
            that.order_list()
          } else {
            that.$message.error('审核失败')
          }
        })
    },
    cancel_Approval(id) {
      var that = this
      this.$http.post('order_Approval_cancel/', { order: id, user: that.user })
        .then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('审核成功')
            that.order_list()
          } else if (res.data === 404) {
            that.$message.warning('已经提交画图处理,不能审核,请删除画图批次后再作业')
          } else {
            that.$message.error('审核失败')
          }
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
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>包装加工</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <div style="margin-bottom: 10px">
        <el-input
          ref="input"
          v-model="id"
          placeholder="扫描订单条码"
          clearable="true"
          style="float: left;width: 70%"
          @keyup.enter.native="check_id"
        />
        <el-input
          v-model="user_code"
          disabled
          style="width:20%"
          label="作业账号"
        />
      </div>
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="80px"
        size="mini"
      >
        <div style="width:100%">
          <el-form-item label="订单号:">
            <el-input
              v-model="selectForm.order_code"
              style="width:110px;color: chartreuse"
              disabled
            />
          </el-form-item>
          <el-form-item label="名字:">
            <el-input
              v-model="selectForm.order_name"
              style="width:110px;color: chartreuse"
              disabled
            />
          </el-form-item>
          <el-form-item label="合数">
            <el-input
              v-model="selectForm.total_num"
              style="width:110px;color: chartreuse"
              disabled
            />
          </el-form-item>
          <el-form-item label="物流">
            <el-input
              v-model="selectForm.wuliu"
              style="width:110px;color: chartreuse"
              disabled
            />
          </el-form-item>
          <el-form-item label="链长">
            <el-input
              v-model="selectForm.lianchang"
              style="width:110px;color: chartreuse"
              disabled
            />
          </el-form-item>
        </div>
      </el-form>
      <el-button
        size="mini"
        style="float: left"
        type="success"
        @click="packing_list"
      >
        工作量明细
      </el-button>
      <el-table
        :data="packing_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px','white-space':pre-line}"
        :stripe="true"
        :highlight-current-row="true"
      >
        <el-table-column
          type="index"
          width="60px"
        />
        <el-table-column
          label="作业人账号"
          prop="user_code"
        />
        <el-table-column
          label="日期"
          prop="date"
        />
        <el-table-column
          label="订单号"
          prop="order_code"
        />
        <el-table-column
          label="订单名字"
          prop="name"
        />
        <el-table-column
          label="产品编码"
          prop="item_code"
        />
        <el-table-column
          label="产品名称"
          prop="item_name"
        />
        <el-table-column
          label="合数"
          prop="total_num"
        />
        <el-table-column
          label="加工数量"
          prop="packing_num"
        />
        <el-table-column
          label="单价"
          prop="price"
        />
      </el-table>
      <!-- 分页区域-->
      <div style="margin-top: 10px;margin-bottom: -13px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
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
  name: 'Packing',
  data() {
    return {
      id: '', // 订单的ID标识
      user_code: '', // 用户名称
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      selectForm: {
        order_code: '',
        name: '',
        total_num: '',
        wuliu: '',
        lianchang: ''
      },
      packing_li: []
    }
  },
  created () {
    this.user_code = window.sessionStorage.getItem('token')
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    packing_list() {
      var that = this
      this.$http.post('packing_list/', { page: this.currentPage, size: this.pagesize, user_code: this.user_code })
        .then(function (res) {
          that.packing_li = res.data.packing_li
          that.total = res.data.total
        })
    },
    handleSizeChange(res) {
      // 监听页数改变
      this.pagesize = res
      this.packing_list()
    },
    handleCurrentChange(res) {
      // 监听页码改变
      // console.log(res)
      this.currentPage = res
      this.packing_list()
    },
    check_id() { // 扫码回车事件
      var that = this
      // this.$message.success('扫描成功')
      this.$http.post('packing_save/', { order_id: this.id, user_code: this.user_code }).then(function (res) {
        if (res.data === 404) {
          that.$message.error('扫描条码不存在,无法识别')
          that.id = ''
        } else if (res.data === 403) {
          that.$message.error('包装已经完成,不用扫描')
          that.id = ''
        } else if (res.data === 405) {
          that.$message.error('包装已经关闭,不用扫描')
          that.id = ''
        } else { // 表示本次扫描成功了
          that.$message.success('扫描成功!')
          that.id = ''
          that.selectForm = res.data
          that.packing_list()// 从新加载明细
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
  /deep/ .el-table .cell{
    white-space:pre-line;
    text-align: center;
  }
</style>

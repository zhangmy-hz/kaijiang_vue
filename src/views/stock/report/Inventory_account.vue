<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存明细账</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="7" class="el-row">
          <el-input
            v-model="input"
            placeholder="输入材料信息查询" clearable
            @clear="order_list">
          </el-input>
        </el-col>
        <el-col class="el-row" :span="2">
          <el-button
            type="primary"
            size="small" @click="order_list">
            查询
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
        <el-table-column label="单号"  prop="order_key"/>
        <el-table-column label="日期"  prop="date"/>
        <el-table-column label="材料编码" prop="item_code"/>
        <el-table-column label="材料名称" prop="item_name"/>
        <el-table-column label="规格" prop="format"/>
        <el-table-column label="单位" prop="unit"/>
        <el-table-column label="数量" prop="num" />
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
  name: 'Inventory_account',
  data() {
    return {
      input: '',
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
        .post('Stock_account/', {
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
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
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

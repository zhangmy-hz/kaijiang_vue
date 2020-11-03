<template>
  <el-card >
    <el-form
      :model="selectForm" :inline="true" label-width="80px" size="mini">
      <div style="width:100%">
        <el-form-item label="作业人" v-if="this.role_tree_list.indexOf('3-3-1') === -1">
          <el-input
            v-model="selectForm.user_code" style="width:110px"/>
        </el-form-item>
        <el-form-item label="画图日期">
          <el-date-picker
            v-model="selectForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="select">
            查询
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="packing_li" size="mini"
      :border="true"
      :header-row-style="{'height': '20px'}"
      :row-style="{'height': '20px'}"
      :cell-style="{'padding':'7px','white-space':pre-line}"
      :stripe="true"
      :highlight-current-row="true">
      <el-table-column type="index" width="60px"/>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <el-tag size="mini" effect="dark" type="success" v-if="scope.row.draw_status === '画图完成'">{{scope.row.draw_status}}</el-tag>
          <el-tag size="mini" effect="dark" type="warning" v-if="scope.row.draw_status === '拉图完成'">{{scope.row.draw_status}}</el-tag>
          <el-tag size="mini" effect="dark" type="warning" v-if="scope.row.state === '关闭'">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="画图人" prop="draw_user"/>
      <el-table-column label="订单日期" prop="date" width="110px"/>
      <el-table-column label="画图日期" prop="draw_time" width="150px"/>
      <el-table-column label="拉图日期" prop="draw_again_time" width="120px"/>
      <el-table-column label="业务单号" prop="order_key" width="130px"/>
      <el-table-column label="ERP单号" prop="order_code" width="120px"/>
      <el-table-column label="订单名字" prop="name"/>
      <el-table-column label="产品编码" prop="item_code"/>
      <el-table-column label="产品名称" prop="item_name"/>
      <el-table-column label="合数" prop="total_num"/>
      <el-table-column label="数量" prop="packing_num"/>
      <el-table-column label="备注" prop="note"/>
      <el-table-column label="画图成本" prop="draw_amount"/>
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
  </el-card >
</template>

<script>
export default {
  name: 'draw_report',
  data() {
    return {
      id: '', // 订单的ID标识
      role_tree_list: [], // 权限列表
      user_code: '', // 用户名称
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      selectForm: {
        user_code: '',
        date: ''
      },
      packing_li: []
    }
  },
  created () {
    this.user_code = window.sessionStorage.getItem('token')
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
    if (this.role_tree_list.indexOf('3-3-1') !== -1) {
      this.selectForm.user_code = user_code // 默认用admin标识
    }
  },
  mounted () {
    this.packing_list()
  },
  methods: {
    packing_list () {
      var that = this
      this.$http.post('draw_list_all/', {
        page: this.currentPage,
        size: this.pagesize,
        serch: that.selectForm
      })
        .then(function (res) {
          that.packing_li = res.data.user_list
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
    select() {
      this.packing_list()
    }
  }
}
</script>

<style scoped>

</style>

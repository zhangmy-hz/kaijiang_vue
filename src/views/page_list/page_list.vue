<template>
  <div>
    <el-form
      :model="selectForm"
      :inline="true"
      label-width="80px"
      size="mini"
    >
      <div style="width:100%">
        <el-form-item label="作业人">
          <el-input
            v-model="selectForm.order_code"
            style="width:110px"
          />
        </el-form-item>
        <el-form-item label="订单日期">
          <el-date-picker
            v-model="selectForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="select"
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="select"
          >
            导出
          </el-button>
        </el-form-item>
      </div>
    </el-form>
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
  </div>
</template>

<script>
export default {
  name: 'page_list',
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
    this.packing_list()
  },
  methods: {
    packing_list () {
      var that = this
      this.$http.post('packing_list_all/', {
        page: this.currentPage,
        size: this.pagesize
      })
        .then(function (res) {
          that.packing_li = res.data.packing_li
          that.total = res.data.total
        })
    },
    select() {
      this.$message.success('优化中,马上就来')
    }
  }
}
</script>

<style scoped>

</style>

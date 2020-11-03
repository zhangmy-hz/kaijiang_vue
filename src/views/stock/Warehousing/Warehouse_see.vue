<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/5-1' }">
        入库列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>新增入库单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px">
      <el-row :gutter="58" style="margin-top: -10px">
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="close_order">
            关闭
          </el-button>
        </el-col>
      </el-row>
      <el-divider style="margin-top: 1px"/>
      <el-form
         :model="addForm" :inline="true"  label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="入库单号">
            <el-input
              v-model="addForm.id" style="width:110px" disabled/>
          </el-form-item>
          <el-form-item label="往来对象"  >
            <el-input v-model="addForm.supplier_ware" disabled style="width: 200px"/>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-input v-model="addForm.date" disabled style="width: 200px"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.note" style="width: 200px"/>
          </el-form-item>
        </div>
      </el-form>
      <!-- 订单列表区域 -->
      <el-table
        ref="refs"
        :row-class-name="tableRowClassName"
        :data="order_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '10px'}"
        :cell-style="{'padding':'0px','height':'10px','margin':'0px'}"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
        @row-click="onRowClick">
        <el-table-column type="index" />
        <el-table-column label="材料编号" width="150px" prop="item_code" />
        <el-table-column label="产品名称" width="250px" prop="item_name" />
        <el-table-column label="规格" width="120px" prop="format" />
        <el-table-column label="单价" width="70px" prop="price" />
        <el-table-column label="单位" width="60px" prop="unit" />
        <el-table-column label="数量" width="70px" prop="num" />
        <el-table-column label="金额" width="70px" prop="total" />
        <el-table-column label="备注" width="150px" prop="note" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Warehouse_new',
  data() {
    return {
      // 表单的验证规则
      addForm: {},
      order_li: []
    }
  },
  created() {
    this.page_get()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index
    },
    // 添加对话框，关闭时触发
    close_order() { // 关闭订单
      var that = this
      this.$confirm('确定关闭订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function (res) {
        if (res === 'confirm') {
          that.$router.back(-1)// 返回上一层
        }
      })
    },
    page_get() { // 页面初始化
      var that = this
      that.order_num = that.$route.query.order
      this.$http.post('pur_page_get/', { order: that.order_num })
        .then(function (res) {
          console.log(res.data)
          that.addForm = res.data.tou
          that.order_li = res.data.shen
        })
    }
  }
}
</script>
.el-table tbody tr:hover>td { background-color: green;color: #000; }
<style scoped>
/deep/.select_option {
  width: 150%!important;
  text-align: left;
}
</style>

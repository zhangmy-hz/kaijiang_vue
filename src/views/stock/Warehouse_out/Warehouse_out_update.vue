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
    <el-card
      style="margin-top: 15px"
      @keydown.enter="add_order_list">
      <el-row :gutter="58" style="margin-top: -10px">
        <el-col class="el-row" :span="1" style="margin-left: 5px">
          <el-button type="primary" size="small" @click="order_save">
            保存
          </el-button>
        </el-col>
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="close_order">
            关闭
          </el-button>
        </el-col>
      </el-row>
      <el-divider style="margin-top: 1px"/>
      <el-form
        ref="Formref" :model="addForm" :inline="true" :rules="formrules" label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="入库单号">
            <el-input
              v-model="addForm.id" style="width:110px" disabled/>
          </el-form-item>
          <el-form-item label="往来对象" prop="supplier" >
            <el-autocomplete style="width: 200px;margin-left: -10px"
                             v-model="addForm.supplier_ware"
                             size="small" popper-class="select_option"
                             class="el-input" clearable
                             :fetch-suggestions="querySearchAsync_pur"
                             placeholder="选择供应商"/>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="addForm.date"
              style="width: 140px"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.note" style="width: 200px"/>
          </el-form-item>
        </div>
      </el-form>
      <el-button
        type="primary"
        size="small" style="float: left"
        @click="add_order_list">
        添加一行
      </el-button>
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
        <el-table-column label="材料编号" width="150px">
          <template slot-scope="scope">
            <el-autocomplete style="width: 250px"
                             v-model="scope.row.item_code"
                             size="small" popper-class="select_option"
                             class="el-input" clearable
                             :fetch-suggestions="querySearchAsync"
                             placeholder="选择SKU"
                             @select="handleSelect"/>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="250px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.item_name" size="small"  />
          </template>
        </el-table-column>
        <el-table-column label="规格" width="120px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.format"  size="small" style="width: 120px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="70px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" type="number" size="small" @input="input_change" style="width: 70px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60px">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.unit" size="small"  style="width: 60px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="70px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" size="small" type="number" @input="input_change" style="width: 70px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="70px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.total" type="number" size="small" @input="input_change" style="width: 70px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.note" size="small" style="width: 148px;margin-left: -10px"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="danger" icon="el-icon-delete" circle size="mini"
              @click="delete_order(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Warehouse_new',
  data() {
    return {
      currentRowIndex: '', // 记录当前表格现在的行
      order_li: [
        {
          item_code: '',
          item_name: '',
          unit: '',
          format: '',
          num: 0,
          price: '',
          note: '',
          total: 0
        }
      ],
      addForm: {
        id: '',
        supplier_ware: '',
        date: '',
        note: '',
        create_user: ''// 创建人
      },
      // 表单的验证规则
      formrules: {
        supplier_ware: [
          {
            required: true,
            message: '供应商不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      }
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
    add_order_list() {
      // 添加一行明细
      console.log(this.currentRowIndex)
      if (this.currentRowIndex === '') { // 初始化的值，为空
        this.$message.error('当前行信息维护完整，才能新增')
      } else {
        var arr = this.order_li[this.order_li.length - 1]
        if (arr.item_code === '') {
          this.$message.error('SKU信息为空')
        } else if (arr.num === '') {
          this.$message.error('订单数量为0')
        } else {
          this.order_li.push({
            item_code: '',
            item_name: '',
            unit: '',
            format: '',
            num: 0,
            price: '',
            note: '',
            total: 0
          })
        }
      }
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
      this.img_name2 = ''
    },
    querySearchAsync(queryString, cb) {
      this.$http.post('cl_order_sku/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    querySearchAsync_pur(queryString, cb) { // 选中供应商列表
      this.$http.post('pur_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    handleSelect(item) {
      this.order_li[this.currentRowIndex].item_code = item.id
      this.order_li[this.currentRowIndex].item_name = item.name
      this.order_li[this.currentRowIndex].unit = item.unit
      this.order_li[this.currentRowIndex].format = item.format
      this.order_li[this.currentRowIndex].price = item.price// 得到图片地址
    },
    input_change() { // 单价,数量,金额变化计算
      var index_i = this.currentRowIndex // 计算当前行
      this.order_li[index_i].total = this.order_li[index_i].price * this.order_li[index_i].num
    },
    delete_order(row) { // 明细行删除
      if (this.currentRowIndex === '' || this.currentRowIndex === 0) {

      } else {
        this.order_li.splice(row, 1)
      }
    },
    get_order_num() { // 获得订单号
      var that = this
      this.$http.get('pur_order/')
        .then(function (res) {
          that.addForm.order_code = 'RK' + res.data[0][0]
        })
    },
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
    order_save() { // 订单保存
      var that = this
      if (that.addForm.supplier_ware === '') {
        that.$message.warning('供应商不能为空')
      } else {
        var orderarr = that.order_li[that.order_li.length - 1]
        this.$confirm('确定保存订单信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function (res) {
          if (res === 'confirm') {
            // 修改验证都通过
            if (orderarr.order_code === '' || orderarr.item_code === '' || orderarr.num === '') {
              that.$message.error('信息未填写完整，无法保存')
            } else {
              that.$http.post('cl_order_update/', {
                order_tou: that.addForm,
                order_shen: that.order_li
              })
                .then(function (res) {
                  if (res.data === 'OK') {
                    that.$message.success('入库保存成功')
                    that.$router.back(-1)// 返回上一层
                  } else {
                    that.$message.error('入库保存失败')
                  }
                })
            }
          }
        })
      }
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

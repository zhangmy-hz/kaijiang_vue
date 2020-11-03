<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>扫描出库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-card style="float: left;width: 45%">
        <div slot="header">
          <span>逐单扫描出库</span>
        </div>
        <div>
          <el-input
            v-model="order_barcode"
            placeholder="扫描订单条码"
            clearable="true"
            @keyup.enter.native="check_id"
          />
        </div>
      </el-card>
      <el-card style="float: right;width: 45%">
        <div slot="header">
          <span>批量提交出库</span>
        </div>
        <div>
          <el-input
            v-model="textarea"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="批量复制单号,比如:
12412424
123124124
124125125"
          />
          <el-button
            size="mini"
            style="text-align: center;margin-top: 10px;margin-bottom: -23px"
            type="success"
            @click="packing_list"
          >
            提交出库
          </el-button>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrderOut',
  data() {
    return {
      textarea: '', // 文本框输入的内容
      order_barcode: ''// 条码
    }
  },
  methods: {
    check_id() { // 扫码回车事件
      var that = this
      // this.$message.success('扫描成功')
      this.$http.post('order_out_one/', { order: this.order_barcode }).then(function (res) {
        if (res.data === 404) {
          that.$message.error('扫描条码不存在,无法识别')
          that.order_barcode = ''
        } else if (res.data === 403) {
          that.$message.error('订单出库已经完成,不用重复扫描')
          that.order_barcode = ''
        } else { // 表示本次扫描成功了
          that.$message.success('出库完成!')
          that.order_barcode = ''
        }
      })
    },
    packing_list() { // 批量提交出库
      var that = this
      if (this.textarea === '') {
        that.$message.error('提交内容为空')
      } else {
        this.$http.post('packing_pl/', { data: this.textarea }).then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('批量订单出库提交成功')
            that.textarea = ''
          } else if (res.data !== 'OK') {
            that.$notify.error({
              title: '单号不存在',
              message: '单号不存在' + res.data,
              offset: 150
            })
          } else {
            that.$message.error('提交失败')
            that.textarea = ''
          }
        })
      }
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

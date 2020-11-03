<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/2-1' }">
        订单列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>修改订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      style="margin-top: 15px">
      <el-row :gutter="58" style="margin-top: -10px">
        <el-col class="el-row" :span="1">
          <el-button
            size="small" @click="close_order">
            关闭
          </el-button>
        </el-col>
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="preview_order">
            预览
          </el-button>
        </el-col>
      </el-row>
      <el-form
        :model="addForm"
        :inline="true" label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="业务单号">
            <el-input v-model="addForm.id"
              style="width:110px" disabled/>
          </el-form-item>
          <el-form-item label="地区" prop="add">
            <el-input v-model="addForm.add" style="width:110px" disabled/>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="addForm.date"
              style="width: 140px" disabled
              type="date"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="业务员" prop="name">
            <el-input
              v-model="addForm.saleman" disabled
              style="width: 100px"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.note" style="width: 150px" disabled/>
          </el-form-item>
        </div>
      </el-form>
      <!-- 订单列表区域 -->
      <el-table
        ref="refs"
        v-loading="loading" size="mini"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :row-class-name="tableRowClassName"
        :data="order_li"  :max-height="530"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '10px'}"
        :cell-style="{'padding':'0px','height':'10px','margin':'0px'}"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
        @row-click="onRowClick">
        <el-table-column type="index" />
        <el-table-column v-if="show" label="id" width="140px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.id" size="small"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180px" >
          <template slot-scope="scope" >
            <el-tag size="mini" effect="dark" type="success" v-if="scope.row.state === '审核'">{{scope.row.draw_status}}</el-tag>
            <el-tag size="mini" effect="dark" type="success" v-if="scope.row.state === '审核'">{{scope.row.print_status}}</el-tag>
            <el-tag size="mini" effect="dark" type="success" v-if="scope.row.state === '审核'">{{scope.row.chuku_status}}</el-tag>
            <el-tag size="mini" effect="dark" type="warning" v-if="scope.row.state === '关闭'">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流水" width="70px" prop="id" />
        <el-table-column label="类型" width="100px" prop="order_type" />
        <el-table-column label="级别" width="100px" prop="order_level"/>
        <el-table-column label="ERP单号" width="140px" prop="order_code" />
        <el-table-column label="SKU编码" width="140px" prop="item_code" />
        <el-table-column label="产品名称" width="150px" prop="item_name" />
        <el-table-column label="名字" width="150px" prop="order_name" />
        <el-table-column label="单位" width="70px" prop="unit" />
        <el-table-column label="分类" width="90px" prop="skutype" />
        <el-table-column label="订单数" prop="num"/>
        <el-table-column label="合数" prop="total_num"/>
        <el-table-column label="金额" prop="amount" />
        <el-table-column label="颜色" width="100px"prop="color"/>
        <el-table-column label="字体" width="100px" prop="words" />
        <el-table-column label="物流" width="130px" prop="wuliu" />
        <el-table-column label="包装方式" width="120px" prop="pack_method" />
        <el-table-column label="链长" prop="size" />
        <el-table-column label="客户备注" width="150px" prop="note" />
        <el-table-column label="交货日期" width="150px" prop="end_date" />
        <el-table-column label="操作" width="130px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item" effect="dark" content="订单关闭,或者退款"
              placement="top-start" enterable="false">
              <el-button type="warning" icon="el-icon-close" circle
                         size="mini" @click="close_order_del(scope.row.id,scope.row.chuku_status)"/>
            </el-tooltip>
            <el-tooltip
              class="item" effect="dark" content="产品图片"
              placement="top-start" enterable="false">
            <el-button
              v-if="scope.row.picture !== ''"
              type="primary"
              icon="el-icon-picture-outline" circle size="mini"
              @click="showEditDialog(scope.row.item_code,scope.row.item_name,scope.row.picture)"/>
            <el-button
              v-else disabled
              type="primary"
              icon="el-icon-picture-outline" circle size="mini"/>
            </el-tooltip>
            <el-tooltip
              class="item" effect="dark" content="上传订单图片"
              placement="top-start" enterable="false">
            <el-button
              v-if="scope.row.item_code !== ''"
              type="primary"
              icon="el-icon-upload2" circle size="mini"
              @click="showEditDialog2(scope.row.item_code,scope.row.item_name,scope.row.row_index,scope.row.order_img)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--图片区域 -->
    <el-dialog
      title="产品图片"
      :visible.sync="addVisible2"
      width="40%"
    >
      <span>
        <el-form
          :model="sku_img"
          label-width="100px"
        >
          <el-form-item>
            <el-image
              style="width: 350px; height: 300px;margin-left: -100px"
              :src="sku_img.imgurl"
              :fit="fit"
            />
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="编号">
                <el-input
                  v-model="sku_img.item_code"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称">
                <el-input
                  v-model="sku_img.item_name"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
    </el-dialog>
    <el-dialog
      title="订单图片"
      :visible.sync="addVisible3"
      width="40%"
    >
      <span>
        <el-form
          :model="order_img"
          label-width="100px"
        >
          <el-form-item>
            <span>
              <el-upload
                style="margin-top: 10px"
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="upload_img"
              >
                <img
                  v-if="order_img.imgurl"
                  :src="order_img.imgurl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </span>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="编号">
                <el-input
                  v-model="order_img.item_code"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称">
                <el-input
                  v-model="order_img.item_name"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'order_see',
  data() {
    return {
      addVisible2: false, // 弹窗
      addVisible3: false, // 订单图片窗口
      order_num: '', // 本页订单号
      loading: true,
      currentRowIndex: '', // 记录当前表格现在的行
      // ahttp: 'http://127.0.0.1:8000/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      ahttp_order: 'http://47.114.190.252:8888/img_order?md5=', // 服务器地址
      order_li: [
        {
          id: '', // 自增长字段
          order_type: '', // 订单类型
          order_level: '', // 生产级别
          order_code: '',
          item_code: '',
          item_name: '',
          order_name: '',
          unit: '',
          picture: '', // 产品图片
          skutype: '',
          color: '',
          words: '',
          num: '',
          wuliu: '',
          pack_method: '',
          note: '',
          total_num: '',
          amount: 0, // 订单金额
          size: '',
          create_date: '',
          end_date: '',
          order_img: ''// 订单图片
        }
      ],
      sku_img: {
        item_code: '',
        item_name: '',
        imgurl: ''
      },
      order_img: {
        item_code: '',
        item_name: '',
        imgurl: ''
      },
      addForm: {
        id: '',
        add: '',
        date: '',
        saleman: '',
        note: '',
        create_user: ''// 创建人
      }
    }
  },
  created() {
    // this.sku_list()
    this.addForm.create_user = window.sessionStorage.getItem('token')
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
    showEditDialog(code, name, pic) {
      var that = this
      this.addVisible2 = true
      that.sku_img.item_code = code
      that.sku_img.item_name = name
      that.sku_img.imgurl = that.ahttp + pic
    },
    showEditDialog2(code, name, index, img) { // 添加订单图片
      var that = this
      that.addVisible3 = true
      that.order_img.item_code = code
      that.order_img.item_name = name
      that.order_img.imgurl = that.ahttp_order + img
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
    preview_order() { //订单预览界面
      this.$message.info('只会显示保存的内容')
      this.$router.push({ path: '/2-1-4', query: { order: this.order_num } })// 打开预览报表
    },
    close_order_del(id, chuku_status) { // 关闭订单明细
      var that = this
      if (chuku_status === '已出库') {
        that.$message.warning('订单已出库,无法关闭')
      } else {
        this.$confirm('确认关闭本条订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function (res) {
            if (res === 'confirm') {
              that.$http.post('order_del_close/', { id: id }).then(function (res) {
                if (res.data === 'OK') {
                  // 执行删除成功时
                  that.$message.success('订单行已关闭')
                  that.order_list() // 刷新列表
                } else {
                  that.$message.error('关闭失败')
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
    upload_img(file) { // 图片上传
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
            that.order_img.imgurl = that.ahttp + res.data
            that.order_li[that.currentRowIndex].order_img = res.data
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
        })
    },
    page_get() { // 页面初始化
      var that = this
      that.order_num = that.$route.query.order
      this.$http.post('page_get/', { order: that.order_num })
        .then(function (res) {
          console.log(res.data)
          that.addForm = res.data.tou
          that.order_li = res.data.shen
          that.loading = false
        })
    }
  }
}
</script>
<style scoped>
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}
</style>

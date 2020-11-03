<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/2-8' }">
        批次列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>批次详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      style="margin-top: 15px"
      @keydown.enter="add_order_list">
      <el-row :gutter="58" style="margin-top: -10px">
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="close_order">关闭</el-button>
        </el-col>
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="printer"type="primary" plain>打印</el-button>
        </el-col>
        <el-col class="el-row" :span="2">
          <el-button size="small" @click="pi_pictor"type="primary" plain>图片模式</el-button>
        </el-col>
      </el-row>
      <el-divider />
      <el-form
        ref="Formref"
        :model="addForm"
        :inline="true"
        :rules="formrules" label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="批次号">
            <el-input v-model="addForm.id" style="width:110px" disabled/>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker disabled="true" style="width: 130px"
              v-model="addForm.create_time" type="date"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="创建账号" prop="name">
            <el-input v-model="addForm.create_user" disabled style="width: 100px"/>
          </el-form-item>
        </div>
      </el-form>
      <!-- 订单列表区域 -->
      <div>
      <el-table
        ref="refs"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :row-class-name="tableRowClassName"
        :data="order_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '10px'}"
        :cell-style="{'padding':'0px','height':'10px','margin':'0px'}"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
        @row-click="onRowClick"
      >
        <el-table-column type="index" />
        <el-table-column v-if="show" label="id" width="140px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.id" size="small"/>
          </template>
        </el-table-column>
        <el-table-column label="业务单号" prop="order_key" />
        <el-table-column label="类型" prop="order_type" width="70px" />
        <el-table-column label="级别" width="60px" prop="order_level" />
        <el-table-column label="ERP单号" width="100px" prop="order_code" />
        <el-table-column label="SKU编码" width="80px" prop="item_code" />
        <el-table-column label="产品名称" width="150px" prop="item_name" />
        <el-table-column label="名字" width="100px" prop="order_name" />
        <el-table-column label="单位" width="60px" prop="unit" />
        <el-table-column label="分类" width="80px" prop="skutype" />
        <el-table-column label="订单数" prop="num" />
        <el-table-column label="合数" prop="total_num" />
        <el-table-column label="金额" prop="amount" />
        <el-table-column label="颜色" width="80px" prop="color" />
        <el-table-column label="字体" width="80px" prop="words" />
        <el-table-column label="物流" width="100px" prop="wuliu" />
        <el-table-column label="包装方式" width="120px" prop="pack_method" />
        <el-table-column label="尺寸" prop="size" />
        <el-table-column label="客户备注" width="150px" prop="note"/>
        <el-table-column label="交货日期" width="150px" prop="end_date"/>
        <el-table-column label="操作" width="90px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.picture !== ''"
              type="primary" circle size="mini"
              icon="el-icon-picture-outline"
              @click="showEditDialog(scope.row.item_code,scope.row.item_name,scope.row.picture)"/>
            <el-button
              v-else disabled type="primary"
              icon="el-icon-picture-outline"
              circle
              size="mini"/>
            <el-button
              v-if="scope.row.item_code !== ''"
              type="primary"
              icon="el-icon-upload2"
              circle
              size="mini"
              @click="showEditDialog2(scope.row.item_code,scope.row.item_name,scope.row.row_index,scope.row.order_img)"/>
          </template>
        </el-table-column>
      </el-table>
      </div>
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
    <el-dialog title="订单图片" :visible.sync="addVisible3" width="40%">
      <span><el-form :model="order_img" label-width="100px">
          <el-form-item>
            <span>
              <el-upload
                style="margin-top: 10px" class="avatar-uploader" :show-file-list="false" :http-request="upload_img">
                <img v-if="order_img.imgurl" :src="order_img.imgurl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
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
    <div id="printTest" style="display: none">
      <div>
        <table border="1" cellspacing="0" cellpadding="0" style="text-align: center;table-layout: fixed;border-collapse: collapse;font-size: 12pt">
          <thead>
          <tr>
            <th colspan="13">画图批次:{{addForm.id}}-业务员:{{addForm.create_user}}</th>
            <th colspan="1">总:{{addForm.total_num}}</th>
            <th colspan="1"><span tdata='pageNO'>##</span>/<span tdata='pageCount'>##</span></th>
          </tr>
          <tr>
            <th wid>业务单号</th>
            <th width="65px">ERP单号</th>
            <th width="80px">订单日期</th>
            <th>链长</th>
            <th>包装</th>
            <th>产品图片</th>
            <th width="80px">产品编码</th>
            <th width="80px">产品名称</th>
            <th>名字</th>
            <th>订单图片</th>
            <th>颜色</th>
            <th>字体</th>
            <th>备注</th>
            <th>数量</th>
            <th>合数</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in order_li" :key="item.id">
            <td><p style="margin-bottom: 0px">{{item.order_key}}</p> <p style="margin-top: 0px;margin-bottom: 0px">{{item.salesman}}</p> {{item.order_level }}</td>
            <td>{{item.order_code}}</td>
            <td>{{item.date}}</td>
            <td>{{item.size}}</td>
            <td>{{item.pack_method}}</td>
            <td>
              <img :src="ahttp+item.picture"  style="width: 120px; height: 100px;" v-if="item.picture"/>
            </td>
            <td>{{item.item_code}}</td>
            <td>{{item.item_name}}</td>
            <td>{{item.order_name}}</td>
            <td>
              <img :src="ahttp_order+item.order_img"  style="width: 120px; height: 100px;" v-if="order_img"/>
            </td>
            <td>{{item.color}}</td>
            <td>{{item.words}}</td>
            <td>{{item.note}}</td>
            <td>{{item.num}}</td>
            <td>{{item.total_num}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getLodop } from '@/assets/LodopFuncs'

export default {
  name: 'OrderUpdate',
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
      delete_li: [], // 删除的集合
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
    this.get_data()
    this.addForm.create_user = window.sessionStorage.getItem('token')
    this.page_get()
  },
  methods: {
    rowstyle({row,column,rowIndex,columnIndex}) {
      if(row.state === '关闭'){
        return `padding:-10px;background:#e6a23c;height:5px`
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
    },
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
      that.order_img.imgurl = that.ahttp + img
    },
    handleSelect(item) {
      console.log(item)
      console.log(this.currentRowIndex)
      this.order_li[this.currentRowIndex].item_code = item.id
      this.order_li[this.currentRowIndex].item_name = item.name
      this.order_li[this.currentRowIndex].unit = item.unit
      this.order_li[this.currentRowIndex].skutype = item.type
    },
    pi_pictor() { // 打开图片模式
      this.$router.push({ path: '/2-8-2', query: { order: this.order_num } })// 调整订单新增页面
    },
    printer() {
      var LODOP = getLodop()
      LODOP.PRINT_INITA(10, 10, 754, 453, '画图批次打印')
      LODOP.SET_PRINT_PAGESIZE(0, 2100, 2970, "")
      //LODOP.SET_PRINT_MODE("DOUBLE_SIDED_PRINT",1);  //双面打印,针对无双面打印的打印机
      //LODOP.SET_PRINT_MODE("PRINT_DUPLEX",0)   //自动双面打印
      //LODOP.SET_PRINT_MODE("PRINT_DEFAULTSOURCE",1);
      LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE",1);  //自定义纸张
      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",1);  //打印后自动关闭
      //ODOP.ADD_PRINT_HTM(1,900,300,100,"总页号：<font color='#0000ff' format='ChineseNum'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
      LODOP.SET_PRINT_STYLE("ItemType",2);
      LODOP.SET_PRINT_STYLE("ItemType",3);
      LODOP.SET_PRINT_STYLE("ItemType",4);
      LODOP.SET_PRINT_STYLEA(0,"TableHeightScope",2);//高度包含页尾
      //LODOP.SET_PRINT_STYLEA(0,"AngleOfPageInside",270);//高度包含页尾
      LODOP.ADD_PRINT_TABLE(0, 0, '98%', '100%', document.getElementById("printTest").innerHTML)
      //LODOP.ADD_PRINT_TABLE(0,0,'100%','100%', 'URL:http://localhost:8081/#/2-8-1')
      LODOP.PREVIEW()
      this.$http.post('draw_print/',{id:this.addForm.id}).then(function (res) {

      })
    },
    get_data() {
      var aData = new Date()
      this.addForm.date = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate()
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
      this.$http.post('draw_page_get/', { order: that.order_num })
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
th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
}
</style>

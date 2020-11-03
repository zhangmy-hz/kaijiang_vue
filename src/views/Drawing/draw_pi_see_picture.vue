<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/2-8' }">
        批次列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>批次图片</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="58" style="margin-top: -10px">
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="close_order">关闭</el-button>
        </el-col>
        <el-col class="el-row" :span="1">
          <el-button size="small" @click="excel_out">导出</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="order_li"
        :border="true" size="mini"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px','white-space':pre-line}"
        :stripe="true"
        :highlight-current-row="true"
      >
        <el-table-column type="index" label="#" width="60px"/>
        <el-table-column
          :label="'业务单号 \n 业务员 \n 日期'"
          width="130px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.order_key+'\n'+scope.row.salesman+'\n'+scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="'订单号 \n 交货日期 \n 合数'"
          prop="id"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.order_code+'\n'+scope.row.end_date+'\n'+scope.row.total_num }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'生产级别 \n 产品编号 \n 产品名称'">
          <template slot-scope="scope">
            <span>{{ scope.row.order_level+'\n'+scope.row.item_code +'\n'+scope.row.item_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="'颜色\n字体\n名字'"
          prop="add"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.color+'\n'+scope.row.words +'\n' }}<b style="font-size: 14pt">{{scope.row.order_name +'\n'}}</b></span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户备注"
          prop="note"
        />
        <el-table-column label="产品图片" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="scope.row.item_name"> <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp+scope.row.picture" target="_blank" title="查看最大化图片">
                <img :src="ahttp+scope.row.picture" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp+scope.row.picture" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="订单图片" prop="create_time" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="'颜色:'+scope.row.color+'; 字体:'+scope.row.words+'; 名字:'+scope.row.order_name"> <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp_order+scope.row.order_img" target="_blank" title="查看最大化图片">
                <img :src="ahttp_order+scope.row.order_img" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp_order+scope.row.order_img" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="画图上传" prop="examine" width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.draw_img">
              <el-image
                style="width: 200px; height: 160px;"
                :src="ahttp+scope.row.draw_img"
                :lazy="true"
                :fit="fit"
              />
            </span>
            <span v-else>
              <el-button
                type="success"
                size="mini"
                @click="showEditDialog2(scope.row)"
              >上传画图</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="画图上传"
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
              <el-form-item label="SKU名称">
                <el-input
                  v-model="order_img.item_name"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单名称">
                <el-input
                  v-model="order_img.order_name"
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
import table2excel from 'js-table2excel'
export default {
  name: 'Drawing',
  data() {
    return {
      // ahttp: 'http://127.0.0.1:8888/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      ahttp_order: 'http://47.114.190.252:8888/img_order?md5=', // 服务器地址
      input: '',
      user: '', // 记录当前用户
      addVisible3: false, // 控制添加是否显示
      order_li: [],
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      pi_code: '', // 批次号码
      order_img: {
        order_name: '',
        item_name: '',
        id: '', // 明细表主键ID
        imgurl: ''
      }
    }
  },
  created() {
    this.pi_code = this.$route.query.order // 获得前端传过来的批次号
    this.order_list()
    this.user = window.sessionStorage.getItem('token')
  },
  methods: {
    excel_out() {//导出表格
      const column = [
        {
          title: '批次号',
          key: 'pi_code',
          type: 'text'
        },
        {
          title: '业务单号',
          key: 'order_key',
          type: 'text'
        },
        {
          title: '日期',
          key: 'date',
          type: 'text'
        },
        {
          title: '业务员',
          key: 'salesman',
          type: 'text'
        },
        {
          title: '生产级别',
          key: 'order_level',
          type: 'text'
        },
        {
          title: '订单号',
          key: 'order_code',
          type: 'text'
        },
        {
          title: '订单交期',
          key: 'end_date',
          type: 'text'
        },
        {
          title: '产品图片',
          key: 'picture',
          type: 'image',
          width: 160,
          height: 100
        },
        {
          title: '产品分类',
          key: 'order_type',
          type: 'text'
        },
        {
          title: '产品编号',
          key: 'item_code',
          type: 'text'
        },
        {
          title: '产品名称',
          key: 'item_name',
          type: 'text'
        },
        {
          title: '名字',
          key: 'order_name',
          type: 'text'
        },
        {
          title: '名字图片',
          key: 'order_img',
          type: 'image',
          width: 160,
          height: 100
        },
        {
          title: '颜色',
          key: 'color',
          type: 'text'
        },
        {
          title: '字体',
          key: 'words',
          type: 'text'
        },
        {
          title: '备注',
          key: 'note',
          type: 'text'
        },
        {
          title: '订单数',
          key: 'num',
          type: 'text'
        },
        {
          title: '合数',
          key: 'total_num',
          type: 'text'
        },

      ]

      var data_li = this.order_li
      var j = data_li.length
      var i = 0
      for (i=0;i<j;i++) {
        data_li[i].picture = this.ahttp + data_li[i].picture
        data_li[i].order_img = this.ahttp_order + data_li[i].order_img
      }
      //console.log(data_li)
      data_li.sort()  //排序
      const excelName = '画图批次导出'
      table2excel(column, data_li, excelName)
      this.order_list()   //导出完成重新刷新
    },
    order_list() {
      var that = this
      this.$http
        .post('order_del_picture/', {
          serch: this.pi_code
        })
        .then(function(res) {
          // console.log(res)
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
    },
    showEditDialog2(row_detial) { // 添加订单图片
      console.log(row_detial)
      var that = this
      that.order_img.order_name = row_detial.order_name
      that.order_img.item_name = row_detial.item_name
      that.order_img.id = row_detial.id
      that.addVisible3 = true
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
            that.order_img.imgurl = res.data
            that.$http.post('draw_save/', { data: that.order_img })
              .then(function(res) {
                if (res.status === 200) {
                  that.addVisible3 = false
                  that.order_list()// 重新加载
                }
              })
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
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
    handleSelect(item) {
      this.selectForm.salesman_code = item.name
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
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}
</style>

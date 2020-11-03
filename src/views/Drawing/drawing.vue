<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>画图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="80px"
        size="mini"
      >
        <div style="width:100%">
          <el-form-item label="平台单号">
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
          <el-form-item label="业务员">
            <el-autocomplete
              v-model="selectForm.salesman"
              size="small"
              class="el-input"
              :fetch-suggestions="querySearchAsync_name"
              placeholder="选择业务员"
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item label="画图状态">
            <el-select
              v-model="selectForm.draw_status"
              placeholder="选择状态"
              style="width: 100px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订单级别">
            <el-select
              v-model="selectForm.order_level"
              style="width: 100px"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="颜色">
            <el-autocomplete
              v-model="selectForm.color"
              class="el-input"
              :fetch-suggestions="querySearchAsync_color"
              placeholder="点击选择"
            />
          </el-form-item>
          <el-form-item label="字体">
            <el-autocomplete
              v-model="selectForm.words"
              class="el-input"
              :fetch-suggestions="querySearchAsync_words"
              placeholder="点击选择"
            />
          </el-form-item>
          <el-form-item
            label="分类"
            prop="type"
          >
            <el-autocomplete
              v-model="selectForm.type"
              class="el-input"
              :fetch-suggestions="querySearchAsync_type"
              placeholder="选择分类"
            />
          </el-form-item>
          <el-form-item label="名字">
            <el-input
              v-model="selectForm.order_name"
              style="width:110px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="order_list"
              @keyup.enter="order_list"
            >
              查询
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 用户列表区域 -->
      <el-table
        :data="order_li"
        :border="true"
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
          :label="'订单号 \n 订单日期 \n 交货日期'"
          prop="id"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.order_code+'\n'+scope.row.create_date+'\n'+scope.row.end_date }}</span>
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
            <span>{{ scope.row.color+'\n'+scope.row.words +'\n'+scope.row.order_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户备注"
          prop="note"
        />
        <el-table-column
          label="产品图片"
          width="200px"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.picture"
              style="width: 200px; height: 160px;"
              :src="ahttp+scope.row.picture"
              :lazy="true"
              :fit="fit"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="订单图片"
          prop="create_time"
          width="180px"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.order_img"
              style="width: 200px; height: 160px;"
              :src="ahttp_order+scope.row.order_img"
              :lazy="true"
              :fit="fit"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="画图上传"
          prop="examine"
        >
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
        <el-table-column
          label="画图状态"
          prop="draw_status"
          width="100px"
        />
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
      selectForm: {
        // 查询集合
        date: '',
        order_code: '', // 订单号
        draw_status: '', // 画图状态
        order_level: '', // 订单级别
        color: '', // 颜色
        words: '', //
        type: '',
        order_name: '',
        salesman: '', // 业务员名称
        salesman_code: ''// 业务员编码
      },
      order_img: {
        order_name: '',
        item_name: '',
        id: '', // 明细表主键ID
        imgurl: ''
      },
      options: [
        {
          value: '',
          label: ''
        },
        {
          value: '未画图',
          label: '未画图'
        },
        {
          value: '已画图',
          label: '已画图'
        }
      ],
      options1: [
        {
          value: '',
          label: ''
        },
        {
          value: '正常',
          label: '正常'
        },
        {
          value: '加急',
          label: '加急'
        }
      ]
    }
  },
  created() {
    this.order_list()
    this.user = window.sessionStorage.getItem('token')
  },
  methods: {
    order_list() {
      var that = this
      this.$http
        .post('order_del/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.selectForm
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
    querySearchAsync_name(queryString, cb) {
      this.$http.post('saleman/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].nameid
        }
        cb(data)
      })
    },
    handleSelect(item) {
      this.selectForm.salesman_code = item.name
    },
    querySearchAsync_words(queryString, cb) {
      this.$http
        .post('wenzi_order_select/', { serch: queryString })
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].name
          }
          cb(data)
        })
    },
    querySearchAsync_type(queryString, cb) {
      this.$http
        .post('type_select/', { type: queryString })
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].value = data[i].type
          }
          cb(data)
        })
    },
    querySearchAsync_color(queryString, cb) {
      this.$http.post('color/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].color_name
        }
        cb(data)
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

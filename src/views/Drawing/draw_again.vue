<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>拉图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-form :model="selectForm" :inline="true" label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="ERP单号">
            <el-input v-model="selectForm.order_code" style="width:110px" clearable/>
          </el-form-item>
          <el-form-item label="订单日期">
            <el-date-picker v-model="selectForm.date" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="业务员">
            <el-autocomplete v-model="selectForm.salesman" size="small" clearable
                             class="el-input" :fetch-suggestions="querySearchAsync_name"
                             placeholder="选择业务员" @select="handleSelect"/>
          </el-form-item>
          <el-form-item label="画图人">
            <el-autocomplete v-model="selectForm.draw_user" size="small" clearable
                             class="el-input" :fetch-suggestions="querySearchAsync_name"
                             placeholder="画图人" />
          </el-form-item>
          <el-form-item label="订单级别">
            <el-select v-model="selectForm.order_level" style="width: 100px">
              <el-option
                v-for="item in options1"
                :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色">
            <el-autocomplete
              v-model="selectForm.color" clearable
              class="el-input"
              :fetch-suggestions="querySearchAsync_color" placeholder="点击选择"/>
          </el-form-item>
          <el-form-item label="字体">
            <el-autocomplete
              v-model="selectForm.words" clearable
              class="el-input"
              :fetch-suggestions="querySearchAsync_words" placeholder="点击选择"/>
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <el-autocomplete
              v-model="selectForm.type" clearable
              class="el-input"
              :fetch-suggestions="querySearchAsync_type"
              placeholder="选择分类"/>
          </el-form-item>
          <el-form-item label="名字">
            <el-input clearable
              v-model="selectForm.order_name"
              style="width:110px"/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary" @click="order_list" @keyup.enter="order_list">
              查询
            </el-button>
            <el-button type="primary" @click="draw_pi">
              拉图完成
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 用户列表区域 -->
      <el-table id="stReport"
                :data="order_li"
                :border="true"
                :header-row-style="{'height': '20px'}"
                :row-style="{'height': '20px'}"
                :cell-style="{'padding':'7px','white-space':pre-line}"
                :stripe="true"     @selection-change="handleSelectionChange">
        :highlight-current-row="true">
        <el-table-column type="selection" width="60px" />
        <el-table-column :label="'业务单号 \n 业务员 '" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.order_key+'\n' + scope.row.salesman}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'画图批次\n 画图人'" prop="pi_code" width="130px">
          <template slot-scope="scope">
            <span>{{scope.row.pi_code+'\n'+scope.row.draw_user}}</span>
          </template>
        </el-table-column>
        <el-table-column label="ERP单号" prop="order_code" />
        <el-table-column :label="'订单日期 \n 画图日期'" >
          <template slot-scope="scope">
          <span>{{scope.row.date+'\n'+scope.row.draw_time}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'生产级别 \n 类别'">
        <template slot-scope="scope">
          <span>{{scope.row.order_level+'\n'+scope.row.order_type}}</span>
        </template>
        </el-table-column>
        <el-table-column label="产品编号" prop="item_code" />
        <el-table-column :label="'产品名称\n产品分类 '">
          <template slot-scope="scope">
            <span>{{scope.row.item_name+'\n'+scope.row.skutype}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品图片" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="scope.row.item_name" v-if="scope.row.picture"> <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp+scope.row.picture" target="_blank" title="查看最大化图片">
                <img :src="ahttp+scope.row.picture" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp+scope.row.picture" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>>
        </el-table-column>
        <el-table-column :label="'颜色 \n 字体'">
          <template slot-scope="scope">
            <span>{{scope.row.color+'\n'+scope.row.words}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名字" prop="order_name" />
        <el-table-column label="客户备注" prop="note"/>
        <el-table-column label="订单图片" prop="create_time" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="'颜色:'+scope.row.color+'; 字体:'+scope.row.words+'; 名字:'+scope.row.order_name"
                        v-if="scope.row.order_img"> <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp_order+scope.row.order_img" target="_blank" title="查看最大化图片">
                <img :src="ahttp_order+scope.row.order_img" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp_order+scope.row.order_img" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>
        </el-table-column>
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
import { getLodop } from '../../assets/LodopFuncs'
export default {
  name: 'draw_again',
  data() {
    return {
      // ahttp: 'http://127.0.0.1:8888/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      ahttp_order: 'http://47.114.190.252:8888/img_order?md5=', // 服务器地址
      input: '',
      picture_status: true,
      role_tree_list: [],
      user: '', // 记录当前用户
      addVisible3: false, // 控制添加是否显示
      order_li: [],
      currentPage: 1, // 当前页
      pagesize: 10, // 默认每页显示行数
      total: 0, // 总计数量
      pi_list: [], // 选中的要生成批次的行
      selectForm: {
        // 查询集合
        date: '',
        order_code: '', // 订单号
        order_level: '', // 订单级别
        color: '', // 颜色
        words: '', //
        type: '',
        order_name: '',
        salesman: '', // 业务员名称
        draw_user:'',
        salesman_code: ''// 业务员编码
      },
      order_img: {
        order_name: '',
        item_name: '',
        id: '', // 明细表主键ID
        imgurl: ''
      },
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
    this.user = window.sessionStorage.getItem('token')
    this.order_list()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
  },
  methods: {
    order_list() {
      var that = this
      this.$http
        .post('draw_again_del/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.selectForm,
          user: this.user
        })
        .then(function(res) {
          // console.log(res)
          that.total = res.data.total
          that.order_li = res.data.user_list
        })
    },
    handleSelectionChange(val) { // 表格选中的行
      this.pi_list = val // 选中的批次列表
    },
    status_change(status) { // 是否显示订单图片
      this.picture_status = !status
    },
    draw_pi() { // 跳转画图批次
      var that = this
      if (this.pi_list.length === 0) {
        that.$message.warning('需要先选中明细行')
      } else {
        this.$confirm('选中的内容全部拉图完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function (res) {
          if (res === 'confirm') {
            that.$http.post('draw_agin_end/', { data: that.pi_list })
              .then(function (res) {
                if (res.data === 'OK') { // 执行删除成功时
                  that.$message.success('拉图完成')
                  that.order_list()// 刷新列表
                } else {
                  that.$message.error('拉图失败,请联系系统管理员')
                }
              })
          }
        }).catch(function (res) {
          console.log('删除失败')
          return res
        })
      }
    },
    print() {
      var LODOP = getLodop()
      LODOP.PRINT_INITA(10, 10, 754, 453, '学生统计结果')
      LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', '')
      LODOP.ADD_PRINT_URL('1mm', '2mm', 'RightMargin:1mm', 'BottomMargin:2mm', 'http://localhost:8081/#/2-1')
      LODOP.PREVIEW()
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

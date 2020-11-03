<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item >
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>待画图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-form :model="selectForm" :inline="true" label-width="80px" size="mini">
        <div style="width:100%">
          <el-form-item label="平台单号">
            <el-input v-model="selectForm.order_code" style="width:110px"/>
          </el-form-item>
          <el-form-item label="订单日期">
            <el-date-picker v-model="selectForm.date" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="业务员">
            <el-autocomplete v-model="selectForm.salesman" size="small"
              class="el-input" :fetch-suggestions="querySearchAsync_name"
              placeholder="选择业务员" @select="handleSelect"/>
          </el-form-item>
          <el-form-item label="订单级别">
            <el-select v-model="selectForm.order_level" style="width: 100px">
              <el-option
                v-for="item in options1"
                :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary" @click="order_list" @keyup.enter="order_list">
              查询
            </el-button>
            <el-button v-if="role_tree_list.indexOf('2-6-2') !== -1"
              type="primary" @click="draw_pi">
              生成画图批次
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 用户列表区域 -->
      <div id="table1">
      <el-table id="stReport"
        :data="order_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px'}"
        :stripe="true"     @selection-change="handleSelectionChange">
        :highlight-current-row="true">
        <el-table-column type="selection" width="60px" />
        <el-table-column type="index" width="60px" label="#"/>
        <el-table-column label="业务单号" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="add" width="80px"/>
        <el-table-column label="生产级别" prop="order_level" width="80px"/>
        <el-table-column label="合计" prop="total_num" width="60px"/>
        <el-table-column label="业务员" prop="salesman" width="100px"/>
        <el-table-column label="制单日期" prop="create_time" width="155px"/>
        <el-table-column label="审核人" prop="examine" width="80px"/>
        <el-table-column label="审核时间" prop="examine_time" width="155px"/>
        <el-table-column label="修改人" prop="update_user" width="80px"/>
        <el-table-column label="修改时间" prop="update_time" width="155px"/>
        <el-table-column label="画图批次" prop="pi_code" width="155px"/>
        <el-table-column label="备注" prop="note" />
      </el-table>
      </div>
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
      <div id="printTest" style="display: none">
        <div>
          <table border="1" cellspacing="0" cellpadding="0" style="text-align: center">
            <thead>
            <tr>
              <caption align="top" style="font-size: 16px;padding-bottom:10px;font-weight:800;font-family:宋体; text-align:center">
                <div>画图批次:{{pi_num}}-业务员:{{user}}</div>
              </caption>
            </tr>
            <th>业务单号</th>
            <th>ERP单号</th>
            <th>订单日期</th>
            <th>产品编码</th>
            <th>产品名称</th>
            <th>数量</th>
            <th width="500">名字</th>
            <th>字体</th>
            <th>颜色</th>
            <th>链长</th>
            <th>包装</th>
            <th>客户备注</th>
            <th>产品图片</th>
            <th>订单图片</th>
            </thead>
            <tbody>
            <tr v-for="item in order_li" :key="item.id">
              <td>{{item.order_key}}</td>
              <td>{{item.order_code}}</td>
              <td width="200">{{item.date}}</td>
              <td>{{item.item_code}}</td>
              <td width="650">{{item.item_name}}</td>
              <td>{{item.num}}</td>
              <td width="400">{{item.order_name}}</td>
              <td>{{item.words}}</td>
              <td>{{item.color}}</td>
              <td>{{item.size}}</td>
              <td>{{item.pack_method}}</td>
              <td>{{item.note}}</td>
              <td>
                <img :src="ahttp+item.picture"  style="width: 120px; height: 100px;"/>
              </td>
              <td>
                <img :src="ahttp_order+item.order_img"  style="width: 120px; height: 100px;"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLodop } from '../../assets/LodopFuncs'
export default {
  name: 'Drawing',
  data() {
    return {
      // ahttp: 'http://127.0.0.1:8888/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      ahttp_order: 'http://47.114.190.252:8888/img_order?md5=', // 服务器地址
      input: '',
      fit: 'contain',
      picture_status: false,
      role_tree_list: [],
      user: '', // 记录当前用户
      user_name: '', //用户名称
      addVisible3: false, // 控制添加是否显示
      order_li: [],
      currentPage: 1, // 当前页
      pagesize: 20, // 默认每页显示行数
      total: 0, // 总计数量
      pi_list: [], // 选中的要生成批次的行
      pi_list_copy: [], // 选中的要生成批次的行
      pi_num: '未生成',//选中后生成的批次号码
      selectForm: {
        // 查询集合
        date: '',
        order_code: '', // 订单号
        order_level: '', // 订单级别
        salesman: '', // 业务员名称
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
      ],
    }
  },
  created() {
    this.user = window.sessionStorage.getItem('token')
    this.user_name = window.sessionStorage.getItem('user_name')  //用户名
    this.order_list()
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
  },
  methods: {
    order_list() {
      var that = this
      this.$http
        .post('order_del_draw/', {
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
      console.log(val)
      this.pi_list = val // 选中的批次列表
      console.log(this.pi_list)
    },
    draw_pi() { // 跳转画图批次
      var that = this
      if (this.pi_list.length === 0) {
        that.$message.warning('需要先选中明细行')
      } else {
        this.$confirm('将选中内容统一生成批次,系统自动转发画图人员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function (res) {
          if (res === 'confirm') {
            that.$http.post('create_pi/', { data: that.pi_list, user: that.user,user_name:that.user_name })
              .then(function (res) {
                if (res.data === 'OK') { // 批次生成完成,并返回最新的批次号码
                  that.pi_num = res.data.pi_order //获取批次号码
                  //that.pi_list_copy = res.data.pi_list //获取批次号码
                  that.pi_list = []  //清空行

                  that.$message.success('画图批次已生成')
                  that.order_list()// 刷新列表
                } else {
                  that.$message.error('业务单号:'+res.data+'已经存在画图批次')
                }
              })
          }
        }).catch(function (res) {
          console.log('生成失败')
          return res
        })
      }
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
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>画图批次</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 10px;width: 900px">

      <!-- 用户列表区域 -->
      <el-table
        :data="order_li" :max-height="590"
        :border="true" size="mini"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '5px'}"
        :cell-style="cellstyle"
        :stripe="true" :default-sort = "{prop: 'create_time,add,print_status,order_level', order: 'descending'}"
        :highlight-current-row="true">
        <el-table-column type="index" label="#" width="60px"/>
        <el-table-column label="画图批号" prop="id" width="130px">
          <template slot-scope="scope">
            <router-link :to="{path: '2-8-1',query: {order: scope.row.id}}">{{scope.row.id}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="add" width="80px" sortable/>
        <el-table-column label="生产级别" prop="order_level" width="95px" sortable/>
        <el-table-column label="批次总数" prop="total_num" width="80px"/>
        <el-table-column label="创建人账号" prop="create_user" width="95px"/>
        <el-table-column label="创建时间" prop="create_time"width="160px" sortable/>
        <el-table-column label="画图人" prop="draw_user" width="80px"/>
        <el-table-column label="画图完成时间" prop="complete_time" width="160px"/>
        <el-table-column label="状态" prop="status" width="100px"/>
        <el-table-column label="打印状态" prop="print_status" width="100px" sortable/>
        <el-table-column label="修改状态" prop="update_status" width="100px" sortable/>
        <el-table-column label="备注" prop="note" width="160px"/>
        <el-table-column label="操作" width="170px" fixed="right">
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="input" size="mini" @clear="order_list" @keyup.enter.native="order_list"
              placeholder="业务/ERP单号"/>
          </template>
          <template slot-scope="scope">
            <el-tooltip
              v-if="role_tree_list.indexOf('2-8-3') !== -1 && scope.row.status === '未画图'"
              class="item" effect="dark" content="画图完成" placement="top-start" enterable="false">
              <el-button type="success" icon="el-icon-check" circle size="mini" @click="Approval(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip
              v-else-if="role_tree_list.indexOf('2-8-3') !== -1 && scope.row.status === '画图完成'"
              class="item" effect="dark" content="撤销画图" placement="top-start" enterable="false">
              <el-button type="warning" icon="el-icon-refresh-left" circle size="mini" @click="cancel_Approval(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip
              v-if="role_tree_list.indexOf('2-8-2') !== -1"
              class="item" effect="dark" content="打印批次" placement="top-start" enterable="false">
              <el-button type="primary" icon="el-icon-printer" circle size="mini" @click="ptinter(scope.row.id)"/>
            </el-tooltip>
            <el-button type="danger" icon="el-icon-delete" circle
                       size="mini" v-if="role_tree_list.indexOf('2-8-1') !== -1"
                       @click="delete_order(scope.row.id,scope.row.status)"/>
            <el-tooltip
              v-if="role_tree_list.indexOf('2-8-5') !== -1 "
              class="item" effect="dark" content="修改画图时间" placement="top-start" enterable="false">
              <el-button type="primary" icon="el-icon-s-custom" circle size="mini" @click="showEditDialog2(scope.row.id,scope.row.draw_user,scope.row.complete_time)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <div style="margin-top: 10px;margin-bottom: -13px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10,15,20,50,100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog title="修改画图时间" :visible.sync="addVisible3" :append-to-body="true" width="30%">
          <span>
            <el-form :model="update_li" label-width="100px">
              <el-form-item label="画图人" prop="draw_user">
                <el-autocomplete
                  v-model="update_li.draw_user"
                  size="small" style="width: 120px"
                  class="el-input" clearable
                  :fetch-suggestions="querySearchAsync_name"
                  placeholder="画图人"/>
              </el-form-item>
              <el-form-item
                label="画图日期" prop="complete_time">
                <el-date-picker
                  v-model="update_li.complete_time"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </span>
      <span
        slot="footer" class="dialog-footer">
            <el-button @click="addVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="update_draw">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLodop } from '@/assets/LodopFuncs'

export default {
  name: 'Order',
  data() {
    return {
      input: '',
      user: '', // 记录当前用户
      ahttp_excel: 'http://47.114.190.252:8888/store_excel', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      addVisible3: false, // 画图修改窗口是否显示
      order_li: [],
      update_li: {
        id: '',
        draw_user: '',
        complete_time: ''
      },  //修改列表
      pi_list: [], // 选中的要生成批次的行
      pi_list_copy: [], // 选中的要生成批次的行
      pi_num: '未生成',//选中后生成的批次号码
      currentPage: 1, // 当前页
      pagesize: 15, // 每页显示行数
      total: 0 // 总计数量
    }
  },
  created() {
    this.user = window.sessionStorage.getItem('token')
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
    this.order_list()
  },
  methods: {
    cellstyle({row,column,rowIndex,columnIndex}) {
      if (columnIndex === 10) {
        if(row.print_status === '未打印'){
          return `padding:2px;background:#e6a23c;height:5px`
        }

      }

    },
    showEditDialog2(id,draw_user,complete_time) {//修改画图批次
      this.update_li.id = id
      this.update_li.draw_user = draw_user
      this.update_li.complete_time = complete_time
      this.addVisible3 = true
    },
    update_draw() {  //确认修改画图人和日期
      var that = this
      this.$http.post('update_draw/',{data : this.update_li}).then(function (res) {
        if (res.data === 'OK'){
          that.$message.success('时间修改成功')
          that.addVisible3 = false
          that.order_list()
        }
      }).catch(function () {
        that.$message.warning('保存失败')
      })
    },
    order_list() {
      var that = this
      this.$http
        .post('draw_pi/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.input,
          user:this.user //用户的账号信息
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
    ptinter(id) {
      this.$router.push({ path: '/2-8-1', query: { order: id } })// 调整订单新增页面
    },
    print_list() {
      var LODOP = getLodop()
      LODOP.PRINT_INITA(10, 10, 754, 453, '学生统计结果')
      LODOP.SET_PRINT_PAGESIZE(0, 2100, 2970, "")
      LODOP.SET_PRINT_MODE("PRINT_DUPLEX",2)   //自动双面打印
      LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE",1);  //自定义纸张
      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",1);  //自定义纸张
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById("printTest").innerHTML)
      //LODOP.ADD_PRINT_TABLE(0,0,'100%','100%', 'URL:http://localhost:8081/#/2-8-1')
      LODOP.PREVIEW()

    },
    querySearchAsync_name(queryString, cb) {
      this.$http.post('saleman/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].nameid
        }
        cb(data)
      })
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
    },
    showEditDialog(id) {
      this.$router.push({ path: '/2-1-2', query: { order: id } })// 调整订单新增页面
    },
    excel_out (id) { // 导出表格
      var that = this
      this.$message.warning('马上发布')
      //this.$http.post('excel_out/', { pi_num:id}).then(function (res) {
          //if (res.data === 'Nothing') {that.$message.error('明细为空')
          //} else {
            //that.$message.success('表格导出成功')
            //window.open(that.ahttp + res.data)
          //}
        //})
    },
    delete_order(name, status) {
      // 删除用户，并提示
      var that = this
      if (status === '画图完成') {
        that.$message.warning('状态画图完成,不能删除')
      } else {
        this.$confirm('此操作将永久画图批次, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function (res) {
            if (res === 'confirm') {
              that.$http.post('delete_draw_pi/', { name: name }).then(function (res) {
                if (res.data === 'OK') {
                  // 执行删除成功时
                  that.$message.success('删除批次成功')
                  that.order_list() // 刷新列表
                } else {
                  that.$message.error('删除失败')
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
    Approval(id) { // 订单审核
      var that = this
      this.$http.post('draw_Approval/', { order: id, user: that.user })
        .then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('审核成功')
            that.order_list()
          } else {
            that.$message.error('审核失败')
          }
        })
    },
    cancel_Approval(id) {
      var that = this
      this.$http.post('draw_Approval_cancel/', { order: id, user: that.user })
        .then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('撤销成功')
            that.order_list()
          } else {
            that.$message.error('撤销失败')
          }
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
  width: 900px;
}
.input-with-select {
  margin-top: 10px;
}
.el-table tbody tr:hover > td {
  background-color: #ecf5ff !important;
}
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}
</style>

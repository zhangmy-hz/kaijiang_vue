<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row :gutter="20" style="margin-top: -20px">
        <el-col :span="2" class="el-row">
          <el-select size="small"
                     v-model="selectForm.status" placeholder="审核" style="width: 100px">
            <el-option clearable v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="2" class="el-row">
          <el-select size="small"
            v-model="selectForm.draw_status" placeholder="画图" style="width: 100px">
            <el-option clearable v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
          <el-col :span="6" class="el-row">
            <el-date-picker size="small"
                            v-model="selectForm.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="订单日期"
                            end-placeholder="订单日期"/>
          </el-col>
        <el-col :span="5" class="el-row">
          <el-input size="small"
            v-model="selectForm.input"
            placeholder="业务/ERP单号 业务员 地区"
            clearable
            @clear="order_list" @keyup.enter.native="order_list">>
            <el-button slot="append" icon="el-icon-search" @click="order_list"/>
          </el-input>
        </el-col>
        <el-col class="el-row" :span="1.5">
          <el-button
            type="primary"
            size="small" v-if="role_tree_list.indexOf('2-1-1') !== -1" @click="order_new">
            新增订单
          </el-button>
        </el-col>
        <el-col class="el-row" :span="1.5">
          <el-button type="primary" size="small" @click="excel_out">
            下载模板
          </el-button>
        </el-col>
        <el-col class="el-row" :span="1.5">
          <el-button type="primary" size="small" @click="addVisible_excel = true">
            导入
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="order_li"
        :border="true"
        :header-row-style="{'padding':'2px','height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'2px','margin':'1px'}"
        :stripe="true"
        :highlight-current-row="true">
        <el-table-column type="index" label="#" width="55px" />
        <el-table-column label="业务单号" prop="id" width="110px" />
        <el-table-column label="地区" prop="add" width="80px" />
        <el-table-column label="业务员" prop="salesman" width="80px" />
        <el-table-column label="合计" prop="total_num" width="60px" />
        <el-table-column label="金额" prop="total_amount" width="80px" />
        <el-table-column label="生产等级" prop="order_level" width="80px" />
        <el-table-column label="创建时间" prop="create_time" width="160px" />
        <el-table-column label="审核人" prop="examine" width="80px"/>
        <el-table-column label="审核时间" prop="examine_time" width="160px" />
        <el-table-column label="修改人" prop="update_user" />
        <el-table-column label="修改时间" prop="update_time" width="160px" />
        <el-table-column label="状态" prop="status" width="80px" />
        <el-table-column label="画图" prop="draw_status" width="95px" />
        <el-table-column label="批次" prop="pi_code" width="128px" />
        <el-table-column label="备注" prop="note" width="200px" />
        <el-table-column label="操作" width="140px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle
              size="mini" v-if="role_tree_list.indexOf('2-1-2') !== -1 && (scope.row.examine === '' || scope.row.examine === null || scope.row.examine === 'undefined')"
              @click="showEditDialog(scope.row.id)"/>
            <el-button type="primary" icon="el-icon-view" circle
                       size="mini" v-if="role_tree_list.indexOf('2-1-5') !== -1 && scope.row.examine "
                       @click="showEditDialog_see(scope.row.id)"/>
            <el-button type="danger" icon="el-icon-delete" circle
              size="mini" v-if="role_tree_list.indexOf('2-1-3') !== -1"
              @click="delete_order(scope.row.id,scope.row.status,scope.row.pi_code)"/>
            <el-tooltip
              v-if="!scope.row.examine && role_tree_list.indexOf('2-1-4') !== -1 "
              class="item" effect="dark" content="审核订单"
              placement="top-start" enterable="false">
              <el-button type="success" icon="el-icon-check" circle
                size="mini" @click="Approval(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip
              v-else-if="role_tree_list.indexOf('2-1-6') !== -1 && scope.row.examine !== ''"
              class="item" effect="dark" content="撤审订单" placement="top-start" enterable="false">
              <el-button type="warning"
                icon="el-icon-refresh-left" circle size="mini" @click="cancel_Approval(scope.row.id,scope.row.draw_status)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <div style="margin-top: 10px;margin-bottom: -13px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[15,20,50,100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog title="导入订单" :visible.sync="addVisible_excel" width="40%" >
      <el-form ref="Incoming" :model="InForm"  label-width="100px">
        <div style="width:60%">
          <el-form-item label="地区" prop="boci">
            <el-select
              v-model="InForm.add"
              placeholder="选择地区">
              <el-option
                v-for="item in options_add"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="InForm.note" clearable	/>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="InForm.date" value-format="yyyy-MM-dd" placeholder="选择日期"/>
          </el-form-item>
        </div>
        <el-upload
          class="upload-demo"
          drag limit="1" accept=".xls,.xlsx" :on-remove="remove_excel"
          :http-request="upload_excel">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">必须使用模板格式导入</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible_excel = false">取 消</el-button>
        <el-button type="primary" @click="add_pur">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'Order',
  data() {
    return {
      input: '',
      selectForm:{
        input: '',
        date: '',
        draw_status:'',
        status:'',
      },
      addVisible_excel: false,
      user: '', // 记录当前用户
      ahttp_excel: 'http://47.114.190.252:8888/store_excel', // 服务器地址
      addVisible: false, // 控制添加是否显示
      addVisible2: false, // 修改窗口是否显示
      order_li: [],
      currentPage: 1, // 当前页
      pagesize: 15, // 每页显示行数
      total: 0, // 总计数量
      addForm: {
        username: '',
        password: '',
        address: '', // 地址
        email: '',
        iphone: ''
      },
      InForm: {
        add: '', // 地区
        note: '', // 备注
        date: '', // 日期
        saleman: '',
        infile: '', // 上传的excel名称
        create_user: ''
      },
      options_add: [
        {
          value: '杭州',
          label: '杭州'
        },
        {
          value: '义乌',
          label: '义乌'
        }
      ],
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
      options2: [
        {
          value: '',
          label: ''
        },
        {
          value: '审核',
          label: '审核'
        },
        {
          value: '未审核',
          label: '未审核'
        }
      ],
      updateForm: {}
    }
  },
  created() {
    this.user = window.sessionStorage.getItem('token')
    this.InForm.create_user = window.sessionStorage.getItem('token')
    this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
    this.order_list()
  },
  mounted () {
    this.columnDrop()
  },
  methods: {
    order_list() {
      var that = this
      this.$http
        .post('order/', {
          page: this.currentPage,
          size: this.pagesize,
          serch: this.selectForm,
          user: this.user // 用户的账号信息
        })
        .then(function(res) {
          // console.log(res)
          that.total = res.data.total
          that.order_li = res.data.user_list
        })
    },
    // 列拖拽
    columnDrop () {
      var dropCol = ['#','业务单号','地区','业务员','合计','金额','生产等级','创建时间','审核人','审核时间','修改人','修改时间','状态','画图','批次','备注']
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr');
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = dropCol[evt.oldIndex];
          dropCol.splice(evt.oldIndex, 1);
          dropCol.splice(evt.newIndex, 0, oldItem);
        }
      });
    },
    order_new() { // 订单新增
      this.$router.push('/2-1-1')// 调整订单新增页面
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
    upload_excel(file) { // 上传表格
      var that = this
      // 图片上传
      const loading = that.$loading({ lock: true, text: '文件拼命上传中,请勿关闭,请稍等,...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file.file)
      this.$http
        .post('excel_file_store/', fileReq)
        .then(function(res) {
          console.log(res)
          if (res.data !== 'nothing') {
            that.$notify({ title: '提示', message: '文件上传成功', duration: 0, type: 'success', offset: 100 })
            that.InForm.infile = res.data // 文件名称
            loading.close()
            // console.log(that.img_name)
          } else {
            that.$notify.error({ title: '提示', message: '上传文件模板错误,请核对是否和模板列一致', duration: 0, offset: 100 })
            loading.close()
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
          loading.close()
        })
    },
    add_pur() { // 上传确认
      var that = this
      this.$refs.Incoming.validate(valid => {
        if (valid) {
          if (this.InForm.infile === '') {
            that.$message.error('上传文件为空,请重新上传文件')
          } else {
            this.$confirm('此操作将新增订单,确认执行?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(function(res) {
                if (res === 'confirm') {
                  const loading = that.$loading({ lock: true, text: '系统拼命计算中,请稍等...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
                  that.$http.post('auto_store/', { inform: that.InForm }).then(function (res) {
                    if (res.data === 'OK') {
                      loading.close()
                      that.$notify({ title: '提示', message: '数据计算成功,订单已经生成', duration: 0, type: 'success', offset: 100 })
                      that.addVisible_excel = false// 关闭窗口
                      that.order_list() // 重新加载
                    } else if (res.data === 404) { that.$notify.error({ title: '提示', message: '导入模板列名不对', duration: 0, offset: 100 }) } else { that.$notify.error({ title: '提示', message: '数据计算异常,请联系系统管理员', duration: 0, offset: 100 }) }
                  })
                }
              })
          }
        }
      })
    },
    remove_excel() { // 移除文件
      this.InForm.infile = ''// 文件名更改为空
    },
    // 添加对话框，关闭时触发
    handleClose(res) {
      this.$refs.Formref.resetFields() // 订单重置
    },
    showEditDialog(id) {
      this.$router.push({ path: '/2-1-2', query: { order: id } })// 调整订单新增页面
    },
    showEditDialog_see(id) { // 查看订单
      this.$message.warning('审核订单只能查看')
      this.$router.push({ path: '/2-1-3', query: { order: id } })// 调整订单新增页面
    },
    excel_out() { // 导出表格,下载模板
      window.open(this.ahttp_excel)
    },
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") { return true;} else {return false;}},
    delete_order(name, status,pi_code) {
      var that = this
      if (status === '审核') {
        that.$message.warning('已经审核,不能删除')
      } else {
        if (this.isEmpty(pi_code)) {
          this.$confirm('确定永久删除订单,是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(function (res) {
              if (res === 'confirm') {
                that.$http.post('delete_order/', { name: name,status:0,pi_code:pi_code }).then(function (res) {
                  if (res.data === 'OK') {
                    // 执行删除成功时
                    that.$message.success('删除订单成功')
                    that.order_list() // 刷新列表
                  } else {
                    that.$message.success('删除订单成功')
                    that.$notify({
                      title: '提示',
                      message: '同一个单号分多个订单录入，其余订单合数已重新计算',
                      type: 'warning'
                    })
                    that.order_list() // 刷新列表
                  }
                })
              }
            })
            .catch(function (res) {
              console.log('删除失败')
              return res
            })
        }
        else {
          this.$confirm('存在画图批次,确定已经和设计沟通可以整单删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(function (res) {
              if (res === 'confirm') {
                that.$http.post('delete_order/', { name: name,status:1,pi_code:pi_code }).then(function (res) {
                  if (res.data === 'OK') {
                    // 执行删除成功时
                    that.$message.success('删除订单成功')
                    that.order_list() // 刷新列表
                  }else {
                    that.$message.success('删除订单成功')
                    that.$notify({
                      title: '提示',
                      message: '同一个单号分多个订单录入，其余订单合数已重新计算',
                      type: 'warning'
                    })
                    that.order_list() // 刷新列表
                  }
                })
              }
            })
            .catch(function (res) {
              console.log('删除失败')
              return res
            })
        }
      }
    },
    Approval(id) { // 订单审核
      var that = this
      var user_name = window.sessionStorage.getItem('user_name')
      this.$http.post('order_Approval/', { order: id, user: user_name })
        .then(function (res) {
          if (res.data === 'OK') {
            that.$message.success('审核成功')
            that.order_list()
          } else {
            that.$message.error('审核失败')
          }
        })
    },
    cancel_Approval(id,draw_status) {
      var that = this
      if (draw_status ==='正在画图' || draw_status ==='画图完成') {
        this.$confirm('已经画图,确认已经和设计沟通, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function (res) {
            if (res === 'confirm') {
              that.$http.post('order_Approval_cancel/', { order: id, user: that.user })
                .then(function (res) {
                  if (res.data === 'OK') {
                    that.$message.success('撤审成功')
                    that.order_list()
                  }  else {that.$message.error('审核失败')}
                })
            }
          })
      } else {
        this.$http.post('order_Approval_cancel/', {
          order: id,
          user: that.user
        })
          .then(function (res) {
            if (res.data === 'OK') {
              that.$message.success('撤核成功')
              that.order_list()
            }  else {
              that.$message.error('审核失败')
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
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all 0.5s;
}
.input-with-select {
  margin-top: 10px;
}
/deep/ .el-table__body tr.current-row>td{
  background-color: #c2e7b0 !important;
}

</style>

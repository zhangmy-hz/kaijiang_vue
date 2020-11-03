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
      <el-form
        ref="Formref"
        :model="addForm"
        :inline="true"
        :rules="formrules"
        label-width="80px"
        size="mini"
      >
        <div style="width:100%">
          <el-form-item label="业务单号">
            <el-input
              v-model="addForm.id"
              style="width:110px"
              disabled
            />
          </el-form-item>
          <el-form-item
            label="地区"
            prop="add"
          >
            <el-select
              v-model="addForm.add"
              placeholder="选择地区"
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
          <el-form-item
            label="日期"
            prop="date"
          >
            <el-date-picker
              v-model="addForm.date"
              style="width: 140px"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="业务员" prop="name">
            <el-input
              v-model="addForm.salesman"
              style="width: 100px"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="addForm.note"
              style="width: 150px"
            />
          </el-form-item>
        </div>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-col :span="2">
            <el-button
              type="primary" size="small" style="float: left"
              @click="add_order_list">
              添加一行
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-tooltip
              class="item"
              effect="dark"
              content="快捷键:Ctrl+Q"
              placement="top-start"
              enterable="false">
              <el-button
                type="primary" size="small" style="float: left"
                @click="copy_rows">
                复制多行
              </el-button></el-tooltip>
            <el-col :span="8">
              <el-input  size="small" v-model="copy_num" style="width: 130px;margin-left: 20px" type="number" >
                <el-button type="primary" size="mini"  slot="append" @click="copy_row">复制</el-button>
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="5">
            <label style="font-size: 14px">合计:</label>
            <el-input v-model="addForm.total_num" size="small" style="width: 100px" disabled></el-input>
          </el-col>
        </el-col>

      </el-row>
      <!-- 订单列表区域 -->
      <el-table
        ref="refs"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :row-class-name="tableRowClassName"
        :data="order_li" max-height="500px"
        :border="true" size="mini"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '10px'}"
        :cell-style="{'padding':'0px','height':'10px','margin':'0px'}"
        :stripe="true"
        :fit="true"
        :highlight-current-row="true"
        @selection-change="handleSelectionChange"
        @row-click="onRowClick"
      >
        <el-table-column type="index" />
        <el-table-column type="selection" />
        <el-table-column
          v-if="show"
          label="id"
          width="140px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.id"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="类型" width="100px" prop="order_type">
          <template slot-scope="scope" v-if="scope.row.update_status === 1">
            <el-select
              v-model="scope.row.order_type"
              placeholder="订单类型"
              style="width: 100px"
              size="small"
            >
              <el-option
                v-for="item in options_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="级别"
          width="100px"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.order_level"
              placeholder="订单级别"
              style="width: 100px"
              size="small">
              <el-option
                v-for="item in options_level"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="ERP单号"
          width="140px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.order_code"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="SKU编码"
          width="140px"
        >
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.item_code"
              size="small"
              class="el-input"
              :fetch-suggestions="querySearchAsync"
              placeholder="选择SKU"
              @select="handleSelect"
            />
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="150px" prop="item_name" />
        <el-table-column
          label="名字"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.order_name"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="单位" width="70px" prop="unit" />
        <el-table-column label="分类" width="90px" prop="skutype" />
        <el-table-column label="订单数">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.num" type="number" @change="num_change"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="合数" prop="total_num" />
        <el-table-column label="金额">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.amount"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="颜色"
          width="100px"
        >
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.color"
              size="small"
              class="el-input"
              :fetch-suggestions="querySearchAsync_color"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="字体"
          width="100px"
        >
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.words"
              size="small"
              class="el-input"
              :fetch-suggestions="querySearchAsync_words"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="物流"
          width="130px"
        >
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.wuliu"
              size="small"
              class="el-input"
              :fetch-suggestions="querySearchAsync_wuliu"
            />
          </template>
        </el-table-column>
        <el-table-column label="包装方式" width="120px">
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.pack_method" size="small" class="el-input"
              :fetch-suggestions="querySearchAsync_packing"/>
          </template>
        </el-table-column>
        <el-table-column label="链长" width="100px">
          <template slot-scope="scope">
            <el-autocomplete style="width: 180px;margin-left: -10px"
                             v-model="scope.row.size" size="small"
                             class="el-input" :fetch-suggestions="querySearchAsync_size"/>
          </template>
        </el-table-column>
        <el-table-column label="风格" width="80px">
          <template slot-scope="scope">
            <el-autocomplete  style="width: 220px;margin-left: -10px"
                              v-model="scope.row.sku_style" size="small" class="el-input"
                              :fetch-suggestions="querySearchAsync_sku_style"/>
          </template>
        </el-table-column>
        <el-table-column
          label="客户备注"
          width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.note"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="对单日期"
          width="150px"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.end_date"
              style="width: 140px"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="对单日期"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delete_order(scope.$index,scope.row.id)"
            />
            <el-button
              v-if="scope.row.picture !== ''"
              type="primary"
              icon="el-icon-picture-outline"
              circle
              size="mini"
              @click="showEditDialog(scope.row.item_code,scope.row.item_name,scope.row.picture)"
            />
            <el-button
              v-else
              disabled
              type="primary"
              icon="el-icon-picture-outline"
              circle
              size="mini"
            />
            <el-button
              v-if="scope.row.item_code !== ''"
              type="primary"
              icon="el-icon-upload2"
              circle
              size="mini"
              @click="showEditDialog2(scope.row.item_code,scope.row.item_name,scope.row.row_index,scope.row.order_img)"
            />
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
    <!-- 多页签图片上传管理-->
    <el-dialog
      title="订单图片" :visible.sync="addVisible3" width="40%">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粘贴上传" name="first">
          <span>
            <el-form :model="order_img" label-width="100px">
        <el-form-item>
             <div class="box">
              <div  v-on:paste="handlePaste">
                <img v-if="order_img.imgurl" :src="order_img.imgurl" class="avatar">
                <span>图片截图或复制,<em>鼠标放此处</em>后按Ctrl+V 上传</span>
              </div>
            </div>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="编号">
                <el-input v-model="order_img.item_code" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称">
                <el-input v-model="order_img.item_name" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
        </el-tab-pane>
        <el-tab-pane label="选择上传" name="second">
          <span>
            <el-form :model="order_img" label-width="100px">
        <el-form-item>
            <span>
              <el-upload style="margin-top: 10px" class="avatar-uploader" :show-file-list="false" :http-request="upload_img">
                <img v-if="order_img.imgurl" :src="order_img.imgurl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg图片，且不超过2M</div>
              </el-upload>
            </span>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="编号">
                <el-input v-model="order_img.item_code" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称">
                <el-input v-model="order_img.item_name" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderUpdate',
  data() {
    return {
      addVisible2: false, // 弹窗
      addVisible3: false, // 订单图片窗口
      activeName: 'first',
      order_num: '', // 本页订单号
      loading: true,
      copy_num:0,
      currentRowIndex: '', // 记录当前表格现在的行
      update_user_name: '', // 记录当前用户名
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
          sku_style:'',
          num: '',
          wuliu: '',
          pack_method: '',
          note: '',
          total_num: '',
          amount: 0, // 订单金额
          size: '',
          create_date: '',
          end_date: '',
          order_img: '',// 订单图片
        }
      ],
      delete_li: [], // 删除的集合
      options: [
        {
          value: '选项1',
          label: '义乌'
        },
        {
          value: '选项2',
          label: '杭州'
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
      options_type: [
        {
          value: '大批量',
          label: '大批量'
        },
        {
          value: '小批量',
          label: '小批量'
        }
      ],
      options_level: [
        {
          value: '正常',
          label: '正常'
        },
        {
          value: '加急',
          label: '加急'
        },
        {
          value: '补做',
          label: '补做'
        }
      ],
      addForm: {
        id: '',
        add: '',
        date: '',
        salesman: '',
        note: '',
        create_user: '',// 创建人
        total_num:''
      },
      // 表单的验证规则
      formrules: {
        add: [
          {
            required: true,
            message: '地区不能为空!',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    // this.sku_list()
    this.get_data()
    this.addForm.create_user = window.sessionStorage.getItem('token')
    this.update_user_name = window.sessionStorage.getItem('user_name')  //当前用户名
    this.page_get()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index
      this.order_li.update_status = 1 //根据是否为1,判断能否修改
      this.order_li[this.currentRowIndex].update_status = 1 //根据是否为1,判断能否修改
    },
    add_order_list() {
      this.order_li.push({
        order_type: '', // 订单类型
        order_level: '正常', // 生产级别
        order_code: '',
        item_code: '',
        item_name: '',
        order_name: '',
        unit: '个',
        picture: '', // 产品图片
        skutype: '',
        color: '',
        words: '',
        num: 0,
        wuliu: '',
        sku_style:'',
        pack_method: '',
        note: '',
        total_num: 0,
        amount: 0, // 订单金额
        size: 0,
        create_date: '',
        end_date: '',
        order_img: ''// 订单图片
      })
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
      that.order_img.imgurl = that.ahttp_order + img
    },
    querySearchAsync(queryString, cb) {
      this.$http.post('order_sku/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    querySearchAsync_packing(queryString, cb) {
      this.$http.post('packing_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
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
    },
    querySearchAsync_words(queryString, cb) {
      this.$http.post('wenzi_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    querySearchAsync_size(queryString, cb) {
      this.$http.post('size_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].size_name
        }
        cb(data)
      })
    },
    querySearchAsync_wuliu(queryString, cb) {
      this.$http.post('wuliu_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    querySearchAsync_sku_style(queryString, cb) {
      this.$http.post('style_order_select/', { serch: queryString }).then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].name
        }
        cb(data)
      })
    },
    handleSelect(item) {
      console.log(item)
      console.log(this.currentRowIndex)
      this.order_li[this.currentRowIndex].item_code = item.id
      this.order_li[this.currentRowIndex].item_name = item.name
      this.order_li[this.currentRowIndex].unit = item.unit
      this.order_li[this.currentRowIndex].skutype = item.type
    },
    delete_order(row, id) { // 明细行删除
      if (this.currentRowIndex === '' || this.currentRowIndex === 0) {

      } else {
        this.order_li.splice(row, 1)
        this.delete_li.push(id)// 增加删除的内容
        this.num_change() //将计算总数程序跑一边
        this.ERP_change() //将计算合数程序跑一边
      }
    },
    handleSelectionChange(val) {//选中的表格集合
      this.table_Selection = val;
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
    copy_rows() {//复制选中的多行
      var i =0
      var j = this.table_Selection.length
      if (j===0){
        this.$message.warning('未选中任何一行')
      }
      for (i = 0; i<j; i++){
        this.order_li.push({
          order_type: this.table_Selection[i].order_type, // 订单类型
          order_level: this.table_Selection[i].order_level, // 生产级别
          order_code: this.table_Selection[i].order_code,
          item_code: this.table_Selection[i].item_code,
          item_name: this.table_Selection[i].item_name,
          order_name: this.table_Selection[i].order_name,
          unit: this.table_Selection[i].unit,
          picture: this.table_Selection[i].picture,
          skutype: this.table_Selection[i].skutype,
          color: this.table_Selection[i].color,
          words: this.table_Selection[i].words,
          num: this.table_Selection[i].num,
          wuliu: this.table_Selection[i].wuliu,
          sku_style: this.table_Selection[i].sku_style,
          pack_method: this.table_Selection[i].pack_method,
          note: this.table_Selection[i].note,
          total_num:this.table_Selection[i].total_num,
          amount: this.table_Selection[i].amount, // 订单金额
          size: this.table_Selection[i].size,
          create_date: this.table_Selection[i].create_date,
          end_date: this.table_Selection[i].end_date,
          order_img: this.table_Selection[i].order_img// 订单图片
        })
      }
      this.num_change() //将计算总数程序跑一边
      this.ERP_change() //将计算合数程序跑一边
    },
    copy_row() {//选中一行复制
      var i =0
      var j = this.copy_num
      var jj =this.table_Selection.length
      if (jj===0){
        this.$message.warning('未选中任何一行')
      }
      if (this.copy_num < 1) {
        this.$message.warning('输入数字必须大于0')
      }
      for (i = 0; i < j; i++) {
        this.order_li.push({
          order_type: this.table_Selection[0].order_type, // 订单类型
          order_level: this.table_Selection[0].order_level, // 生产级别
          order_code: this.table_Selection[0].order_code,
          item_code: this.table_Selection[0].item_code,
          item_name: this.table_Selection[0].item_name,
          order_name: this.table_Selection[0].order_name,
          unit: this.table_Selection[0].unit,
          picture: this.table_Selection[0].picture,
          skutype: this.table_Selection[0].skutype,
          color: this.table_Selection[0].color,
          words: this.table_Selection[0].words,
          sku_style: this.table_Selection[0].sku_style,
          num: this.table_Selection[0].num,
          wuliu: this.table_Selection[0].wuliu,
          pack_method: this.table_Selection[0].pack_method,
          note: this.table_Selection[0].note,
          total_num: this.table_Selection[0].total_num,
          amount: this.table_Selection[0].amount, // 订单金额
          size: this.table_Selection[0].size,
          create_date: this.table_Selection[0].create_date,
          end_date: this.table_Selection[0].end_date,
          order_img: this.table_Selection[0].order_img// 订单图片
        })
      }
      this.num_change() //将计算总数程序跑一边
      this.ERP_change() //将计算合数程序跑一边
    },
    handlePaste(event) {  //直接黏贴图片
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持本地");
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      // 此时file就是我们的剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      const reader = new FileReader();
      //reader.onload = event => {
      //preview.innerHTML = `<img src="${event.target.result}">`;
      //};
      this.upload_img1(file)
      //reader.readAsDataURL(file);
      //this.file = file;
    },
    //上传文件成功后回调
    uploadPlans() {  //图片上传的事件
      let file = this.file;
      if (!file) {
        this.$message.error("请粘贴图片后上传");
        return;
      }
      this.loading = true;
      let form = new FormData();
      form.append("file", file);
      form.append("type", this.type);
      //uploadCertificate是封装的axios请求，自己根据需求传参
      uploadCertificate(form)
        .then(data => {
          if (data.data && data.data.success) {
            this.certificate_pic = data.data.data.source;
            this.$message.success(this.name + "上传成功！");
          } else {
            this.$message.error(this.name + "上传失败！");
          }
        }).catch(() => {});
    },
    upload_img1(file) { // 图片上传
      var that = this
      // 图片上传
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file)
      this.$http
        .post('img_order/', fileReq)
        .then(function(res) {
          // console.log(res)
          if (res.status === 200) {
            that.$message.success('上传成功')
            that.order_img.imgurl = that.ahttp_order + res.data
            that.order_li[that.currentRowIndex].order_img = res.data
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
        })
    },
    upload_img(file) { // 图片上传
      var that = this
      // 图片上传
      const fileReq = new FormData() // 定义一个formdata类
      // 传输照片
      fileReq.append('img', file.file)
      this.$http
        .post('img_order/', fileReq)
        .then(function(res) {
          // console.log(res)
          if (res.status === 200) {
            that.$message.success('上传成功')
            that.order_img.imgurl = that.ahttp_order + res.data
            that.order_li[that.currentRowIndex].order_img = res.data
          }
        })
        .catch(function() {
          that.$message.error('上传失败')
        })
    },
    num_change() {//所有行的数量汇总
      var j = this.order_li.length
      var i = 0
      this.addForm.total_num = 0 //线清零
      for (i = 0; i<j; i++){//数量汇总计算
        this.addForm.total_num = this.addForm.total_num + parseInt(this.order_li[i].num)
      }
      this.ERP_change() //合数重新计算计算
    },
    ERP_change() {//ERP单号改变,计算合数
      var ERP_list = [] //单号合集
      var j = this.order_li.length
      var i = 0
      var ii = 0
      var num = 0//合数统计
      for (i=0;i<j;i++) {
        for (ii = 0; ii < j; ii++) {
          if (this.order_li[i].order_code === this.order_li[ii].order_code){
            num = num + parseInt(this.order_li[ii].num)
          }
        }
        this.order_li[i].total_num = num
        num = 0
      }
    },
    order_save() { // 订单保存
      var that = this
      //开始检验是否有必填项没输入
      var j = this.order_li.length
      var i = 0
      for (i = 0;i< j;i++){
        if (that.order_li[i].order_code ==='' || that.order_li[i].order_name ==='' || that.order_li[i].num ==='' ||that.order_li[i].wuliu ==='' || that.order_li[i].size ===''){
          that.$message.warning('第'+(i+1)+'行:'+'ERP单号,订单名字,数量,物流,链长是必填项')
          return 404//函终止
        }
      }
      //开始检查是否有重复项
      var jj = this.order_li.length
      var ii = 0
      var iii = 0
      for (ii = 0;ii< jj;ii++){
        for (iii = 0;iii< jj;iii++){
          if (ii === iii) {

          }else {
            if (that.order_li[ii].order_code === that.order_li[iii].order_code && that.order_li[ii].item_code === that.order_li[iii].item_code
              && that.order_li[ii].order_name === that.order_li[iii].order_name && that.order_li[ii].color === that.order_li[iii].color && that.order_li[ii].words === that.order_li[iii].words){
              that.$message.warning('第'+(ii+1)+'行和'+(iii+1)+'行重复')
              return 404//函终止
            }}
        }
      }
      this.$confirm('确定保存订单信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function (res) {
        if (res === 'confirm') {
          that.$http.post('order_update/', { order_tou: that.addForm, order_shen: that.order_li, delete_li: that.delete_li,user_name:that.update_user_name })
            .then(function (res) {
              if (res.data === 'OK') {
                that.$message.success('订单保存成功')
                that.$router.back(-1)// 返回上一层
              } else {
                that.$message.error('订单保存失败')
              }
            })
        }
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
.el-table tbody tr:hover>td { background-color: green;color: #000; }
<style scoped>
</style>

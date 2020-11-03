<script src="../../router/index.js"></script>
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>完成入库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-form
        :model="selectForm"
        :inline="true"
        label-width="80px"
        size="mini"
      >
        <div style="width:100%">
          <el-form-item label="ERP单号">
          <el-input clearable type="textarea" :rows="1" v-model="selectForm.order_code" placeholder="逗号隔开"/>
        </el-form-item>
          <el-form-item label="流水号">
            <el-input clearable type="textarea" :rows="1" v-model="selectForm.id" placeholder="逗号隔开"  style="width:110px"
                      onkeyup="this.value=this.value.replace(/[^0-9\,]/,'')"/>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="selectForm.order_time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="画图日期">
            <el-date-picker
              v-model="selectForm.draw_time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="打印日期">
            <el-date-picker
              v-model="selectForm.print_time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item label="业务员">
            <el-autocomplete
              v-model="selectForm.salesman"
              size="small" style="width: 120px"
              class="el-input" clearable
              :fetch-suggestions="querySearchAsync_name"
              placeholder="选择业务员"
            />
          </el-form-item>
          <el-form-item label="画图状态">
            <el-select
              v-model="selectForm.draw_status"
              placeholder="选择状态"
              style="width: 100px">
              <el-option clearable
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="订单级别">
            <el-select
              v-model="selectForm.order_level"
              style="width: 100px">
              <el-option clearable
                v-for="item in options1"
                :key="item.value"
                :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="打印状态">
            <el-select clearable
              v-model="selectForm.print_status"
              style="width: 100px">
              <el-option
                v-for="item in options2"
                :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色">
            <el-autocomplete style="width: 100px"
              v-model="selectForm.color"
              class="el-input" clearable
              :fetch-suggestions="querySearchAsync_color"
              placeholder="点击选择"/>
          </el-form-item>
          <el-form-item label="字体">
            <el-autocomplete style="width: 100px"
              v-model="selectForm.words"
              class="el-input" clearable
              :fetch-suggestions="querySearchAsync_words"
              placeholder="点击选择"/>
          </el-form-item>
          <el-form-item label="风格">
            <el-autocomplete style="width: 100px"
                             v-model="selectForm.sku_style"
                             class="el-input" clearable
                             :fetch-suggestions="querySearchAsync_sku_style"
                             placeholder="点击选择"/>
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <el-autocomplete style="width: 100px"
              v-model="selectForm.type"
              class="el-input" clearable
              :fetch-suggestions="querySearchAsync_type"
              placeholder="选择分类"/>
          </el-form-item>
          <el-form-item label="名字">
            <el-input clearable
              v-model="selectForm.order_name" style="width:110px"/>
          </el-form-item>
          <el-form-item label="产品名称" >
            <el-autocomplete v-model="selectForm.item_name" style="width: 120px"
                             size="small" class="el-input" clearable
                             :fetch-suggestions="querySearchAsync_sku"
                             placeholder="选择/手输"
                             @select="handleSelect_sku"/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary" size="mini"
              @click="order_list_2"
              @keyup.enter="order_list_2">
              查询
            </el-button>
            <el-button
              type="primary" size="mini"
              @click="excel_out">
              导出
            </el-button>
            <el-button v-if="role_tree_list.indexOf('2-3-2') !== -1" size="mini"
                       type="primary" @click="draw_agin">
              重新拉图
            </el-button>
            <el-button size="mini"  v-if="role_tree_list.indexOf('2-3-3') !== -1"
                       type="primary"
                       @click="update_print_status">
              更改打印状态
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 用户列表区域 -->
      <el-table
        :data="order_li" size="mini"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'0px','white-space':pre-line}"
        :stripe="true" @selection-change="handleSelectionChange"
        :highlight-current-row="true">
        <el-table-column type="selection" width="60px" />
        <el-table-column type="index" width="60px" label="#"/>
        <el-table-column
          :label="'业务单号 \n 业务员 \n 创建日期 \n 流水号'" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.order_key+'\n'+scope.row.salesman+'\n'+scope.row.date+'\n'+scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="'订单号 \n 交货日期 \n 画图批次' " prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.order_code+'\n'+scope.row.end_date+'\n'+scope.row.pi_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'生产级别 \n 产品编号 \n 产品名称 \n 风格'">
          <template slot-scope="scope">
            <span>{{ scope.row.order_level+'\n'+scope.row.item_code +'\n'+scope.row.item_name + '\n'+scope.row.sku_style }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品图片" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="scope.row.item_name" v-if="scope.row.picture" ><!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp+scope.row.picture" target="_blank" title="查看最大化图片">
                <img :src="ahttp+scope.row.picture" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp+scope.row.picture" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          :label="'颜色\n 名字\n 字体\n 合数'" prop="add">
          <template slot-scope="scope">
            <span>{{ scope.row.color+'\n'}}<b style="font-size: 14pt">{{scope.row.order_name +'\n'}}</b> {{scope.row.words+'\n' + scope.row.total_num}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" width="50px"></el-table-column>
        <el-table-column label="订单图片" prop="create_time" width="130px">
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
        <el-table-column label="客户备注" prop="note" width="130px">
          <template slot-scope="scope">
            <span>{{scope.row.size+'\n'+scope.row.pack_method+'\n'+scope.row.note}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'状态\n 画图人'" prop="draw_status" width="100px">
          <template slot-scope="scope">
            <el-tag size="mini" effect="dark" type="success">{{scope.row.draw_status}}</el-tag>
            <span>{{'\n'+scope.row.draw_user+'\n'}}</span>
            <el-tag size="mini" effect="dark" type="warning" v-if="scope.row.print_status === '未打印'">{{scope.row.print_status}}</el-tag>
            <el-tag size="mini" effect="dark" type="danger" v-if="scope.row.print_status === '已打印'">{{scope.row.print_status}}</el-tag>
            <el-tag size="mini" effect="dark" type="danger" v-if="scope.row.Rework === '返工'">{{scope.row.Rework}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="'画图时间 \n 拉图时间 \n 打印时间 \n打印账号'" width="130px">
          <template slot-scope="scope">
            <span>{{ scope.row.draw_time+'\n'+scope.row.draw_again_time +'\n'+scope.row.print_time +'\n'+scope.row.print_user }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="print_sure(scope.row)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
    </el-card>
    <div style="bottom: 25px;position: fixed;width: 100%;background-color: #909399">
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
  </div>
</template>

<script>
  import { getLodop } from '../../assets/LodopFuncs'
  import table2excel from 'js-table2excel'
  export default {
    name: 'complete',
    data() {
      return {
        //ahttp: 'http://127.0.0.1:8888/img?md5=', // 服务器地址
        ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
        ahttp_order: 'http://47.114.190.252:8888/img_order?md5=', // 服务器地址
        input: '',
        role_tree_list: [],//权限列表
        user: '', // 记录当前用户
        addVisible3: false, // 控制添加是否显示
        order_li: [],
        select_list: [],//选中的行
        print_item: {},//要打印的内容
        currentPage: 1, // 当前页
        pagesize: 10, // 每页显示行数
        total: 0, // 总计数量
        selectForm: {
          // 查询集合
          id:'',//流水号
          order_time:'',//订单创建日期
          draw_time: '',
          print_time: '',
          item_name: '',
          order_code: '', // 订单号
          draw_status: '', // 画图状态
          order_level: '', // 订单级别
          sku_style:'',//风格
          print_status: '', // 打印状态
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
            value: '待拉图',
            label: '待拉图'
          },
          {
            value: '画图完成',
            label: '画图完成'
          },
          {
            value: '拉图完成',
            label: '拉图完成'
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
        ],
        options2: [
          {
            value: '',
            label: ''
          },
          {
            value: '未打印',
            label: '未打印'
          },
          {
            value: '已打印',
            label: '已打印'
          }
        ]
      }
    },
    methods: {
      order_list() {
        var that = this
        this.$http
          .post('order_complete/', {
            page: this.currentPage,
            size: this.pagesize,
            serch: this.selectForm
          })
          .then(function(res) {
            // console.log(res)
            that.total = res.data.total
            that.order_li = res.data.user_list
            that.$message.success(('加载完成'))
          })
      },
      order_list_2() {//为查询按钮单独做一个,区别:只要点击就显示第一页
        var that = this
        this.currentPage = 1
        this.$http
          .post('order_complete/', {
            page: this.currentPage,
            size: this.pagesize,
            serch: this.selectForm
          })
          .then(function(res) {
            // console.log(res)
            that.total = res.data.total
            that.order_li = res.data.user_list
            that.$message.success(('加载完成'))
          })
      },
      keyCodeForEvent(){  //页面案件快捷键
        var that = this
        let self = this;
        let code = 0;
        document.onkeydown = function(e){
          let evn = e || event ;
          let key = evn.keyCode || evn.which || evn.charCode ;
          if(key === 13 || key ===108){ //回车键
            code = 1 ;
            that.$message.success('界面已刷新')
          }
          if(code === 1){
            that.order_list()//引用添加明细
            code = 0;
          }
        }
        document.onkeyup = function(e){
          if (e.keyCode === 17) {
            code = 0;
          }
          if (e.keyCode === 81) {
            code2 = 0;
          }
        }
      },
      excel_out() {//导出表格
        var that = this
        that.$message.info('性能限制,每次导出5000条')
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
          {
            title: '画图人',
            key: 'draw_user',
            type: 'text'
          },
          {
            title: '画图日期',
            key: 'draw_time',
            type: 'text'
          },
          {
            title: '打印时间',
            key: 'print_time',
            type: 'text'
          },

        ]
        //查询后台数据
        var j = 0
        var i = 0
        this.selectForm.order_code = this.selectForm.order_code.replace(/^\s+|\s+$/g,"")
        this.$http.post('order_complete/', {
          page: 1,
          size: 5000,   //每次最多导出1000行
          serch: this.selectForm
        }).then(function(res) {
          console.log(res.data)
          that.data_li = res.data.user_list
          j = that.data_li.length
          //console.log('总条目数:'+j)
          if (j > 0) { //标识有信息返回
            for (i=0;i<j;i++) {
              that.data_li[i].picture = that.ahttp + that.data_li[i].picture
              that.data_li[i].order_img = that.ahttp_order + that.data_li[i].order_img
            }
          } else {
            that.$message.warning('数据为空,无法导出')
            return 404
          }
          //console.log('批次导出中')
          that.data_li.sort()  //排序
          const excelName = '画图批次导出'
          table2excel(column, that.data_li, excelName)
        })
      },
      print_sure(row) { //打印程序,打印之前需要确认
        var that = this
        if (row.print_status === '已打印') { //已经打印过了
          this.$confirm('已经打印过了,是否重复打印', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function (res) {
            if (res === 'confirm') {
              that.print_order(row)
            }
          })
        } else {
          that.print_order(row)
        }
      },
      print_order(row) {//点击打印按钮
        var that = this
        var date = new Date()
        var print_time = date.getMonth()+1+'-'+ date.getDate()
        const LODOP = getLodop()
        LODOP.PRINT_INITA(0, 0, 800, 1600, '打印条码')
        LODOP.NewPage()// 初始5
        LODOP.SET_PRINT_MODE('RESELECT_PRINTER', true)
        LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
        LODOP.SET_PRINT_PAGESIZE(1, 500, 400, '') // 设定纸张大小
        var name_len = row.order_name.length   //名字的长度
        if (name_len < 10 ){
          LODOP.SET_PRINT_STYLE("FontSize",12)   //订单名字字体加大
          //LODOP.SET_PRINT_STYLE('Alignment', 2)// 字体样式--居中
          LODOP.SET_PRINT_STYLE('HOrient', 2)// 字体样式--居中
          LODOP.ADD_PRINT_TEXT('14mm','5mm','43mm','5mm',row.order_name)  //订单名字
        } else {
          LODOP.SET_PRINT_STYLE("FontSize",8)   //订单名字字体加大
          LODOP.ADD_PRINT_TEXT('14mm','0mm','48mm','5mm',row.order_name)  //订单名字
          LODOP.SET_PRINT_STYLEA(0,"LineSpacing",'-4');  //文本行间距
        }
        LODOP.SET_PRINT_STYLE('HOrient', 0)// 字体样式--居中
        LODOP.SET_PRINT_STYLE('Alignment', 2)// 字体样式--居中
        LODOP.SET_PRINT_STYLE("FontSize",8)   //以下字体回归默认
        LODOP.ADD_PRINT_TEXT('1mm','2mm','12mm','2mm',row.draw_time.slice(5,10))  //画图时间
        LODOP.ADD_PRINT_TEXT('1mm','13mm','12mm','2mm',print_time)  //打印时间
        LODOP.ADD_PRINT_TEXT('1mm','26mm','14mm','2mm',row.salesman)  //业务员名字
        LODOP.ADD_PRINT_TEXT('1mm','36mm','14mm','2mm',this.user)  //打印者
        LODOP.ADD_PRINT_BARCODE('5mm','2mm','45mm','6mm','128A',row.order_code)  //条码
        LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
        LODOP.ADD_PRINT_TEXT('11mm','2mm','15mm','2mm',row.order_code.trim()) //ERP编号
        LODOP.ADD_PRINT_TEXT('11mm','17mm','35mm','2mm',row.item_name)//产品名称
        //LODOP.ADD_PRINT_TEXT('14mm','38mm','13mm','2mm',this.user)//打印账号
        LODOP.SET_PRINT_STYLE("FontSize",8)   //以下字体回归默认
        LODOP.SET_PRINT_STYLE('Alignment', 1)// 字体样式--靠左
        LODOP.ADD_PRINT_TEXT('15mm','41mm','4mm','2mm','合:')  //合数
        LODOP.ADD_PRINT_TEXT('15mm','44mm','8mm','2mm',row.total_num)  //合数数量
        LODOP.SET_PRINT_STYLE('Alignment', 2)// 字体样式--居中
        LODOP.ADD_PRINT_BARCODE('20mm','2mm','45mm','6mm','128A',row.id)
        LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
        LODOP.ADD_PRINT_TEXT('26.5mm','5mm','20mm','2mm',row.id)  //订单序号
        LODOP.ADD_PRINT_TEXT('26.5mm','25mm','20mm','2mm',row.wuliu) //物流
        LODOP.ADD_PRINT_TEXT('30.4mm','2mm','28mm','2mm',row.size) //链条
        LODOP.ADD_PRINT_TEXT('30.4mm','28mm','25mm','2mm',row.pack_method) //包装方式
        LODOP.ADD_PRINT_TEXT('33mm','2mm','50mm','5mm',row.note)  //备注
        LODOP.SET_PRINT_STYLEA(0,"LineSpacing",'0.1mm');  //文本行间距
        LODOP.SET_PRINTER_INDEXA('TSC TTP-244 Pro')// 选择打印机
        //LODOP.PREVIEW() //
        LODOP.PRINT() // 不预览\
        //打印点击后就更新打印状态
        this.$http.post('print_status/',{id:row.id,user:this.user}).then(function(res) {
          // console.log(res)
          if (res.data === 'OK') {
            that.order_list()// 刷新列表
          } else {
            that.$message.warning('后台数据解析异常,请与管理员联系')
          }
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
      handleSelectionChange(val) {//表格选中的行
        this.select_list = val //选中的批次列表
      },
      querySearchAsync_sku(queryString, cb) {
        this.$http.post('order_sku/', { serch: queryString }).then(({ data }) => {
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
      handleSelect_sku(item) {
        this.order_li[this.currentRowIndex].item_code = item.id
        this.order_li[this.currentRowIndex].item_name = item.name
        this.order_li[this.currentRowIndex].unit = item.unit
        this.order_li[this.currentRowIndex].skutype = item.type
        this.order_li[this.currentRowIndex].picture = item.imageUrl// 得到图片地址
      },
      draw_agin() {//重新画图
        var that = this
        if (that.select_list.length === 0 ){
          that.$message.warning('需要先选中明细行')
        } else {
          this.$confirm('将选中行提交给原画图者,重新画图?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function (res) {
            if (res === 'confirm') {
              that.$http.post('draw_agin/', { data:that.select_list })
                .then(function (res) {
                  if (res.data === 'OK') { // 执行删除成功时
                    that.$message.success('已经提交重新拉图')
                    that.order_list()// 刷新列表
                  } else {
                    that.$message.error('拉图失败')
                  }
                })
            }
          }).catch(function (res) {
            console.log('拉图失败')
            return res
          })
        }
      },
      update_print_status() { //更改打印状态
        var that = this
        if (that.select_list.length === 0 ){
          that.$message.warning('需要先选中明细行')
        } else {
          this.$confirm('将选中行状态改为未打印,上次的打印记录将清空?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function (res) {
            if (res === 'confirm') {
              that.$http.post('update_print_status/', { data:that.select_list })
                .then(function (res) {
                  if (res.data === 'OK') { // 执行删除成功时
                    that.$message.success('更改成功')
                    that.order_list()// 刷新列表
                  } else {
                    that.$message.error('更改失败')
                  }
                })
            }
          }).catch(function (res) {
            console.log('更改失败')
            return res
          })
        }
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
    },
    created() {
      this.order_list()
      this.keyCodeForEvent() //按钮监听函数
      this.user = window.sessionStorage.getItem('token')
      this.role_tree_list = window.sessionStorage.getItem('role_tree_list').split(',')// 读取缓存的权限列表
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
    margin-bottom: 15px;
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

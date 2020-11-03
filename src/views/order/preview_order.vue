<script src="../../router/index.js"></script>
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单预览</el-breadcrumb-item>
      <el-button size="mini" @click="close_order" style="float: left;margin-top: -5px">
        关闭
      </el-button>
    </el-breadcrumb>
    <el-card class="el-card">
      <!-- 用户列表区域 -->
      <el-table
        :data="order_li" size="mini"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'0px','white-space':pre-line}"
        :stripe="true"
        :highlight-current-row="true">
        <el-table-column type="index" />
        <el-table-column prop="order_code" label="ERP单号"></el-table-column>
        <el-table-column
          :label="' 类型 \n 生产级别'" prop="id">
          <template slot-scope="scope">
            <span>{{scope.row.order_type +'\n' + scope.row.order_level}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_code" label="编号"></el-table-column>
        <el-table-column prop="item_name" label="名称"></el-table-column>
        <el-table-column prop="skutype" label="分类"></el-table-column>
        <el-table-column label="产品图片" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="click" :title="scope.row.item_name" v-if="scope.row.picture"> <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="ahttp+scope.row.picture" target="_blank" title="查看最大化图片">
                <img :src="ahttp+scope.row.picture" style="width: 400px;height: 400px">
              </a>
              <img slot="reference" :src="ahttp+scope.row.picture" :lazy="true" style="width: 120px;height: 100px; cursor:pointer">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="words" label="字体"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="num" label="数量" ></el-table-column>
        <el-table-column prop="total_num" label="合数" ></el-table-column>
        <el-table-column prop="order_name" label="名字" ></el-table-column>
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
        <el-table-column
          :label="'物流\n 包装方式 '" prop="add">
          <template slot-scope="scope">
            <span>{{ scope.row.wuliu+'\n'}} {{scope.row.pack_method +'\n'}} </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="'链长 \n 风格'" prop="add">
          <template slot-scope="scope">
            <span> {{scope.row.size +'\n'}} {{scope.row.sku_style}}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户备注" prop="note" width="130px">
          <template slot-scope="scope">
            <span>{{scope.row.size+'\n'+scope.row.pack_method+'\n'+scope.row.note}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'preview_order',
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
      order_num:'',
      currentPage: 1, // 当前页
      pagesize: 10, // 每页显示行数
      total: 0, // 总计数量
      order_img: {
        order_name: '',
        item_name: '',
        id: '', // 明细表主键ID
        imgurl: ''
      },
    }
  },
  methods: {
    order_list() {
      var that = this
      that.order_num = that.$route.query.order
      this.$http.post('preview_order/', {
          page: this.currentPage,
          size: this.pagesize,
          order_num:that.order_num
        }).then(function(res) {that.order_li = res.data})
    },
    close_order() { // 关闭订单
      this.$router.back(-1)// 返回上一层
    },
    preview_order() { //订单预览界面
      this.$message.info('只会显示保存的内容')
      this.$router.push({ path: '/2-1-4', query: { order: this.addForm.order_code } })// 打开预览报表
    },
  },
  created() {
    this.order_list()
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

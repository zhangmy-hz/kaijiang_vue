<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <el-row
        :gutter="20"
        style="margin-top: -20px"
      >
        <el-col
          :span="7"
          class="el-row"
        >
          <el-input
            v-model="input"
            placeholder="输入单号/产品/分类搜索"
            clearable
            @input="order_list()"
            @clear="order_list"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="order_list"
            />
          </el-input>
        </el-col>
        <el-col
          class="el-row"
          :span="4"
        >
          <el-button
            type="primary"
            @click="addVisible = true"
          >
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="order_li"
        :border="true"
        :header-row-style="{'height': '20px'}"
        :row-style="{'height': '20px'}"
        :cell-style="{'padding':'7px'}"
        :stripe="true"
        :highlight-current-row="true"
      >
        <el-table-column type="index" />
        <el-table-column
          label="订单类型"
          prop="order_type"
        />
        <el-table-column
          label="等级"
          prop="order_level"
        />
        <el-table-column
          label="单号"
          prop="order_key"
        />
        <el-table-column
          label="客户单号"
          prop="order_code"
        />
        <el-table-column
          label="SKU编码"
          prop="item_code"
        />
        <el-table-column
          label="SKU名称"
          prop="item_name"
        />
        <el-table-column
          label="产品图片"
          prop="item_name"
        />
        <el-table-column
          label="分类"
          prop="skutype"
        />
        <el-table-column
          label="颜色"
          prop="color"
        />
        <el-table-column
          label="文字"
          prop="words"
        />
        <el-table-column
          label="数量"
          prop="num"
        />
        <el-table-column
          label="合数"
          prop="total_num"
        />
        <el-table-column
          label="金额"
          prop="amount"
        />
        <el-table-column
          label="物流"
          prop="wuliu"
        />
        <el-table-column
          label="链长"
          prop="lianchang"
        />
        <el-table-column
          label="客户备注"
          prop="note"
        />
        <el-table-column
          label="尺寸"
          prop="size"
        />
        <el-table-column
          label="订单日期"
          prop="create_date"
        />
        <el-table-column
          label="交货日期"
          prop="end_date"
        />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- -->
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="status_change(scope.row.name,scope.row.status,scope)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEditDialog(scope.row.name)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delete_user(scope.row.name)"
            />
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
export default {
  name: 'Production',
  data() {

  },
  created() {

  },
  methods: {
    order_list() {
      this.$http.post('order_list/', {
        page: this.currentPage,
        size: this.pagesize
      })
        .then(function (res) {
          this.order_li = res.data
        })
    }
  }
}
</script>

<style scoped>

</style>

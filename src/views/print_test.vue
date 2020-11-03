<template>
  <div>
        <table id="stTable" class="t2" border=1 align="center" style="width:95%">
          <th v-for="c in table.cols">{{c.text}}</th>
          <tr v-for="(d,index) in table.data" >
            <td v-for="c in table.cols">{{getdata(index,c.id)}}</td>
          </tr>
        </table>>
  </div>
</template>

<script>
export default {
  name: 'OrderUpdate',
  data() {
    return {
      table: {
        cols: ['1','2','3'],
        data: [{'1':'1','2':2,'3':3},
          {'1':'12','2':23,'3':33}
        ]
      },
      addVisible2: false, // 弹窗
      addVisible3: false, // 订单图片窗口
      order_num: '', // 本页订单号
      loading: true,
      currentRowIndex: '', // 记录当前表格现在的行
      // ahttp: 'http://127.0.0.1:8000/img?md5=', // 服务器地址
      ahttp: 'http://47.114.190.252:8888/img?md5=', // 服务器地址
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
          num: '',
          wuliu: '',
          pack_method: '',
          note: '',
          total_num: '',
          amount: 0, // 订单金额
          size: '',
          create_date: '',
          end_date: '',
          order_img: ''// 订单图片
        }
      ],
    }
  },
  created() {

  },
  methods: {
    getdata(index,id){
      return this.table.data[index][id];
    },
  }
}
</script>
.el-table tbody tr:hover>td { background-color: green;color: #000; }
<style scoped>
</style>

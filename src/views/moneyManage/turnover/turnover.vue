<style lang="less" scoped>

</style>
<template>
    <div>
        <Row>
          <DatePicker :value="dateval" @on-change="getDate" confirm format="yyyy-MM-dd" type="daterange" placeholder="支付时间" style="width: 200px"></DatePicker>
        <Button @click="searchfn">搜索</Button>
        <Button @click="canclefn" type="ghost" >取消</Button>
        </Row>
        <Row class="margin-top-10 tab minW">
            <Table :loading="tabload" size="small" stripe border :columns="columns" :data="dts" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="padding-left-10 taRit"></Page>
     </div> 
</template>
<script>
import util from "@/libs/util";
export default {
  data() { 
    return {
      tabload:true,
      total: 0,
      size: 18,
      page: 1,
      sta: 0,
      dateval:["",""],
      columns: [
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "单号",
          key: "order_no"
        },
        {
          title: "类型",
          key: "orderTypeStr"
        }, 
        {
          title: "项目",
          key: "projectName"
        },
        {
          title: "金额￥",
          key: "payamount"
        },
        {
          title: "支付时间",
          key: "paytime"
        },
        {
          title: "支付方式",
          key: "paywayStr"
        }
      ], 
      dts: [],
      mod: { showimg: false}
    };
  }, 
  created() {
    this.getData(); 
  }, 
  methods: { 
    getData() {
      let self = this,
        param = {
          startDate:this.dateval[0]?this.dateval[0]+' 00:00:00':'',//开始注册日期
          endDate:this.dateval[1]?this.dateval[1]+' 23:59:59':'',//结束注册日期
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("order.BusinessFlowWaterOrder",param,function(d) {
          if (d.code == 0) {
            self.dts = d.data.rows;
            self.total = d.data.total;
          }
        },
        self
      );
    },
    trim(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
    },
    handleView(url) {
      this.imgUrl = url;
      this.mod.showimg = true;
    },
    changePage(pageIndex) {
      this.page = pageIndex;
      this.getData();
    },
    searchfn() {
      this.page = 1;
      this.getData();
    },
    canclefn() {
      this.dateval=["",""];
      this.getData();
    },
    getDate(date) {
      this.dateval=date;
    }
  }
};
</script>

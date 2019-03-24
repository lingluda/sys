<style lang="less" scoped>

</style>
<template>
    <div>
        <Row v-if="sta==1"> 
        <Input v-model="searchDate.usermobile" placeholder="手机号查询" style="width: 160px" />
          <DatePicker :value="dateval" @on-change="getDate" confirm format="yyyy-MM-dd" type="daterange" placeholder="支付日期" style="width: 200px"></DatePicker>
        <Select v-model="searchDate.payway" placeholder="支付方式" style="width: 160px">
              <!-- <Option value="0">未知</Option> -->
              <Option value="1">支付宝</Option>
              <Option value="2">微信</Option>
              <!-- <Option value="3">储值卡</Option>
              <Option value="4">现金</Option>
              <Option value="5">童乐币</Option>
              <Option value="6">月卡</Option>
              <Option value="7">免费</Option> -->
          </Select>
        <Button @click="searchfn">搜索</Button>
        <Button @click="canclefn" type="ghost" >取消</Button>
        </Row>
        <Row class="margin-top-10 tab minW">
            <RadioGroup v-model="sta" type="button" class="margin-top-10 margin-bottom-10" size="large" @on-change="changeSta">
                <Radio label="1" value="1"><span>已支付</span></Radio>
                <Radio label="0" value="0"><span>未支付</span></Radio>
            </RadioGroup>
            <Table :loading="tabload" size="small" stripe border :columns="mycolumns" :data="dts" class="bgW"></Table>
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
      sta:1,
      searchDate: {
        usermobile:'', //手机号
        payway:'', //支付方式
      },
      dateval:["",""],
      mycolumns: [],
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
          title: "套餐",
          key: "meal"
        },
        {
          title: "手机号码",
          key: "usermobile"
        },
        {
          title: "订单金额￥",
          key: "payamount"
        },
        {
          title: "下单时间",
          key: "createdon"
        }
      ], 
      dts: [],
      mod: { showimg: false}
    };
  }, 
  created() {
    this.getData();
    this.getcolumns(1);
  }, 
  methods: {
    getcolumns(typ) {
      let tcol = this.columns;
      if (typ == 1) {
         this.mycolumns=tcol.concat([{
            title: "支付时间",
          key: "paytime"
        },{
            title: "支付方式",
          key: "paywayStr"
        }]);
      } else{
        this.mycolumns =tcol;
      }
    },
    getData() {
      let self = this,
        param = {
          status:this.sta,//0：未支付 1：已支付
          usermobile: this.searchDate.usermobile,
          payway: this.searchDate.payway || -1, //省份
          startDate:this.dateval[0]?this.dateval[0]+' 00:00:00':'',//开始支付时间
          endDate:this.dateval[1]?this.dateval[1]+' 23:59:59':'',//结束支付时间
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("order.RechargeOrder",param,function(d) {
          if (d.code == 0) {
            self.dts = d.data.rows;
            self.total = d.data.total;
          } 
        },
        self
      );
    },
    changeSta() {
        this.tabload=true,
      this.getcolumns(this.sta);
      this.page = 1;
      this.getData();
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
      this.searchDate= {
        usermobile:'', //手机号
        payway:'', //支付方式
      },
      this.dateval=["",""];
      this.getData();
    },
    getDate(date) {
      this.dateval=date;
    }
  }
};
</script>

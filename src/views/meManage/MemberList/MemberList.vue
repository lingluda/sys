<style lang="less" scoped>

</style>
<template>
    <div>
        <Row> 
        <Input v-model="searchDate.mobile" placeholder="手机号查询" style="width: 160px"/>
        <DatePicker :value="dateval" @on-change="getDate" confirm format="yyyy-MM-dd" type="daterange" placeholder="注册日期" style="width: 200px"></DatePicker> 
        <Select v-model="searchDate.isMonthsCardUser" placeholder="是否月卡用户" style="width: 160px">
            <Option value="-1">全部</Option>
            <Option value="0">否</Option>
            <Option value="1">是</Option>
        </Select>
        <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button>
<Modal v-model="mod.costlist" :title="costTit" width="1100">
    <Table size="small" stripe border :columns="motab" :data="cost.costData" class="bgW"></Table> 
    <div slot="footer">
        <Page :total="cost.total" :current="cost.page" :page-size="cost.size" size="small" simple @on-change="changePageCost"></Page>
    </div>
</Modal>
<Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
    <img :src="imgUrl" class="fulWidth">
</Modal> 
        </Row>
        <Row class="margin-top-10 tab minW"> 
            <Table :loading="tabload" size="small" stripe border :columns="columns" :data="dts" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="taRit"></Page>
     </div> 
</template>
<script>
import util from "@/libs/util";
export default {
  data() { 
    return { 
      imgUrl: "",
      costTit:'充值记录',
      act:'',
      cost:{curId:'',size:10,page:1,total:0,costData:[]},
      tabload:true,
      total: 0,
      size: 12,
      page: 1,
      searchDate: {
        mobile: "",
        isMonthsCardUser:''
      },
      dateval:["",""],
      columns: [
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "手机号码",
          key: "mobile"
        },
        {
          title: "性别",
          key: "sex"
        },
        {
          title: "是否月卡用户",
          key: "isMonthsCardUser"
        },
        {
          title: "注册日期",
          key: "registertime"
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div",[
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.costTit='充值记录';
                      this.cost.curId=params.row.memid;
                      this.motab=[
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "单号",
          key: "order_no"
        },
        {
          title: "充值套餐",
          key: "meal"
        },
        {
          title: "金额(￥)",
          width: 100,
          key: "payamount"
        },
        {
          title: "下单时间",
          key: "createdon"
        },
        {
          title: "支付时间",
          key: "paytime"
        },
        {
          title: "支付方式",
          width: 100,
          key: "paywayStr"
        }
      ];
                      this.cost.page=1;
                      this.act="order.MemRechargeRecord";
                      this.getcost();
                      this.mod.costlist = true;
                    }
                  }
                },
                "充值记录"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.costTit='使用记录';
                      this.cost.curId=params.row.memid;
                      this.motab=[
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "单号",
          key: "order_no"
        },
        {
          title: "门店",
          key: "mer_name"
        },
        {
          title: "设备编号",
          key: "number"
        },
        {
          title: "金额(￥)",
          width: 100,
          key: "payamount"
        },
        {
          title: "使用时间",
          key: "paytime"
        },
        {
          title: "支付方式",
          width: 100,
          key: "paywayStr"
        }
      ];
                      this.cost.page=1;
                      this.act="order.MemUsingRecord";
                      this.getcost();
                      this.mod.costlist = true;
                    }
                  }
                },
                "使用记录"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.costTit='月卡购买记录';
                      this.cost.curId=params.row.memid;
                      this.motab=[
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "单号",
          width: 150,
          key: "order_no"
        },
        {
          title: "门店",
          key: "mer_name"
        },
        {
          title: "月卡",
          key: "monthsCard"
        },
        {
          title: "金额(￥)",
          key: "payamount"
        },
        {
          title: "下单时间",
          width: 150,
          key: "createdon"
        },
        {
          title: "支付时间",
          width: 150,
          key: "paytime"
        },
        {
          title: "支付方式",
          width: 100,
          key: "paywayStr"
        }
      ];
                      this.cost.page=1;
                      this.act="order.MemBuyMonthsCardRecord";
                      this.getcost();
                      this.mod.costlist = true;
                    }
                  }
                },
                "月卡购买记录"
              )
            ]);
          }
        }
      ],
      motab:[],
      formValidate: {
        dpid:'',
        status:0,
        deal_info:''
      },
      ruleValidate: {
        status: [
          {
            required: true,
            message: "请选择当前状态"
          }
        ], 
      }, 
      dts: [],
      mod: { costlist: false, showimg: false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self=this,param={
          mobile: this.trim(self.searchDate.mobile),//姓名
          isMonthsCardUser:self.searchDate.isMonthsCardUser||-1,
          startRegisterTime:this.dateval[0]?this.dateval[0]+' 00:00:00':'',//开始注册日期
          endRegisterTime:this.dateval[1]?this.dateval[1]+' 23:59:59':'',//结束注册日期
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
      } 
      util.ajaxY("member.MemberList",param,function(d){
          if (d.code == 0) {
              self.dts = d.data.rows;
              self.total = d.data.total;
          }
      },self);
    },
    getcost(){
      let self=this,param={
          userid: this.cost.curId,
          pageIndex: this.cost.page, //页码
          pageSize: this.cost.size //每页条数
      }
      util.ajaxY(self.act,param,
        function(d) {
          if (d.code == 0) {
            self.cost.costData = d.data.rows;
            self.cost.total = d.data.total;
          }
        },
        self
      );
    },
    trim(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
    },
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "device.FailureHandling",
            self.formValidate,
            function(d) {
              if (d.code == 0) {
                self.mod.add = false;
                self.getData();
              }
            },
            self
          );
        }
      });
    }, 
    handleView(url) {
      this.imgUrl = url;
      this.mod.showimg = true;
    },
    changePage(pageIndex) {
      this.page = pageIndex;
      this.getData();
    },
    changePageCost(pageIndex) {
      this.cost.page = pageIndex;
      this.getcost();
    },
    searchfn() {
      this.page = 1;
      this.getData();
    },
    canclefn() {
      this.searchDate = {
        mobile: "",
        isMonthsCardUser:''
      };
      this.dateval=["",""];
      this.getData();
    },
    getDate(date) {
      this.dateval=date;
    },
  }
};
</script>

 <style lang="less" scoped>
.borb {
  padding: 10px 0px;
}
</style>
<template>
    <div>
        <Row> 
        <Input v-model="searchDate.mer_name" placeholder="运营商查询" style="width: 160px" />
          <DatePicker :value="dateval" @on-change="getDate" confirm format="yyyy-MM-dd" type="daterange" :placeholder="sta==0?'使用日期':'打款日期'" style="width: 200px"></DatePicker>
        <Button @click="searchfn">搜索</Button>
        <Button @click="canclefn" type="ghost" >取消</Button> 
        <Button v-if="sta==0" @click="payMoney" style="margin-left:30px;">打款</Button>
        <Button v-if="sta==0" @click="exportData">导出打款列表</Button>
        <!-- <Button v-if="sta==0" @click="canclefn">导入已打款数据</Button> -->
        <Button v-if="sta==1" @click="exportData2">导出列表</Button>
        <Modal  title="打款" v-model="mod.payMoney">
    <Row class="borb">
        <Col span="4">运营商名称：</Col>
        <Col span="20">{{payData.mer_name}}</Col>
    </Row>
    <Row class="borb">
        <Col span="4">打款金额：</Col>
        <Col span="20">{{payData.total}}元</Col>
    </Row>
    <Row class="borb">
        <Col span="4">收款银行：</Col>
        <Col span="20">{{payData.bank_name}}</Col>
    </Row>
    <Row class="borb">
        <Col span="4">银行卡号：</Col>
        <Col span="20">{{payData.bank_no}}</Col>
    </Row>
    <Row class="borb">
        <Col span="4">持卡人姓名：</Col>
        <Col span="20">{{payData.bank_user_name}}</Col>
    </Row>
    <Row class="borb">
        <Col span="4">所在省市：</Col>
        <Col span="20">{{payData.bank_province}}{{payData.bank_city}}</Col>
    </Row>
    <div slot="footer">
      <Button type="info" size="large" @click="contrPayfn">确定打款</Button>
    </div>
</Modal>
<Modal v-model="mod.payDet" title="款项明细" width="1100">
    <Table size="small" stripe border :columns="payDettab" :data="paydt.data" class="bgW"></Table> 
    <div slot="footer">
        <Page :total="paydt.total" :current="paydt.page" :page-size="paydt.size" size="small" simple @on-change="modChangePage"></Page>
    </div>
</Modal>
        </Row>
        <Row class="tab">
            <RadioGroup v-model="sta" type="button" class="margin-top-10 margin-bottom-10" size="large" @on-change="changeSta">
                <Radio label="0" value="0"><span>未打款</span></Radio>
                <Radio label="1" value="1"><span>已打款</span></Radio>
            </RadioGroup>
            <!-- <Table :loading="tabload" size="small" stripe border :columns="mycolumns" :data="dts" class="bgW"></Table> -->
            <Table :loading="tabload" ref="tabdata" size="small" stripe border :columns="mycolumns" :data="dts" @on-select="getsel" @on-select-all="getsel" @on-selection-change="getsel" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="padding-left-10 taRit"></Page>
     </div> 
</template>
<script>
import util from "@/libs/util";
import Cookies from 'js-cookie';
export default {
  data() { 
    return {
      tabload:true,
      total: 0,
      size: 16,
      page: 1,
      sta: 0,
      paydt:{curId:'',size:10,page:1,total:0,data:[]},
      payDettab:[
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "单号",
          width:150,
          key: "order_no"
        },
        {
          title: "设备编号",
          key: "number"
        },
        {
          title: "类型",
          key: "orderTypeStr"
        },
        {
          title: "支付方式",
          key: "paywayStr"
        },
        {
          title: "金额",
          key: "payamount"
        },
        {
          title: "提成比例",
          key: "commisRate"
        },
        {
          title: "提成金额",
          key: "remitAmount"
        },
        {
          title: "支付时间",
          width:150,
          key: "paytime"
        }
      ],
      selData:[],
      searchDate: {
        mer_name:'', //门店
      },
      dateval:["",""],
      mycolumns: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: "#",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "单号",
          width:150,
          key: "order_no"
        },
        {
          title: "运营商名称",
          width:120,
          key: "mer_name"
        },
        {
          title: "负责区域",
          width:150,
          key: "chargeArea"
        },
        {
          title: "门店",
          width:120,
          key: "shopName"
        },
        {
          title: "设备编号",
          width:90,
          key: "number"
        },
        {
          title: "类型",
          width:90,
          key: "orderTypeStr"
        },
        {
          title: "订单金额",
          width:90,
          key: "payamount"
        },
        {
          title: "提成比例",
          width:100,
          key: "commissionRatio"
        },
        {
          title: "提成金额",
          width:120,
          key: "remit_amount"
        },
        {
          title: "使用时间",
          width:160,
          key: "createdon"
        },
        {
          title: "支付方式",
          width:100,
          key: "paywayStr"
        },
        {
          title: "收款银行",
          width:120,
          key: "bank_name"
        },
        {
          title: "银行卡号",
          width:170,
          key: "bank_no"
        },
        {
          title: "持卡人姓名",
          width:100,
          key: "bank_user_name"
        },
        {
          title: "银行所在省市",
          width:120,
          key: "bankArea"
        },
        {
          title: "状态",
          width:120,
          key: "remitStatusStr"
        },
        {
          title: "打款时间",
          width:120,
          key: "remitTime"
        },
        {
          title: "打款金额(￥)",
          width:120,
          key: "remitAmount"
        },
        {
          title: "打款人员",
          key: "remitPersonnel"
        },
        {
          title: "操作",
          width: 180,
          render: (h, params) => {
            return h("div", [
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
                      this.mod.payDet = true;
                      this.paydt.curId=params.row.orid;
                      this.paydt.page = 1;
                      this.info();
                    }
                  }
                },
                "打款明细"
              )
              // ,
              // h(
              //   "Button",
              //   {
              //     props: {
              //       size: "small"
              //     },
              //     on: {
              //       click: () => {
              //         //this.mod.add = true;
              //         this.paydt.curId=params.row.orid;
              //         this.retraction();
              //       }
              //     }
              //   },
              //   "撤回打款"
              // )
            ]);
          }
        }
      ], 
      dts: [],
      payData:{},
      mod: { showimg: false,payMoney:false,payDet:false}
    };
  }, 
  created() {
    this.getData();
    this.getcolumns(0);
  }, 
  methods: {
    getcolumns(typ) {
      let tcol = this.columns;
      if (typ == 0) {
         this.mycolumns=[
          tcol[0],
          tcol[1],
          tcol[2],
          tcol[3],
          tcol[4],
          tcol[5],
          tcol[6],
          tcol[7],
          tcol[8],
          tcol[9],
          tcol[10],
          tcol[11],
          tcol[12],
          tcol[13],
          tcol[14],
          tcol[15],
          tcol[16] 
        ];
      } else{
        this.mycolumns=[
          tcol[1],
          {
          title: "运营商名称",
          key: "mer_name"
        },
        {
          title: "收款银行", 
          key: "bank_name"
        },
        {
          title: "银行卡号", 
          key: "bank_no"
        },
        {
          title: "持卡人姓名", 
          key: "bank_user_name"
        },
        {
          title: "所在省市",
          key: "bankArea"
        },
        
          {
          title: "打款时间", 
          key: "remitTime"
        },
        {
          title: "打款金额(￥)", 
          key: "remitAmount"
        },
        {
          title: "打款人员",
          key: "remitPersonnel"
        },
          tcol[21]
        ];
      }
    },
    getData() {
      let self = this,
        param = {
          status:this.sta,//0：未打款 1：已打款
          mer_name: this.trim(this.searchDate.mer_name), //门店
          startDate:this.dateval[0]?this.dateval[0]+' 00:00:00':'',//开始注册日期
          endDate:this.dateval[1]?this.dateval[1]+' 23:59:59':'',//结束注册日期
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("order.OperatorEarningsOrder",param,function(d) {
          if (d.code == 0) {
            self.dts = d.data.rows;
            self.total = d.data.total;
          }
        },
        self
      );
    },
    getsel(selection){
      let self=this;
      self.selData=selection;
    },
    info(){
      let self = this,
        param = {
          remitType:1,//类型（0：门店 1：运营商）
          orid:this.paydt.curId,
          pageIndex: this.paydt.page, //页码
          pageSize: this.paydt.size //每页条数
        };
      util.ajaxY("order.MakePaymentDetail",param,function(d) {
          if (d.code == 0) {
            self.paydt.data = d.data.rows;
            self.paydt.total = d.data.total;
          }
        },
        self
      );
    },
    retraction(){
      let self = this,
        param = {
          remitType:1,//类型（0：门店 1：运营商）
          orid:this.paydt.curId
        };
      util.ajaxY("order.RetractionMakePayment",param,function(d) {
          if (d.code == 0) {
            self.$Message.info("撤回成功");
          }
        },
        self
      );
    },
    payMoney(){
      let len=this.selData.length,self=this;
      if(len<1){
        this.$Message.error("请先选择运营商");
        return false;
      }
      let opertateid=this.selData[0].opertateid,total=0,oids=[],commis_rate=0;
      for (var i=0;i<len;i++){
        if(self.selData[i].opertateid!=opertateid){
          this.$Message.error("请选择同一个运营商的订单进行打款");
          return false;
        }else{
          total+=self.selData[i].remit_amount*1;
          oids.push(self.selData[i].orderid);
        } 
      }
      commis_rate=this.selData[0].commissionRatio.split('%')[0];
      commis_rate=(commis_rate*1).toFixed(2);
      this.payData=this.selData[0];
      this.payData.total=total.toFixed(2);
      this.payData.oids=oids.join();
      this.payData.commis_rate=commis_rate;
      this.mod.payMoney = true;
    },
    contrPayfn(){
      let self = this,
        param = {
          remitType:1,  //类型（0：门店 1：运营商）
          shId:this.payData.opertateid+'',  //门店/运营商id拼接字符串
          orderId:this.payData.oids,  //订单id拼接字符串
          objectid:this.payData.opertateid+'',  //门店id或运营商id
          bank_name:this.payData.bank_name,  //收款银行
          bank_no:this.payData.bank_no,  //银行卡号
          bank_user_name:this.payData.bank_user_name,  //持卡人姓名
          bank_province:this.payData.bank_province,  //所在省份
          bank_city:this.payData.bank_city,  //所在城市
          remit_amount:this.payData.total,  //打款合计
          commis_rate:this.payData.commis_rate,  //提成比例
          createdby:Cookies.get('user')  //打款人员
        };
      util.ajaxY("order.MakePayment",param,function(d) {
          if (d.code == 0) {
            self.mod.payMoney = false;
            self.$Message.info("打款成功");
            self.getData();
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
    modChangePage(pageIndex) {
      this.paydt.page = pageIndex;
      this.info();
    },
    searchfn() {
      this.selData=[];
      this.page = 1;
      this.getData();
    },
    canclefn() {
      this.selData=[];
      this.searchDate= {
        mer_name:'', //门店
      },
      this.dateval=["",""];
      this.getData();
    },
    getDate(date) {
      this.dateval=date;
    },
    exportData() {
      let self = this,arr=self.exdts;
      for(var i=0;i<arr.length;i++){
        arr[i].number='="'+arr[i].number+'"';
      }
      this.$refs.tabdata.exportCsv({
        filename: "运营商打款列表.csv",
        columns: self.mycolumns.slice(2, 17),
        data: arr
      });
    },
    exportData2() {
      let self = this;
      this.$refs.tabdata.exportCsv({
        filename: "已打款.csv",
        columns: self.mycolumns.slice(1, 9),
        data: self.dts
      });
    }
  },
  computed: {  
     exdts: function () {  
         var obj={};  
         obj=JSON.parse(JSON.stringify(this.dts)); //this.templateData是父组件传递的对象  
         return obj  
    }  
 }
};
</script>

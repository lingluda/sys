<style lang="less" scoped>

</style>
<template>
    <div>
        <Row v-if="sta==1"> 
        <Input v-model="searchDate.mer_name" placeholder="门店查询" style="width: 160px" />
        区域:
          <Select v-model="areasVal.province" style="width:140px" :label-in-value="true" @on-change="getforcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="areasVal.city" style="width:140px" :label-in-value="true" @on-change="getreg">
              <Option v-for="item in areas.forcity" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="areasVal.area" style="width:140px" :label-in-value="true" @on-change="getregsel">
              <Option v-for="item in areas.reg" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <DatePicker :value="dateval" :editable='false' @on-change="getDate" confirm format="yyyy-MM-dd" type="daterange" placeholder="支付日期" style="width: 200px"></DatePicker>
        <Button @click="searchfn">搜索</Button>
        <Button @click="canclefn" type="ghost" >取消</Button>
        </Row>
        <Row class="tab">
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
      areas: { pr: [], forcity: [], reg: []},
      tabload:true,
      total: 0,
      size: 16,
      page: 1,
      sta: 1,
      areasVal: {
        province:'', //省份
        city:'', //城市
        area:'', //区域
      },
      searchDate: {
        mer_name:'', //门店
        province:'', //省份
        city:'', //城市
        area:'', //区域
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
          title: "门店",
          key: "mer_name"
        }, 
        {
          title: "地址",
          key: "mer_adress"
        },
        {
          title: "设备编号",
          key: "number"
        },
        {
          title: "手机号码",
          key: "usermobile"
        },
        {
          title: "金额",
          key: "payamount"
        },
        {
          title: "下单时间",
          key: "paytime"
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
            title: "支付方式",
          key: "paywayStr"
        }]);
        this.mycolumns[7]={
          title: "支付时间",
          key: "paytime"
        }
      } else{
        this.mycolumns =tcol;
      }
    },
    getData() {
      let self = this,
        param = {
          status:this.sta,//0：未支付 1：已支付
          mer_name: this.searchDate.mer_name, //门店
          province: this.searchDate.province, //省份
          city: this.searchDate.city, //城市
          area: this.searchDate.area, //区域
          startDate:this.dateval[0]?this.dateval[0]+' 00:00:00':'',//开始注册日期
          endDate:this.dateval[1]?this.dateval[1]+' 23:59:59':'',//结束注册日期
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("order.UsingRecordOrder",param,function(d) {
          if (d.code == 0) {
            self.dts = d.data.rows;
            self.total = d.data.total;
          }
          if (!self.areas.pr.length) {
            self.getarea();
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
    getarea() {
      let self = this;
      util.ajaxY(
        "Common.GetAreaList",
        { parentid: 0, level: 1 },
        function(d) {
          if (d.code == 0) {
            self.areas.pr = d.data;
          }
        },
        self
      );
    },
    getforcitys(obj) {
      this.searchDate.province=obj.label;
      //省：level=1，城市：level=2，区：level=3
      let self = this;
      if (obj.value) {
        util.ajaxY(
          "Common.GetAreaList",
          { parentid: obj.value, level: 2 },
          function(d) {
            if (d.code == 0) {
              self.areas.forcity = d.data;
            }
          },
          self
        );
      }
    },
    getreg(obj) {
      this.searchDate.city=obj.label;
      let self = this;
      if (obj.value) {
        util.ajaxY(
          "Common.GetAreaList",
          { parentid: obj.value, level: 3 },
          function(d) {
            if (d.code == 0) {
              self.areas.reg = d.data;
            }
          },
          self
        );
      } else {
        self.areas.reg = [];
      }
    },
    getregsel(obj) {
      this.searchDate.area=obj.label;
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
      this.areasVal= { 
        province:'', //省份
        city:'', //城市
        area:'', //区域
      },
      this.areas.forcity=[],this.areas.reg=[];
      this.searchDate= {
        mer_name:'', //门店
        province:'', //省份
        city:'', //城市
        area:'', //区域
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

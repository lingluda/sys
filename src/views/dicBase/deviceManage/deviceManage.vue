<style lang="less" scoped>

</style>
<template>
    <div>
        <Row> 
        <Input v-model="searchDate.number" placeholder="设备编号查询" style="width: 160px" />
        <Button @click="searchfn">搜索</Button>
        <Button @click="canclefn" type="ghost" >取消</Button>
        <Button @click="addoper()" style="margin-left:30px;">新增</Button>
        <Button @click="bindbt()">批量绑定门店</Button>
        <Button @click="downewfn">下载设备二维码</Button>
        <a href="/static/DeviceImport.xlsx" class="ivu-btn" download="DeviceImport">导出模板</a>
    <Upload
    :show-upload-list="false" 
    :on-success="handleSuccess"
    :format="['xlsx','xls']"
    :on-format-error="handleFormatError"
     action="System/ImportDevice" style="display: inline-block;">
        <Button>导入数据</Button>
    </Upload>
<Modal v-model="mod.add" :title="modTit" width="380">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
      <FormItem label="设备编号：" prop="number">
          <Input v-model="formValidate.number"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal>
<Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
    <img :src="imgUrl" class="fulWidth">
</Modal>
<Modal title="绑定门店" v-model="mod.bind" width="580">
  <Form ref="formBind" :model="formBind" :rules="ruleBind" :label-width="108">
      <FormItem label="区域：">
          <Select v-model="formBind.for_provinceid" style="width:140px" @on-change="getforcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="formBind.for_cityid" style="width:140px" @on-change="getreg">
              <Option v-for="item in areas.forcity" :value="item.id" :key="item.
              id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="formBind.for_areaid" style="width:140px" @on-change="getStores">
              <Option v-for="item in areas.reg" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
      </FormItem>
      <FormItem label="门店：" prop="shops_id">
          <p v-if="!formBind.store.length">{{formBind.hastore}}</p>
          <RadioGroup v-else v-model="formBind.shops_id">
            <Radio v-for="item in formBind.store" :label="item.shid" :key="item.shid">
                <span>{{ item.name }}</span>
            </Radio>
          </RadioGroup>
      </FormItem>
  </Form>
  <div slot="footer">
      <Button type="info" size="large"  @click="contrbindfn">确定</Button>
  </div>
</Modal> 
<Modal v-model="mod.unbind" width="360">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>解绑门店</span>
    </p>
    <div style="text-align:center">
        <p>您确定要给当前设备 {{curdt.number}} 解绑门店吗？</p> 
    </div>
    <div slot="footer">
        <Button type="error" size="large" long @click="unbindfn">确定</Button>
    </div>
</Modal> 
        </Row>
        <Row class="margin-top-10 tab"> 
            <Table :loading="tabload" size="small" stripe border :columns="columns" :data="dts" @on-select="getsel" @on-select-all="getsel" @on-selection-change="getsel" class="bgW"></Table>
        </Row>
        <Page :total="total" :page-size="size" :show-total="true" :current="page" @on-change="changePage" class="padding-left-10 taRit"></Page>
     </div> 
</template>
<script>
import util from "@/libs/util";
export default {
  data() { 
    return {
      areas: { pr: [], forcity: [], reg: [], city: [] },
      modTit:'',
      imgUrl: "",
      curdt:{number:''},//当前设备
      tabload:true,
      total: 0,
      size: 17,
      page: 1,
      searchDate: {
        number: ""
      },
      columns: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "设备编号",
          key: "number"
        },
        {
          title: "所属门店",
          key: "shopName"
        }, 
        {
          title: "地址",
          key: "address"
        },
        {
          title: "创建时间",
          key: "createdon"
        },
        {
          title: "状态",
          key: "isEnableStr"
        },
        {
          title: "操作",
          render: (h, params) => {
            let btsArr = [
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
                      //this.mod.add = true; 
                      this.addoper(params.row);
                    }
                  }
                },
                "编辑"
              )
            ];
            if(params.row.is_enable){
              btsArr.push(h("span","已取消"));
            }else if(!params.row.shops_id){
              btsArr.push(
                  h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: 'warning',
                    },
                    on: {
                      click: () => { 
                        this.curdt=params.row;
                        this.bindbt('b');

                      }
                    }
                  },
                  "绑定门店"
                )
              );
            }else{
              btsArr.push(
                  h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    on: {
                      click: () => { 
                        this.curdt=params.row;
                        this.mod.unbind = true;
                      }
                    }
                  },
                  "解绑门店"
                )
              ); 
            }
            return h("div",btsArr);
          }
        }
      ],
      formValidate: {
        deid:0,//0：新增，大于0：编辑
          number:''},
      ruleValidate: {
        number: [
          {
            required: true,
            message: "填写设备编号"
          }
        ], 
      },
      formBind: {
        for_provinceid: '',
        for_cityid: "",
        for_areaid: "",
        hastore:'请先选择区域',
        selData:[],
        store:[],
        shops_id:''
      },
      ruleBind: {
        shops_id: [
          {
            required: true,
            message: "请选择门店"
          }
        ]
      },
      dts: [],
      mod: { add: false, showimg: false, set: false,unbind:false,bind:false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self = this,
        param = {
          number:self.searchDate.number,//设备编号
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("/sys/product/list",param,function(d) {
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
    getforcitys(value) {
      //省：level=1，城市：level=2，区：level=3
      let self = this;
      if (value) {
        util.ajaxY(
          "Common.GetAreaList",
          { parentid: value, level: 2 },
          function(d) {
            if (d.code == 0) {
              self.areas.forcity = d.data;
            }
          },
          self
        );
      }
    },
    getcitys(value) {
      //省：level=1，城市：level=2，区：level=3
      let self = this;
      if (value) {
        util.ajaxY(
          "Common.GetAreaList",
          { parentid: value, level: 2 },
          function(d) {
            if (d.code == 0) {
              self.areas.city = d.data;
            }
          },
          self
        );
      }
    },
    getreg(value) {
      let self = this;
      if (value) {
        util.ajaxY(
          "Common.GetAreaList",
          { parentid: value, level: 3 },
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
    trim(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
    },
    addoper(det) {
      if(det){
        this.modTit='编辑';
        this.formValidate={
          deid:det.deid,//0：新增，大于0：编辑
          number:det.number
        };
      }else{
        this.modTit='新增';
        this.$refs['formValidate'].resetFields();
        this.formValidate={
          deid:0,//0：新增，大于0：编辑
          number:''
        };
      }
      this.mod.add = true;
    },
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "device.AddDevice",
            self.formValidate,
            function(d) {
              if (d.code == 0) {
                self.mod.add = false;
                self.$Message.info('成功');
                self.getData();
              }
            },
            self
          );
        }
      });
    },
    getsel(selection){
      let self=this;
      self.formBind.selData=selection;
    },
    bindbt(s){
      if(!s){
        let len=this.formBind.selData.length;
        if(len<1){
          this.$Message.error("请先选择设备");
          return false;
        }
      }
      this.formBind.for_provinceid='';
      this.formBind.for_cityid='';
      this.formBind.for_areaid='';
      this.formBind.hastore='请先选择区域';
      this.mod.bind = true;
    },
    downewfn(){
      let len=this.formBind.selData.length;
      if(len<1){
        this.$Message.error("请先选择设备");
        return false;
      }
      let self=this,deIds=[]; 
      for(let i=0;i<len;i++){
          deIds[i]=this.formBind.selData[i].deid;
      }
      deIds=deIds.join(); 
      let param={
        deIds:deIds,
        timestamp:Date.parse(new Date())
      };
      //创建隐藏表单下载后台zip二维码
      let ewdownform=document.getElementById('ewdownform');
      if(ewdownform){
        ewdownform.getElementsByTagName('input')[0].setAttribute("value",JSON.stringify(param));
        ewdownform.submit();
      }else{
        let turnForm = document.createElement("form");
          turnForm.setAttribute("id","ewdownform");
          document.body.appendChild(turnForm);
          turnForm.method = 'post';
          turnForm.action = '/service/api/'; 
          turnForm.target = '_blank'; 
      let dat = document.createElement("input");
          dat.setAttribute("name","data");
          dat.setAttribute("type","hidden");
          dat.setAttribute("value",JSON.stringify(param));
      let ac = document.createElement("input");
          ac.setAttribute("name","action");
          ac.setAttribute("type","hidden");
          ac.setAttribute("value",'device.DownloadQrCode');
          turnForm.appendChild(dat);
          turnForm.appendChild(ac);
          turnForm.submit(); 
      }
    },
    getStores(value) {
      let self = this;
      self.formBind.store=[];
      if (value) {
        let param = {
          type:0,//0门店 1运营商
          for_provinceid: this.formBind.for_provinceid || 0, //省份
          for_cityid: this.formBind.for_cityid || 0, //城市
          for_areaid: this.formBind.for_areaid || 0, //区域
          pageIndex: 1, //页码
          pageSize: 999 //每页条数
        };
        util.ajaxY("shop.OperatorList",param,function(d) {
            if (d.code == 0) {
              if(!d.data.rows.length){
                self.formBind.hastore='该区域暂无门店';
              }else{
                self.formBind.store = d.data.rows;
              }
            }
          },
          self
        ); 
      }
    },
    contrbindfn(){
      this.$refs.formBind.validate(valid => {
        if (valid) {
          let self=this,len=this.formBind.selData.length,deIds=[];
          if(!len){
            deIds=self.curdt.deid;
          }else{
            for(let i=0;i<len;i++){
                deIds[i]=this.formBind.selData[i].deid;
            }
            deIds=deIds.join();
          }
          let param={
            deIds:deIds,
            shops_id:self.formBind.shops_id
          };
          util.ajaxY("device.BindShops",param,function(d) {
              if (d.code == 0) { 
                self.mod.bind = false;
                self.$Message.info("绑定成功");
                self.getData();
              }
            },
            self
          );
        }
      });
    },
    unbindfn(){
      let self=this;
      util.ajaxY(
        "device.UnBindShop",
       {deid:self.curdt.deid},
        function(d) {
          if (d.code == 0) {
            self.mod.unbind = false;
            self.getData();
          }
        },
        self
      );
    },
    handleSuccess(res, file) {
      if(res.code==0){
        this.$Message.info("导入成功"); 
      }else{
        this.$Message.info(res.msg); 
      }
      this.page=1;
      this.getData();
    },
    handleFormatError(file) {
      this.$Message.error("格式错误");
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
      this.formBind.selData=[];
      this.page = 1;
      this.getData();
    },
    canclefn() {
      this.formBind.selData=[];
      this.searchDate = {
        number: ""
      };
      this.getData();
    }
  }
};
</script>

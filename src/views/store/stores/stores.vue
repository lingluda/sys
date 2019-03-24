<style lang="less">
    @import 'upload.less';
    #allmap div.anchorBL{display: none;}
</style>
<template>
    <div>
        <Row> 
        <Input v-model="searchDate.carriersName" placeholder="运营商名称查询" style="width: 160px" />
        <Input v-model="searchDate.name" placeholder="门店查询" style="width: 160px" />
        区域:
          <Select v-model="searchDate.for_provinceid" style="width:140px" @on-change="getforcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="searchDate.for_cityid" style="width:140px" @on-change="getreg">
              <Option v-for="item in areas.forcity" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="searchDate.for_areaid" style="width:140px">
              <Option v-for="item in areas.reg" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
        <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button>
        <Button @click="addoper('add')" type="info">新增</Button>
        <!-- <Button @click="addoper()" type="info">导出模板</Button>
        <Button @click="addoper()" type="info">导入数据</Button> -->
<Modal v-model="mod.add" :title="modTit" width="680" :mask-closable=false :styles="{top: '20px'}">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <FormItem label="门店名称：" prop="name" :label-width="108">
          <Input v-model="formValidate.name"></Input>
      </FormItem>
      <Row>
          <Col span="12">
            <FormItem label="联系人：" prop="owner" :label-width="108">
                <Input v-model="formValidate.owner"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="手机号码：" prop="mobile" :label-width="108">
                <Input v-model="formValidate.mobile" :maxlength="11"></Input>
            </FormItem>
          </Col>
      </Row>
      <!-- <FormItem label="门店地址" prop="for_provinceid">
          <Select v-model="formValidate.for_provinceid" style="width:140px" @on-change="getforcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="formValidate.for_cityid" style="width:140px" @on-change="getreg">
              <Option v-for="item in areas.forcity" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
          <Select v-model="formValidate.for_areaid" style="width:140px">
              <Option v-for="item in areas.reg" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select> 
      </FormItem> -->
      <FormItem label="门店地址：" prop="for_provinceid" :label-width="108" style=" display:inline-block;width:248px">
          <Select v-model="formValidate.for_provinceid" style="width:140px" @on-change="getforcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select> 
      </FormItem>
      <FormItem prop="for_cityid" style=" display:inline-block;width:140px"> 
          <Select v-model="formValidate.for_cityid" style="width:140px" @on-change="getreg">
              <Option v-for="item in areas.forcity" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select> 
      </FormItem>
      <FormItem prop="for_areaid" style=" display:inline-block;width:140px"> 
          <Select v-model="formValidate.for_areaid" style="width:140px">
              <Option v-for="item in areas.reg" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
      </FormItem>
      <!-- <Row class="borb"> 
          <Input v-model="saddress" style="width:260px;"></Input><Button id="searchbt">搜索</Button> 
          <div id="allmap" style="height:400px;"></div>
      </Row> -->
      <Row class="borb">
          <Col span="8">
            <FormItem label="纬度：" prop="lat" :label-width="108"> 
              <InputNumber :max="90" :min="0" v-model="formValidate.lat"></InputNumber>
            </FormItem> 
          </Col>
          <Col span="8">
            <FormItem label="经度：" prop="lng" :label-width="108">
                <InputNumber :max="180" :min="0" v-model="formValidate.lng"></InputNumber>
            </FormItem>
          </Col>
          <Col span="8">
            <Button @click="mod.map=true;">地图选经纬度</Button>
          </Col>
      </Row>
      <FormItem label="运营商名称" prop="parentid" :label-width="108">
          <Select v-model="formValidate.parentid" style="width:240px">
              <Option v-for="item in operas" :value="item.shid" :key="item.shid">{{ item.name }}</Option>
          </Select>
      </FormItem>
      <FormItem label="门店说明：" :label-width="108">
          <Input v-model="formValidate.team_info"></Input>
      </FormItem>
      <FormItem label="收款银行：" prop="bank_name" :label-width="108">
          <Input v-model="formValidate.bank_name"></Input>
      </FormItem>
      <FormItem label="银行卡号：" prop="bank_no" :label-width="108">
          <Input v-model="formValidate.bank_no" :maxlength="20"></Input>
      </FormItem>
      <FormItem label="持卡人姓名：" prop="bank_user_name" :label-width="108">
          <Input v-model="formValidate.bank_user_name"></Input>
      </FormItem>
      <FormItem label="银行所在省市：" prop="provinceid" :label-width="108" style=" display:inline-block;width:248px">
          <Select v-model="formValidate.provinceid" style="width:140px" @on-change="getcitys">
              <Option v-for="item in areas.pr" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
      </FormItem>
      <FormItem prop="cityid" style=" display:inline-block;width:140px"> 
          <Select v-model="formValidate.cityid" style="width:140px">
              <Option v-for="item in areas.city" :value="item.id" :key="item.id">{{ item.areaname }}</Option>
          </Select>
      </FormItem>
      <Row class="borb">
          <Col span="12"> 
            <FormItem label="门店图片：" :label-width="108"> 
              <div class="admin-upload-list" v-for="item in logoList" :key="item.url">
                  <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="admin-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="logoRemove(item)"></Icon>
                      </div>
                  </template>
                  <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
              </div>
                <Upload
                    ref="logoUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultlogo" 
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="logoBeforeUpload"
                    type="drag"
                    action="System/pic_file_upload"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="plus" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="合作合同：" :label-width="108">
              <div class="admin-upload-list" v-for="item in workList" :key="item.url">
                  <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="admin-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="workRemove(item)"></Icon>
                      </div>
                  </template>
                  <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
              </div>
                <Upload
                    ref="workUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultwork" 
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="workBeforeUpload"
                    type="drag"
                    action="System/pic_file_upload"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="plus" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
          </Col>
      </Row>
      <Row class="borb">
          <Col span="12">
            <FormItem label="经营许可文件：" :label-width="108">
              <div class="admin-upload-list" v-for="item in agreeList" :key="item.url">
                  <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="admin-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="agreeRemove(item)"></Icon>
                      </div>
                  </template>
                  <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                  </template>
              </div>
                <Upload
                    ref="agreeUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultagree"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="agreeBeforeUpload"
                    type="drag"
                    action="System/pic_file_upload"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="plus" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
          </Col>
      </Row>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">提交</Button>
    </div>
</Modal>
<Modal title="选择经纬度" v-model="mod.map" width="800" :styles="{top: '20px'}">
    <Row class="borb">
        <Col span="12"><Input v-model="formValidate.address" style="width:260px;"></Input><Button id="searchbt">搜索</Button></Col>
        <Col span="12">
          纬度：<InputNumber :max="90" :min="0" v-model="formValidate.lat"></InputNumber>
      　经度：<InputNumber :max="90" :min="0" v-model="formValidate.lng"></InputNumber>
        </Col>
    </Row> 
    <div id="allmap" style="height:600px;margin-top:20px;"></div>
</Modal>
<Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
    <img :src="imgUrl" class="fulWidth">
</Modal>
<Modal title="合作设置" v-model="mod.set">
  <Form ref="formSet" :model="formSet" :rules="ruleSet" :label-width="108">
      <FormItem label="合作状态：">
        <RadioGroup v-model="formSet.coop_status">
          <Radio label="1" value="1"><span>正常合作</span></Radio>
          <Radio label="0" value="0"><span>停止合作</span></Radio>
        </RadioGroup>  
      </FormItem>
      <Row v-if="formSet.coop_status==1">
        <FormItem label="用车提成比例：" prop="commis_rate">
            <InputNumber :max="100" :min="0" :step="0.1" v-model="formSet.commis_rate"></InputNumber>%
        </FormItem>
        <FormItem label="月卡提成比例：" prop="card_commis_rate">
            <InputNumber :max="100" :min="0" :step="0.1" v-model="formSet.card_commis_rate"></InputNumber>%
        </FormItem>
        <FormItem label="合作开始时间：" prop="coop_time">
            <DatePicker :value="formSet.coop_time" :editable='false' @on-change="startfn" format="yyyy-MM-dd" type="date" placeholder="签到时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="有效期至：" prop="coop_valid_time">
            <DatePicker :value="formSet.coop_valid_time" :editable='false' @on-change="endfn" format="yyyy-MM-dd" type="date" placeholder="签到时间" style="width: 200px"></DatePicker>
        </FormItem>
      </Row>
      
  </Form>
  <div slot="footer">
      <Button type="info" size="large"  @click="contrsetfn">确定</Button>
  </div>
</Modal>
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
    const bankNoValid = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请填写银行卡号'));
        } else if (!/^[0-9]*$/.test(value)) {
            callback(new Error('请填写正确银行卡号!'));
        }else {
            callback();
        }
    };
    const mobileCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入手机号码!'));
        } else if (!/^1[0-9]{10}$/.test(value)) {
            callback(new Error('请输入正确的手机号码!'));
        } else {
            callback();
        }
    };
    return {
      areas: { pr: [], forcity: [], reg: [], city: [] },
      modTit:'',
      imgUrl: "",
      curshid:'',
      operas:[],
      defaultlogo:[{'name': '','url': ''}],
      defaultwork:[{'name': '','url': ''}],
      defaultagree:[{'name': '','url': ''}],
      logoList: [],
      workList: [],
      agreeList: [],
      tabload:true,
      total: 0,
      size: 18,
      page: 1,
      searchDate: {
        carriersName: "",
        name:'',
        for_provinceid: "",
        for_cityid: "",
        for_areaid: ""
      },
      columns: [
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "运营商名称",
          key: "carriersName"
        },
        {
          title: "门店",
          key: "name"
        },
        {
          title: "联系人",
          width: 120,
          key: "owner"
        },
        {
          title: "联系电话",
          width: 120,
          key: "mobile"
        },
        {
          title: "地址",
          key: "areaAddr"
        },
        {
          title: "合作开始时间",
          width: 120,
          key: "coop_time"
        },
        {
          title: "有效期至",
          width: 120,
          key: "coop_valid_time"
        },
        {
          title: "创建时间",
          width: 160,
          key: "createdon"
        },
        {
          title: "状态",
          width: 90,
          key: "coopStatusStr"
        },
        {
          title: "操作",
          width: 170,
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
                      //this.mod.add = true;
                      this.curshid=params.row.shid;
                      this.info();
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.mod.set = true;
                      this.formSet=params.row;
                    }
                  }
                },
                "合作设置"
              )
            ]);
          }
        }
      ],
      formValidate: {
        shid:0,//0：新增，大于0：编辑
        type:0,//0门店 1运营商
        name: "",
        owner: "",
        mobile: "",
        for_provinceid: '',
        for_cityid: "",
        for_areaid: "",
        address: "",
        lat:0,
        lng:0,
        parentid:'',
        team_info:'',
        bank_name: "",
        bank_no: "",
        bank_user_name: "",
        provinceid: '',
        cityid: "",
        logo: "",
        coop_contract: "",
        bus_license: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "填写门店名称"
          }
        ],
        owner: [
          {
            required: true,
            message: "填写联系人"
          }
        ],
        mobile: [
          { validator: mobileCheck, trigger: 'blur',required: true }
        ],
        for_provinceid: [
          {
            required: true,
            message: "选择负责区域"
          }
        ],
        for_cityid: [
          {
            required: true,
            message: "选择负责市"
          }
        ],
        for_areaid: [
          {
            required: true,
            message: "选择负责区"
          }
        ],
        parentid:[
          {
            required: true,
            message: "选择运营商"
          }
        ],
        lat:[
          {
            required: true,
            message: "填写经度"
          }
        ],
        lng:[
          {
            required: true,
            message: "填写纬度"
          }
        ],
        bank_name: [
          {
            required: true,
            message: "填写收款银行"
          }
        ],
        bank_no: [
          { validator: bankNoValid, trigger: 'blur',required: true }
        ],
        bank_user_name: [
          {
            required: true,
            message: "填写持卡人姓名"
          }
        ],
        provinceid: [
          {
            required: true,
            message: "选择银行所在省"
          }
        ],
        cityid: [
          {
            required: true,
            message: "选择银行所在市"
          }
        ]
      },
      formSet: { coop_status: 1,commis_rate:0,card_commis_rate:0,coop_time:'',coop_valid_time:''},
      ruleSet: {
        coop_time: [
          {
            required: true,
            message: "请选择合作开始时间"
          }
        ],
        coop_valid_time: [
          {
            required: true,
            message: "请选择合作有效期"
          }
        ]
      },
      dts: [],
      mod: { add: false, showimg: false, set: false, map: false },
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
          type:0,//0门店 1运营商
          carriersName: this.searchDate.carriersName, //运营商名称
          name: this.searchDate.name, //门店名称
          for_provinceid: this.searchDate.for_provinceid || 0, //省份
          for_cityid: this.searchDate.for_cityid || 0, //城市
          for_areaid: this.searchDate.for_areaid || 0, //区域
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("shop.OperatorList",param,function(d) {
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
    getOperas(){
      let self = this,
        param = {
          type:1,//0门店 1运营商
          pageIndex: 1, //页码
          pageSize:999 //每页条数
        };
      util.ajaxY("shop.OperatorList",param,function(d) {
          if (d.code == 0) {
            self.operas = d.data.rows;
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
    addoper(s) {
      if(this.operas.length==0){
        this.getOperas();
      }
      this.modTit='编辑';
      this.$refs['formValidate'].resetFields();
      if(s){
        this.modTit='新增';
        this.areas.forcity=[],this.areas.reg=[], this.areas.city=[],this.searchDate.for_provinceid='';
        this.formValidate.for_cityid='';
        this.formValidate.cityid='';
        this.formValidate.team_info=''; 
        this.formValidate.address='';
        //重置图片上传框
        this.logoList = this.$refs.logoUpload.fileList=[];
        this.workList = this.$refs.workUpload.fileList=[];
        this.agreeList = this.$refs.agreeUpload.fileList=[];
      }
      this.mod.add = true; 
    },
    info(){
      let self=this;
      util.ajaxY("shop.OperatorInfo",{shid:self.curshid},function(d) {
          if (d.code == 0) {
            let dt=d.data;
            self.addoper();
            if(!dt.logo){
              self.logoList = self.$refs.logoUpload.fileList=[];
            }else{
              self.defaultlogo=[{'name': '','url': dt.logo}]; 
            }
            if(!dt.coop_contract){
              self.workList = self.$refs.workUpload.fileList=[]; 
            }else{
              self.defaultwork=[{'name': '','url': dt.coop_contract}];
            } 
            if(!dt.bus_license){
              self.agreeList = self.$refs.agreeUpload.fileList=[];
            }else{
              self.defaultagree=[{'name': '','url': dt.bus_license}];
            } 
            self.formValidate=dt;
          }
        },
        self
      );
    },
    contrsetfn(){
      let self=this,param={
          shid:self.formSet.shid,
          coop_status: Number(self.formSet.coop_status),
          commis_rate:0,
          card_commis_rate:0,
          coop_time:'',
          coop_valid_time:''
      };
      if(param.coop_status==0){
          coopset();
      }else{
        this.$refs.formSet.validate(valid => {
          if (valid) {
            param={
                shid:self.formSet.shid,
                coop_status: Number(self.formSet.coop_status),
                commis_rate:self.formSet.commis_rate,
                card_commis_rate:self.formSet.card_commis_rate,
                coop_time:self.formSet.coop_time,
                coop_valid_time:self.formSet.coop_valid_time
            }
            coopset();
          }
        });
      }
      function coopset(){
        util.ajaxY("shop.CoopSet",param,function(d) {
              if (d.code == 0) {
                self.mod.set = false;
                self.getData();
              }
            },
            self
          );
      }
    },
    contrAddfn() {
      let self = this;
      this.formValidate.logo = this.logoList.length ? this.logoList[0].url : "";
      this.formValidate.coop_contract = this.workList.length? this.workList[0].url: "";
      this.formValidate.bus_license = this.agreeList.length? this.agreeList[0].url: "";
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "shop.AddOperator",
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
    handleView(url) {
      this.imgUrl = url;
      this.mod.showimg = true;
    },
    logoRemove(file) {
      const fileList = this.$refs.logoUpload.fileList;
      this.$refs.logoUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    workRemove(file) {
      const fileList = this.$refs.workUpload.fileList;
      this.$refs.workUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    agreeRemove(file) {
      const fileList = this.$refs.agreeUpload.fileList;
      this.$refs.agreeUpload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      file.url = res.filekey;
    },
    logoBeforeUpload() {
      const check = this.logoList.length < 1;
      if (!check) {
        this.$Message.error("只能上传一张图片");
      }
      return check;
    },
    workBeforeUpload() {
      const check = this.workList.length < 1;
      if (!check) {
        this.$Message.error("只能上传一张图片");
      }
      return check;
    },
    agreeBeforeUpload() {
      const check = this.agreeList.length < 1;
      if (!check) {
        this.$Message.error("只能上传一张图片");
      }
      return check;
    },
    handleFormatError(file) {
      this.$Message.error("格式错误");
    },
    handleMaxSize(file) {
      this.$Message.error("图片不超过2M");
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
      this.searchDate = {
        carriersName: "",
        name:'',
        for_provinceid: "",
        for_cityid: "",
        for_areaid: ""
      };
      this.areas.forcity=[],this.areas.reg=[];
      this.getData();
    },
    startfn(date) {
      this.formSet.coop_time = date;
    },
    endfn(date) {
      this.formSet.coop_valid_time = date;
    }
  },
  mounted() {
    this.logoList = this.$refs.logoUpload.fileList;
    this.workList = this.$refs.workUpload.fileList;
    this.agreeList = this.$refs.agreeUpload.fileList;
    let self=this;
    this.$nextTick(function () { 
        util.MP().then( BMap => {
          var th = this
          var map = new BMap.Map("allmap");            // 创建Map实例
          var point = new BMap.Point(113.662,22.886); // 创建点坐标
          map.centerAndZoom(point,11);
          map.enableScrollWheelZoom();
          var gc=new BMap.Geocoder(); 

          map.addEventListener("click", function(e){//地图单击事件 
              self.formValidate.lng=e.point.lng;
              self.formValidate.lat=e.point.lat;
              point=new BMap.Point(e.point.lng,e.point.lat);
              gc.getLocation(point, function(rs){
                self.formValidate.address=rs.address;
              });
          });
           
          //地图搜索
          document.getElementById('searchbt').addEventListener("click", function(){
              sear(); 
          });
          function sear(){
            var local = new BMap.LocalSearch(map, { 
                  renderOptions:{map: map} 
              });
              local.search(self.formValidate.address); 
          } 
        })
      })
  },
  updated(){
    this.logoList = this.$refs.logoUpload.fileList;
    this.workList = this.$refs.workUpload.fileList;
    this.agreeList = this.$refs.agreeUpload.fileList;
  }
};
</script>

<template>
    <div>
      <Row>
        <Input v-model="searchDate.name" placeholder="品名查询" style="width: 200px" /> 
        <Select v-model="searchDate.dicTypeCode" style="width:120px;">
          <Option value="0">所有类别</Option>
          <Option v-for="item in proType" :value="item.id" :key="item.id">{{ item.content }}</Option>
        </Select>
        <span @click="searchfn" style="margin: 0 8px;"><Button type="primary" icon="ios-search">
          搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button>
        <Button @click="addbt" type="info" class="margin-left-10">新增</Button>
  <Modal v-model="mod.del" width="360">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
    </p>
    <div style="text-align:center">
        <p>确定要删除？</p> 
    </div>
    <div slot="footer">
        <Button type="error" size="large" long @click="deleteFn()">确定</Button>
    </div>
</Modal>
 <Modal v-model="mod.add" title="新增" width="580">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
      <FormItem label="品名：" prop="name">
          <Input v-model="formValidate.name"></Input>
      </FormItem>
      <FormItem label="类别：" prop="dicTypeCode">
          <Select v-model="formValidate.dicTypeCode" placeholder="请选择" :label-in-value='true' @on-change="changeTypeCode">
            <Option v-for="item in proType" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="产地：" prop="placeOfOrigin">
          <Input v-model="formValidate.placeOfOrigin"></Input>
      </FormItem>
      <FormItem label="底色：" prop="dicBackgroundCode">
          <Select v-model="formValidate.dicBackgroundCode" placeholder="请选择" :label-in-value='true' @on-change="changeBackgroundCode">
            <Option v-for="item in dicBackgroundCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="纹路：" prop="dicLinesCode">
          <Select v-model="formValidate.dicLinesCode" placeholder="请选择" :label-in-value='true' @on-change="changeLinesCode">
            <Option v-for="item in dicLinesCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="纹路颜色：" prop="dicLinesColorCode">
          <Select v-model="formValidate.dicLinesColorCode" placeholder="请选择" :label-in-value='true' @on-change="changeLinesColorCode">
            <Option v-for="item in dicLinesColorCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="功能：">
          <Input v-model="formValidate.function" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="应用场景：">
          <Input v-model="formValidate.application" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="注意事项：">
          <Input v-model="formValidate.announcement" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal>
 <Modal v-model="mod.edit" title="编辑" width="580">
    <Form ref="formEdit" :model="formEdit" :rules="ruleValidate" :label-width="86">
      <FormItem label="品名：" prop="name">
          <Input v-model="formEdit.name"></Input>
      </FormItem>
      <FormItem label="类别：" prop="dicTypeCode">
          <Select v-model="formEdit.dicTypeCode" placeholder="请选择" :label-in-value='true' @on-change="changeTypeCode">
            <Option v-for="item in proType" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="产地：" prop="placeOfOrigin">
          <Input v-model="formEdit.placeOfOrigin"></Input>
      </FormItem>
      <FormItem label="底色：" prop="dicBackgroundCode">
          <Select v-model="formEdit.dicBackgroundCode" placeholder="请选择" :label-in-value='true' @on-change="changeBackgroundCode">
            <Option v-for="item in dicBackgroundCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="纹路：" prop="dicLinesCode">
          <Select v-model="formEdit.dicLinesCode" placeholder="请选择" :label-in-value='true' @on-change="changeLinesCode">
            <Option v-for="item in dicLinesCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="纹路颜色：" prop="dicLinesColorCode">
          <Select v-model="formEdit.dicLinesColorCode" placeholder="请选择" :label-in-value='true' @on-change="changeLinesColorCode">
            <Option v-for="item in dicLinesColorCode" :value="item.id" :key="item.id">{{ item.content }}</Option>
          </Select>
      </FormItem>
      <FormItem label="功能：">
          <Input v-model="formEdit.function" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="应用场景：">
          <Input v-model="formEdit.application" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="注意事项：">
          <Input v-model="formEdit.announcement" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrEditfn()">确定</Button>
    </div>
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
      tabload:true,
      total: 0,
      size: 12,
      page: 1,
      searchDate: {
        name: "", // 商品名称
        dicTypeCode: " ", // 销售类型
      }, 
      columns: [
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "来源",
          key: "source"
        },
        {
          title: "品名",
          key: "name"
        },
        {
          title: "类别",
          key: "dicTypeContext"
        },
        {
          title: "产地",
          key: "place_of_origin"
        },
        {
          title: "底色",
          key: "dicBackgroundContext"
        },
        {
          title: "纹路",
          key: "dicLinesContext"
        },
        {
          title: "纹理颜色",
          key: "dicLinesColorContext"
        },
        {
          title: "创建时间",
          key: "gmt_create"
        }, 
         {
          title: "更新时间",
          key: "gmt_modified"
        }, 
        {
          title: "操作",
          width:200,
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
                      this.getInfo(params.row.id);
                      this.mod.edit = true;
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                       this.curId=params.row.id;
                      // this.getcost;
                       this.mod.del = true;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ], 
      formValidate: {
        companyId:0,//公司ID，0为平台添加 
        name:'',//品名名称 
        placeOfOrigin:'',//产地 
        dicTypeCode:'',//物料类型字典ID 
        dicTypeContext:'',//物料类型字典值 
        dicBackgroundCode:'',//物料底色字典ID 
        dicBackgroundContext:'',//物料底色字典值 
        dicLinesCode:'',//物料纹路字典ID 
        dicLinesContext:'',//物料纹路字典值 
        dicLinesColorCode:'',//物料纹路颜色字典ID 
        dicLinesColorContext:'',//物料纹路颜色字典值 
        source:'平台',//公司添加传入公司名称，平台添加传入平台 
        function:'',//功能 
        application:'',//应用场景 
        announcement:''//注意事项
      },
      formEdit: {
        companyId:0,//公司ID，0为平台添加 
        name:'',//品名名称 
        placeOfOrigin:'',//产地 
        dicTypeCode:'',//物料类型字典ID 
        dicTypeContext:'',//物料类型字典值 
        dicBackgroundCode:'',//物料底色字典ID 
        dicBackgroundContext:'',//物料底色字典值 
        dicLinesCode:'',//物料纹路字典ID 
        dicLinesContext:'',//物料纹路字典值 
        dicLinesColorCode:'',//物料纹路颜色字典ID 
        dicLinesColorContext:'',//物料纹路颜色字典值 
        source:'平台',//公司添加传入公司名称，平台添加传入平台 
        function:'',//功能 
        application:'',//应用场景 
        announcement:''//注意事项
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入名称"
          }
        ],
        placeOfOrigin: [
          {
            required: true,
            message: "产地"
          }
        ],
        dicTypeCode: [
          {
            required: true,
            message: "请选择类型"
          }
        ],
        dicBackgroundCode: [
          {
            required: true,
            message: "请选择底色"
          }
        ],
        dicLinesCode: [
          {
            required: true,
            message: "请选择纹路"
          }
        ],
        dicLinesColorCode: [
          {
            required: true,
            message: "请选择纹路颜色"
          }
        ],
      }, 
      dts: [],
      proType:[],
      dicBackgroundCode:[],
      dicLinesCode:[],
      dicLinesColorCode:[],
      mod: { add: false,edit:false, showimg: false,del:false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
    this.getType();
    this.getBackgroundCode();
    this.getLinesCode();
    this.getLinesColorCode();
  }, 
  methods: {
    getData() {
      let self=this;
      util.ajaxY('/sys/product/list',{companyId:0,dicTypeCode:self.searchDate.dicTypeCode,name:this.trim(self.searchDate.name),pageIndex:this.page,pageSize:this.size},function(d){
        if (d.code==0) { 
             self.dts = d.data.rows;
            self.total = d.data.total;
        }
      },self)
    }, 
    getInfo(tid) {
      let self=this;
      util.ajaxY('/sys/product/info',{id:tid},function(d){
        if (d.code==0) { 
            self.$refs['formEdit'].resetFields(); 
             self.formEdit = d.data; 
             self.mod.edit = true;
        }
      },self)
    },
    changeTypeCode(v){
      this.formValidate.dicTypeContext=v.label;
    },
    changeBackgroundCode(v){

      this.formValidate.dicBackgroundContext=v.label;
    },
    changeLinesCode(v){
      this.formValidate.dicLinesContext=v.label;
    },
    changeLinesColorCode(v){
      this.formValidate.dicLinesColorContext=v.label;
    },
    getType() {
      let self=this
      util.ajaxY('/sys/dicBase/list',{code:6,pageIndex:1,pageSize:999},function(d){
        if (d.code==0) { 
             self.proType = d.data.rows;
        }
      },self)
    },
    getBackgroundCode() {
      let self=this
      util.ajaxY('/sys/dicBase/list',{code:5,pageIndex:1,pageSize:999},function(d){
        if (d.code==0) { 
             self.dicBackgroundCode = d.data.rows;
        }
      },self)
    },
    getLinesCode() {
      let self=this
      util.ajaxY('/sys/dicBase/list',{code:4,pageIndex:1,pageSize:999},function(d){
        if (d.code==0) { 
             self.dicLinesCode = d.data.rows;
        }
      },self)
    },
    getLinesColorCode() {
      let self=this
      util.ajaxY('/sys/dicBase/list',{code:3,pageIndex:1,pageSize:999},function(d){
        if (d.code==0) { 
             self.dicLinesColorCode = d.data.rows;
        }
      },self)
    },
    addbt(){
      this.$refs['formValidate'].resetFields();
      this.mod.add = true;
    },
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/product/insert",
            self.formValidate,
            function(d) {
              if (d.code==0) {
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
    contrEditfn() {
      let self = this;
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/product/update",
            self.formEdit,
            function(d) {
              if (d.code==0) {
                self.mod.edit = false;
                self.$Message.info('成功');
                self.getData();
              }
            },
            self
          );
        }
      });
    },
      deleteFn(){
      let self=this
      util.ajaxY('/sys/product/del',{id:this.curId},function(d){
        console.log(d.code);
        if (d.code==0) { 
             self.$Message.info(d.msg);
             self.mod.del = false;
             self.getData();
        }
      },self)
    },
    changePage(pageIndex) {
      this.page = pageIndex;
      this.getData();
    },
    searchfn() {
      let self = this;
      this.page = 1;
      self.getData();
    },
    canclefn() {
      this.searchDate = {
        name: "", // 商品名称
        dicTypeCode: "", // 销售类型 
      };
      this.page = 1;
      this.getData();
    },
    trim(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
    },
  }
};
</script>
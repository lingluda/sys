<style lang="less" scoped>

</style>
<template>
    <div>
        <Row> 
        <Input v-model="searchDate.number" placeholder="设备编号查询" style="width: 160px"/>
        <Input v-model="searchDate.shopName" placeholder="门店查询" style="width: 160px" />
        <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button>
<Modal v-model="mod.add" title="处理" width="380">
    <div class="admin-upload-list" v-for="item in formValidate.problemPic" :key="item"> 
      <img :src="item">
      <div class="admin-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon> 
      </div> 
    </div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
      <FormItem label="当前状态：" prop="status">
          <Select v-model="formValidate.status">
              <Option v-for="item in selSta" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
      </FormItem>
      <FormItem label="处理说明">
            <Input v-model="formValidate.deal_info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="处理说明..."></Input>
        </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal>
<Modal v-model="mod.coin" width="360">
    <p slot="header" style="color:#36cb86;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>赠送童乐币</span>
    </p>
    <div style="text-align:center">
        <p>您确定要给当前用户 {{giveMoble}} 赠送 {{givebi}} 枚童乐币吗 ？</p> 
    </div>
    <div slot="footer">
        <Button type="info" size="large" long @click="contrGiveCoinfn">确定</Button>
    </div>
</Modal>
<Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
    <img :src="imgUrl" class="fulWidth">
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
    return { 
      imgUrl: "",
      giveMoble:'',
      givebi:'',
      tabload:true,
      total: 0,
      size: 18,
      page: 1,
      searchDate: {
        number: "",
        shopName: ""
      },
      selSta: [
          {
              value: 0,
              label: '处理中'
          },
          {
              value: 1,
              label: '已解决'
          },
          {
              value: 2,
              label: '未解决'
          }
      ],
      columns: [
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
          title: "问题类型",
          key: "problemType"
        },
        {
          title: "问题描述",
          key: "content"
        },
        {
          title: "门店",
          key: "mer_name"
        },
        {
          title: "联系人",
          key: "contcat_name"
        },
        {
          title: "联系电话",
          key: "contcat_mobile"
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
          width: 90,
          key: "statusStr"
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
                     this.formValidate=params.row; 
                      this.mod.add = true;
                    }
                  }
                },
                "处理"
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
                      this.giveMoble=params.row.contcat_mobile; 
                      this.givebi=params.row.giveBiCount; 
                      this.mod.coin = true;
                    }
                  }
                },
                "赠送童乐币"
              )
            ]);
          }
        }
      ],
      formValidate: {
        dpid:'',
        status:'',
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
      mod: { add: false, showimg: false,coin:false},
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
          shopName:self.searchDate.shopName,
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
        };
      util.ajaxY("device.FailureFeedbackList",param,function(d) {
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
    contrAddfn() {
      let self = this,param={
        dpid:self.formValidate.dpid,
        status:self.formValidate.status,
        deal_info:self.formValidate.deal_info
      };
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "device.FailureHandling",
            param,
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
    contrGiveCoinfn(){
      let self=this;
      util.ajaxY("member.GiveFailureTongLeBi",{mobile:self.giveMoble},function(d) {
          if (d.code == 0) {
             self.$Message.info('赠送成功');
             self.mod.coin = false;
          } 
        },
        self
      );
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
      this.searchDate = {
        number: "",
        shopName: ""
      };
      this.getData();
    }
  }
};
</script>

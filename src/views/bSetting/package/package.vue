<style lang="less" scoped>

</style>
<template>
    <div>
        <Row> 
        <!-- <Input v-model="searchDate.username" placeholder="登录账号查询" style="width: 160px"/>
        <span @click="searchfn" style="margin: 0 8px;"><Button>搜索</Button></span>
        <Button @click="canclefn" type="ghost" >取消</Button> -->
        <Button @click="addbt" type="info" style="margin-left:30px;">新增</Button>
<Modal v-model="mod.add" title="新增" width="460" style="text-align:center">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline>
      <FormItem prop="price"> 
          <InputNumber :min="1" v-model="formValidate.price" style="width:80px;"></InputNumber> 元购买
      </FormItem>
      <FormItem prop="buy">
          <!-- <Input v-model="formValidate.buy" number  style="width:80px;"></Input> 枚童乐币 -->
          <InputNumber :min="1" v-model="formValidate.buy" style="width:80px;"></InputNumber>枚童乐币
      </FormItem>
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal>
<Modal v-model="mod.unable" width="360">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{is_disabled?'禁用':'启用'}}</span>
    </p>
    <div v-if="is_disabled" style="text-align:center">
        <p>确定要禁用当前套餐吗？</p>
        <!-- <p>禁用之后，该用户无法登录管理后台</p> -->
    </div>
    <div v-else style="text-align:center">
        <p>确定要启用当前套餐吗？</p>
        <!-- <p>启用之后，该用户便可以登录管理后台.</p> -->
    </div>
    <div slot="footer">
        <Button type="error" size="large" long @click="unablefn">确定</Button>
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
    const priceCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入价格!'));
        } else if (value<=0) {
            callback(new Error('请输入合理的价格!'));
        } else {
            callback();
        }
    };
    const buyCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入数量!'));
        } else if (!/^\+?[1-9][0-9]*$/.test(value)) {
            callback(new Error('请输入合理数量!'));
        } else {
            callback();
        }
    };
    return {  
      is_disabled:0,
      curId:0, 
      tabload:true,
      total: 0,
      size: 12,
      page: 1,
      
      columns: [
        {
          title: "#",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "购买价格",
          key: "price"
        },
        {
          title: "购买童乐币数",
          key: "buy"
        },
        {
          title: "充值套餐",
          key: "content"
        },
        {
          title: "购买次数",
          key: "buy_count"
        },
        {
          title: "创建时间",
          key: "createdon"
        },
        {
          title: "状态",
          key: "statusStr"
        },
        {
          title: "操作",
          width:220,
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
                      this.is_disabled=params.row.status?0:1;
                      this.curId=params.row.pid;
                      this.mod.unable = true;
                    }
                  }
                },
                params.row.status?'启用':'禁用'
              )
            ]);
          }
        }
      ], 
      formValidate: {
        pid:0,
        price:0,
        buy:0
      },
      ruleValidate: {
        price: [
          { validator: priceCheck, trigger: 'blur' }
        ],
        buy: [
          { validator: buyCheck, trigger: 'blur' }
        ]
      },
 
      dts: [], 
      mod: { add: false,unable:false,edit: false,role:false,showimg: false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self=this,param={
          pageIndex: this.page, //页码
          pageSize: this.size //每页条数
      } 
      util.ajaxY("package.RechargePackageList",param,function(d){
          if (d.code == 0) {
              self.dts = d.data.rows;
              self.total = d.data.total;
          }
      },self);
    },
 
    addbt(){
      this.$refs['formValidate'].resetFields();
      this.mod.add = true;
    },
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          self.formValidate
          util.ajaxY(
            "package.AddRechargePackage",
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
    unablefn(){
      let self=this,param={
        pid:this.curId,
        status:this.is_disabled
      };
      util.ajaxY("package.DisabledEnablePackage",param,function(d) {
          if (d.code == 0) {
            self.mod.unable = false;
            self.getData();
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
    }
  }
};
</script>

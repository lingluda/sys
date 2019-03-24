<template>
    <div>
        <Row>
        <Button @click="addbt" type="info" >新增</Button>
 <Modal v-model="mod.add" title="新增" width="380">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
      <FormItem label="名称：" prop="name">
          <Input v-model="formValidate.name"></Input>
      </FormItem> 
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal>
<Modal v-model="mod.edit" title="编辑" width="380">
    <Form ref="formedit" :model="formedit" :rules="ruleValidate" :label-width="86">
      <FormItem label="名称：" prop="name">
          <Input v-model="formedit.name"></Input>
      </FormItem> 
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrEditfn()">确定</Button>
    </div>
</Modal>
 
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
        mobile: ""
      }, 
      columns: [
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "加工名称",
          key: "name"
        }, 
        {
          title: "创建时间",
          key: "gmtCreate"
        }, 
         {
          title: "更新时间",
          key: "gmtModified"
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
                      this.mod.edit=true;
                      this.formedit.name=params.row.name;
                      this.formedit.id=params.row.id;
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
        companyId:0,
        name:'',
        source:"平台"
      },
      formedit: {
        companyId:0,
        name:'',
        source:"平台"
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入名称"
          }
        ], 
      }, 
      dts: [],
      curId:'',
      mod: { add: false, showimg: false,del:false,edit:false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self=this
      util.ajaxY('/sys/dicProcessInstruction/list',{companyId:0,pageIndex:this.page,pageSize:this.size},function(d){
        if (d.code==0) { 
             self.dts = d.data.rows;
            self.total = d.data.total;
        }
      },self)
    }, 
    addbt(){
      this.$refs['formValidate'].resetFields();
      this.mod.add = true;
    },
    deleteFn(){
      let self=this
      util.ajaxY('/sys/dicProcessInstruction/del',{id:this.curId},function(d){
        console.log(d.code);
        if (d.code==0) { 
             self.$Message.info(d.msg);
             self.mod.del = false;
             self.getData();
        }
      },self)
    },
    contrEditfn() {
      let self = this;
      this.$refs.formedit.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/dicProcessInstruction/update",
            self.formedit,
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
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/dicProcessInstruction/insert",
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
    changePage(pageIndex) {
      this.page = pageIndex;
      this.getData();
    }
  }
};
</script>

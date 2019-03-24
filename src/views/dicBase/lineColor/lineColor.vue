<template>
    <div>
        <Row>
        <Button @click="addbt" type="info" >新增</Button>
 <Modal v-model="mod.add" title="新增" width="380">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
      <FormItem label="名称：" prop="content">
          <Input v-model="formValidate.content"></Input>
      </FormItem> 
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrAddfn">确定</Button>
    </div>
</Modal> 
<Modal v-model="mod.edit" title="新增" width="380">
    <Form ref="formEditdate" :model="formEditdate" :rules="ruleValidate" :label-width="86">
      <FormItem label="名称：" prop="content">
          <Input v-model="formEditdate.content"></Input>
      </FormItem> 
    </Form>
    <div slot="footer">
        <Button type="info" size="large"  @click="contrEditfn">确定</Button>
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
          title: "类型名称",
          key: "content"
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
                      this.mod.edit = true;
                      this.formEditdate.content=params.row.content;
                      this.formEditdate.id = params.row.id;
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
                     this.curId = params.row.id;
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
        code:3,
        content:''
      }, 
       formEditdate: {
        code:3,
        content:''
      },
      ruleValidate: {
        content: [
          {
            required: true,
            message: "请输入名称"
          }
        ], 
      }, 
      dts: [],
      mod: { add: false, showimg: false,edit:false,del:false},
      loading: { add: true }
    };
  }, 
  created() {
    this.getData();
  }, 
  methods: {
    getData() {
      let self=this
      util.ajaxY('/sys/dicBase/list',{code:3,pageIndex:this.page,pageSize:this.size},function(d){
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
    contrAddfn() {
      let self = this;
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/dicBase/insert",
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
      this.$refs.formEditdate.validate(valid => {
        if (valid) {
          util.ajaxY(
            "/sys/dicBase/update",
            self.formEditdate,
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
      util.ajaxY('/sys/dicBase/del',{id:this.curId},function(d){
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
    }
  }
};
</script>

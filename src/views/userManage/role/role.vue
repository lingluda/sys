<template>
    <div>
        <Row>
            <Button @click="addbt" type="info">新增</Button>
            <Modal v-model="mod.add" title="新增" width="380">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
                    <FormItem label="角色名称：" prop="name">
                        <Input v-model="formValidate.name"></Input>
                    </FormItem>
                    <FormItem label="角色说明">
                        <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色说明..."></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large" @click="contrAddfn">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.edit" title="新增" width="380">
                <Form ref="editValidate" :model="editValidate" :rules="ruleValidate" :label-width="86">
                    <FormItem label="角色名称：" prop="name">
                        <Input v-model="editValidate.name"></Input>
                    </FormItem>
                    <FormItem label="角色说明">
                        <Input v-model="editValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色说明..."></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large" @click="contrEditfn">确定</Button>
                </div>
            </Modal>
            <Modal v-model="mod.costlist" title="分配权限" width="380">
                <Form :label-width="86">
                    <FormItem label="分配权限：">
                        <CheckboxGroup v-model="selRole">
                            <!-- v-for="item in roles"  label="item.id" :key="item.id"-->
                            <Checkbox label="数字字典"></Checkbox>
                            <Checkbox label="平台收费"></Checkbox>
                            <Checkbox label="平台收费0"></Checkbox>
                            <Checkbox label="数字字典8"></Checkbox>
                            <Checkbox label="平台收费7"></Checkbox>
                            <Checkbox label="平台收费9"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large" @click="contrRolefn">确定</Button>
                </div>
            </Modal>
            <Modal title="查看图片" v-model="mod.showimg" :styles="{top: '20px'}">
                <img :src="imgUrl" class="fulWidth">
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
                tabload: true,
                total: 0,
                selRole: [],
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
                        title: "角色名称",
                        key: "name"
                    },
                    {
                        title: "角色说明",
                        key: "description"
                    },
                    {
                        title: "创建时间",
                        key: "gmtCreate"
                    },
                    {
                        title: "修改时间",
                        key: "gmtModified"
                    },
                    {
                        title: "操作",
                        render: (h, params) => {
                            return h("div", [
                                // h(
                                //   "Button",
                                //   {
                                //     props: {
                                //       size: "small"
                                //     },
                                //     style: {
                                //       marginRight: "5px"
                                //     },
                                //     on: {
                                //       click: () => {
                                //        //this.cost.curId=params.row.memid;

                                //        this.curId = params.row.id;
                                //        this.selRole = params.row.selRole;
                                //        this.mod.costlist = true;

                                //       }
                                //     }
                                //   },
                                //   "分配权限"
                                // ),
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
                                                this.dt = params.row;
                                                this.editValidate = {name: params.row.name, description: params.row.description};
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
                                                this.curId = params.row.id;
                                                this.mod.del = true
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
                    id: 0,
                    name: '',
                    description: ''
                },
                editValidate: {
                    id: 0,
                    name: '',
                    description: ''
                },
                ruleValidate: {
                    name: [
                        {
                            required: true,
                            message: "请输入角色名称"
                        }
                    ],
                },
                dts: [],
                mod: {add: false, showimg: false, del: false, costlist: false, edit: false},
                loading: {add: true}
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let self = this, param = {
                    pageIndex: this.page, //页码
                    pageSize: this.size //每页条数
                }
                util.ajaxY("/sys/sysRole/list", param, function (d) {
                    if (d.code == 0) {
                        self.dts = d.data.rows;
                        self.total = d.data.total;
                    }
                }, self);
            },
            getcost() {
                let self = this, param = {
                    userid: this.curId,
                    pageIndex: this.cost.page, //页码
                    pageSize: this.cost.size //每页条数
                }
                util.ajaxY("order.MemUsingRecord", param,
                    function (d) {
                        if (d.code == 0) {
                            self.cost.costData.dts = d.data.rows;
                            self.cost.total = d.data.total;
                        }
                    },
                    self
                );
            },
            trim(str) {
                return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "");
            },
            addbt() {
                this.$refs['formValidate'].resetFields();
                this.mod.add = true;
            },
            contrAddfn() {
                let self = this;
                this.$refs.formValidate.validate(valid => {
                    if (valid) {
                        util.ajaxY(
                            "/sys/sysRole/insert",
                            self.formValidate,
                            function (d) {
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
            contrEditfn() {
                let self = this, param = {
                    id: this.dt.id,//编辑
                    description: this.editValidate.description,
                    name: this.editValidate.name,
                    //password:this.editValidate.password
                };
                this.$refs.editValidate.validate(valid => {
                    if (valid) {
                        util.ajaxY(
                            "/sys/sysRole/update",
                            param,
                            function (d) {
                                if (d.code == 0) {
                                    self.mod.edit = false;
                                    self.$Message.info('成功');
                                    self.getData();
                                }
                            },
                            self
                        );
                    }
                });
                this.contrRolefn(self.dt.id);
            },
            contrRolefn() {
                let self = this;
                console.log("  llll:" + this.selRole[0]);
                if (self.selRole == []) {
                    self.$Message.error('请选择角色！');
                    return false;
                }
                util.ajaxY("", {sysUserId: "", sysRoleId: ""}, function (d) {
                        if (d.code == 0) {
                            self.$Message.info('成功');
                            self.getData();
                            self.mod.costlist = false;
                        }
                    },
                    self)
            },

            deleteFn() {
                let self = this
                util.ajaxY('/sys/sysRole/del', {id: this.curId}, function (d) {
                    console.log(d.code);
                    if (d.code == 0) {
                        self.$Message.info(d.msg);
                        self.mod.del = false;
                        self.getData();
                    }
                }, self)
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
                    mobile: ""
                };
                this.dateval = ["", ""];
                this.getData();
            }
        }
    };
</script>

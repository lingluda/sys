<template>
    <div>
        <Row>
            <Button @click="addbt" type="info">新增</Button>
            <!--新增弹框-->
            <Modal v-model="mod.add" title="新增" width="380">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="86">
                    <FormItem label="名称：" prop="name">
                        <Input v-model="formValidate.name"></Input>
                    </FormItem>
                    <FormItem label="说明图片：" prop="img">
                        <div class="demo-upload-list" v-for="item in uploadAdd">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="demo-upload-list-cover">
                                    <!--<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>-->
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,'uploadAdd')"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <Upload v-show="uploadAdd.length < 1"
                                ref="uploadAdd"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                type="drag"
                                action="/oss/store/machining"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="plus" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large" @click="contrAddfn">确定</Button>
                </div>
            </Modal>
            <!--新增弹框 end-->
            <!--编辑弹框-->
            <Modal v-model="mod.edit" title="编辑" width="380">
                <Form ref="formedit" :model="formedit" :rules="ruleValidate" :label-width="86">
                    <FormItem label="名称：" prop="name">
                        <Input v-model="formedit.name"></Input>
                    </FormItem>
                    <FormItem label="说明图片：" prop="img">
                        <div class="demo-upload-list" v-for="item in uploadEdit">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url">
                                <div class="demo-upload-list-cover">
                                    <!--<Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>-->
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,'uploadEdit')"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <Upload v-show="uploadEdit.length < 1"
                                ref="uploadEdit"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                type="drag"
                                action="/oss/store/machining"
                                style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="plus" size="20"></Icon>
                            </div>
                        </Upload>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="info" size="large" @click="contrEditfn()">确定</Button>
                </div>
            </Modal>
            <!--编辑弹框 end-->
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
                defaultList: [],
                editList: [],
                imgName: '',
                visible: false,
                uploadAdd: [],
                uploadEdit: [],
                imgUrl: "",
                tabload: true,
                json: "",
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
                        title: "来源",
                        key: "source"
                    },
                    {
                        title: "加工名称",
                        key: "name"
                    },
                    {
                        title: "说明图片",
                        key: "path",
                        render: (h, params) => {
                            return h("div", [
                                h('img', {
                                    domProps: {
                                        align: 'center',
                                        src: [params.row.path],
                                    },
                                    style: {
                                        width: '30px',
                                        marginRight: '30px'
                                    },
                                })
                            ])
                        }
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
                        width: 200,
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
                                                this.mod.edit = true;
                                                this.uploadEdit = [];
                                                this.formedit.name = params.row.name;
                                                this.formedit.id = params.row.id;
                                                this.formedit.imageId = params.row.imageId;
                                                this.formedit.path = params.row.path;
                                                this.uploadEdit.push({url: params.row.path, status: 'finished'});
                                                console.log(params.row.path);
                                                console.log(this.uploadEdit);
                                                this.$refs.uploadEdit.fileList = this.uploadEdit;
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
                    companyId: 0,
                    name: '',
                    img: 'jpg',
                    imageId: '',
                    source: "平台"
                },
                formedit: {
                    companyId: 0,
                    name: '',
                    img: 'jpg',
                    imageId: '',
                    path: '',
                    source: "平台"
                },
                ruleValidate: {
                    name: [
                        {
                            required: true,
                            message: "请输入名称"
                        }
                    ],
                    img: [
                        {
                            required: true,
                            message: ""
                        }
                    ],
                },
                dts: [],
                curId: '',
                mod: {add: false, showimg: false, del: false, edit: false},
                loading: {add: true}
            };
        },
        created() {
            this.getData();
        },
        mounted() {
            this.uploadAdd = this.$refs.uploadAdd.fileList;
        },
        methods: {
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file, type) {
                const fileList = this.$refs[type].fileList;
                this.$refs[type].fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                file.url = res.requestUrls[0];
                file.name = res.name;
            },
            handleFormatError() {
                this.$Notice.warning({
                    title: '文件出错！格式不对'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '上传文件过大',
                    desc: '文件  ' + file.name + ' 已经超过2M'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadAdd.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '说明图片只能上传一张'
                    });
                }
                return check;
            },
            getData() {
                let self = this;
                util.ajaxY('/sys/dicProcessMode/list', {
                    companyId: 0,
                    pageIndex: this.page,
                    pageSize: this.size
                }, function (d) {
                    if (d.code === '0') {
                        self.dts = d.data.rows;
                        self.total = d.data.total;
                    }
                }, self)
            },
            addbt() {
                this.$refs['formValidate'].resetFields();
                this.mod.add = true;
            },
            deleteFn() {
                let self = this;
                util.ajaxY('/sys/dicProcessMode/del', {id: this.curId}, function (d) {
                    if (d.code === '0') {
                        self.$Message.info(d.msg);
                        self.mod.del = false;
                        self.getData();
                    }
                }, self)
            },
            updateImage(callback) {
                let json = {
                    type: 0,
                    path: this.uploadEdit[0].url,
                    filename: this.uploadEdit[0].name,
                    parentId: this.formedit.id,
                    id: this.formedit.imageId
                };
                let self = this;
                util.ajaxY("/common/updateImage", json,
                    function (d) {
                        if (d.code === '0') {
                            // self.formedit.imageId = d.data.id;
                            self.mod.add = false;
                            callback();
                        } else {
                            self.$Message.error('图片更新失败！');
                        }
                    },
                    self
                );
            },
            contrEditfn() {
                let self = this;
                this.updateImage(function () {
                    self.$refs.formedit.validate(valid => {
                        if (valid) {
                            util.ajaxY(
                                "/sys/dicProcessMode/update",
                                self.formedit,
                                function (d) {
                                    if (d.code === '0') {
                                        self.mod.edit = false;
                                        self.$Message.info('成功');
                                        self.getData();
                                    }
                                },
                                self
                            );
                        }
                    });
                });
            },
            saveImage(callback) {
                let json = {
                    type: 0,
                    path: this.uploadAdd[0].url,
                    filename: this.uploadAdd[0].name
                };
                let self = this;
                util.ajaxY("/common/saveImage", json,
                    function (d) {
                        if (d.code === '0') {
                            self.formValidate.imageId = d.data.id;
                            self.mod.add = false;
                            callback();
                        } else {
                            self.$Message.error('图片保存失败！');
                        }
                    },
                    self
                );
            },
            contrAddfn() {
                let self = this;
                this.saveImage(function () {
                    self.$refs.formValidate.validate(valid => {
                        if (valid) {
                            util.ajaxY(
                                "/sys/dicProcessMode/insert",
                                self.formValidate,
                                function (d) {
                                    if (d.code === '0') {
                                        self.mod.add = false;
                                        self.$Message.info('成功');
                                        self.getData();
                                        self.uploadAdd = [];
                                    } else {
                                        self.$Message.error('数据添加失败！');
                                    }
                                },
                                self
                            );
                        }
                    });
                });
            },
            changePage(pageIndex) {
                this.page = pageIndex;
                this.getData();
            }
        }
    };
</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
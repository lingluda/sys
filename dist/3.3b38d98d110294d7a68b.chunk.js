webpackJsonp([3],{675:function(t,e,a){a(704);var o=a(38)(a(698),a(719),"data-v-1a930f9f",null);o.options.__file="D:\\work\\stone-api\\webstatic\\sys\\src\\views\\userManage\\user\\spreaduser.vue",o.esModule&&Object.keys(o.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),o.options.functional&&console.error("[vue-loader] spreaduser.vue: functional components are not supported with templates, they should use render functions."),t.exports=o.exports},698:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=a(57),r=o(s),i=a(39);o(i);e.default={data:function(){var t=this,e=function(e,a,o){""===a?o(new Error("请输入确认密码!")):a!==t.formValidate.password?o(new Error("两次密码不一致!")):o()},a=function(e,a,o){""===a||(a!==t.formEdit.password?o(new Error("两次密码不一致!")):o())},o=function(t,e,a){""===e?a(new Error("请输入手机号码!")):/^1[0-9]{10}$/.test(e)?a():a(new Error("请输入正确的手机号码!"))};return{zt:[{value:"1",label:"禁用"},{value:"0",label:"启用"}],status:"",imgUrl:"",curId:0,selRole:"",tabload:!0,total:0,size:12,page:1,searchDate:{account:""},columns:[{title:"序号",type:"index",width:90,align:"center"},{title:"推广账号",key:"account"},{title:"创建时间",key:"gmtCreate"},{title:"更新时间",key:"gmtModified"},{title:"状态",key:"status",render:function(t,e){return t("div",["启用","禁用"][e.row.status])}},{title:"操作",width:220,render:function(e,a){return e("div",[e("Button",{props:{size:"small"},style:{marginRight:"5px"},on:{click:function(){t.getRoles(),t.dt=a.row,t.formEdit={account:a.row.account,name:a.row.name,phone:a.row.phone,status:t.status},t.mod.edit=!0}}},"编辑"),e("Button",{props:{size:"small"},style:{marginRight:"5px"},on:{click:function(){t.curId=a.row.id,t.mod.del=!0}}},"删除")])}}],formValidate:{account:"",name:"",password:"",passwordCheck:"",phone:""},ruleValidate:{account:[{required:!0,min:3,message:"请输入登录账号并不少于3位"}],name:[{required:!0,message:"请输入姓名"}],password:[{required:!0,min:6,message:"请输入登录密码并不少于6位"}],passwordCheck:[{validator:e,required:!0,trigger:"blur"}],phone:[{validator:o,trigger:"blur",required:!0}]},formEdit:{name:"",phone:"",account:"",password:"",passwordCheck:"",status:""},ruleEditdate:{account:[{required:!0,min:3,message:"请输入登录账号并不少于3位"}],name:[{required:!0,message:"请输入姓名"}],password:[{required:!1,min:6,message:"请输入登录密码并不少于6位"}],passwordCheck:[{validator:a,required:!1,trigger:"blur"}],phone:[{validator:o,trigger:"blur",required:!0}]},dts:[],dt:{},roles:[],mod:{add:!1,unable:!1,edit:!1,role:!1,showimg:!1,del:!1},loading:{add:!0}}},created:function(){this.getData()},methods:{getData:function(){var t=this,e={account:r.default.trim(t.searchDate.account),pageIndex:this.page,pageSize:this.size};r.default.ajaxY("/sys/employUser/spreadList",e,function(e){0==e.code&&(t.dts=e.data.rows,console.log("1213213413:"+e.data.rows),t.total=e.data.total)},t)},addbt:function(){this.$refs.formValidate.resetFields(),this.mod.add=!0},contrAddfn:function(){var t=this,e={account:this.formValidate.account,password:this.formValidate.password};this.$refs.formValidate.validate(function(a){a&&r.default.ajaxY("/sys/employUser/insertSpread",e,function(e){0==e.code&&(t.mod.add=!1,t.$Message.info("成功"),t.getData())},t)})},deleteFn:function(){var t=this;r.default.ajaxY("/sys/employUser/delSpread",{id:this.curId},function(e){console.log(e.code),0==e.code&&(t.$Message.info(e.msg),t.mod.del=!1,t.getData())},t)},contrEditfn:function(){var t=this,e={id:this.dt.id,account:this.formEdit.account,password:this.formEdit.password,status:this.status};this.$refs.formEdit.validate(function(a){a&&r.default.ajaxY("/sys/employUser/updateSpread",e,function(e){0==e.code&&(t.mod.edit=!1,t.$Message.info("成功"),t.getData())},t)})},getRoles:function(){var t=this;r.default.ajaxY("/sys/sysRole/list",{pageIndex:1,pageSize:999},function(e){0==e.code&&(t.roles=e.data.rows)},t)},contrRolefn:function(t){console.log("wqrdas:"+t);var e=this;r.default.ajaxY("/sys/sysUserRole/insert",{sysUserId:t,sysRoleId:this.selRole},function(t){0==t.code&&(e.$Message.info("成功"),e.getData(),e.mod.role=!1)},e)},unablefn:function(){var t=this,e={id:this.curId,status:this.status};r.default.ajaxY("/sys/sysUser/sysUserStatus",e,function(e){0==e.code&&(t.mod.unable=!1,t.$Message.info("成功"),t.getData())},t)},handleView:function(t){this.imgUrl=t,this.mod.showimg=!0},changePage:function(t){this.page=t,this.getData()},searchfn:function(){this.page=1,this.getData()},canclefn:function(){this.searchDate={account:""},this.getData()}}}},704:function(t,e){},719:function(t,e,a){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Row",[a("Button",{attrs:{type:"info"},on:{click:t.addbt}},[t._v("新增")]),t._v(" "),a("Modal",{attrs:{title:"新增",width:"460"},model:{value:t.mod.add,callback:function(e){t.$set(t.mod,"add",e)},expression:"mod.add"}},[a("Form",{ref:"formValidate",attrs:{model:t.formValidate,rules:t.ruleValidate,"label-width":120}},[a("FormItem",{attrs:{label:"推广账号：",prop:"account"}},[a("Input",{model:{value:t.formValidate.account,callback:function(e){t.$set(t.formValidate,"account",e)},expression:"formValidate.account"}})],1),t._v(" "),a("FormItem",{attrs:{label:"登录密码：",prop:"password"}},[a("Input",{attrs:{type:"password"},model:{value:t.formValidate.password,callback:function(e){t.$set(t.formValidate,"password",e)},expression:"formValidate.password"}})],1),t._v(" "),a("FormItem",{attrs:{label:"确认登录密码：",prop:"passwordCheck"}},[a("Input",{attrs:{type:"password"},model:{value:t.formValidate.passwordCheck,callback:function(e){t.$set(t.formValidate,"passwordCheck",e)},expression:"formValidate.passwordCheck"}})],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"info",size:"large"},on:{click:t.contrAddfn}},[t._v("确定")])],1)],1),t._v(" "),a("Modal",{attrs:{width:"360"},model:{value:t.mod.del,callback:function(e){t.$set(t.mod,"del",e)},expression:"mod.del"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),t._v(" "),a("span",[t._v("提示")])],1),t._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("确定要删除？")])]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:""},on:{click:function(e){t.deleteFn()}}},[t._v("确定")])],1)]),t._v(" "),a("Modal",{attrs:{title:"编辑",width:"460"},model:{value:t.mod.edit,callback:function(e){t.$set(t.mod,"edit",e)},expression:"mod.edit"}},[a("Form",{ref:"formEdit",attrs:{model:t.formEdit,rules:t.ruleEditdate,"label-width":120}},[a("FormItem",{attrs:{label:"登录账号：",prop:"account"}},[a("Input",{model:{value:t.formEdit.account,callback:function(e){t.$set(t.formEdit,"account",e)},expression:"formEdit.account"}})],1),t._v(" "),a("FormItem",{attrs:{label:"登录密码：",prop:"password"}},[a("Input",{attrs:{type:"password"},model:{value:t.formEdit.password,callback:function(e){t.$set(t.formEdit,"password",e)},expression:"formEdit.password"}})],1),t._v(" "),a("FormItem",{attrs:{label:"确认登录密码：",prop:"passwordCheck"}},[a("Input",{attrs:{type:"password"},model:{value:t.formEdit.passwordCheck,callback:function(e){t.$set(t.formEdit,"passwordCheck",e)},expression:"formEdit.passwordCheck"}})],1),t._v(" "),a("FormItem",{attrs:{label:"状态"}},[a("Select",{model:{value:t.status,callback:function(e){t.status=e},expression:"status"}},t._l(t.zt,function(e,o){return a("Option",{key:o,attrs:{value:e.value}},[t._v(t._s(e.label))])}))],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"info",size:"large"},on:{click:t.contrEditfn}},[t._v("确定")])],1)],1),t._v(" "),a("Modal",{attrs:{title:"配置角色",width:"380"},model:{value:t.mod.role,callback:function(e){t.$set(t.mod,"role",e)},expression:"mod.role"}},[a("Form",{attrs:{"label-width":86}},[a("FormItem",{attrs:{label:"分配角色："}},[a("Select",{model:{value:t.selRole,callback:function(e){t.selRole=e},expression:"selRole"}},t._l(t.roles,function(e){return a("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.name))])}))],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"info",size:"large"},on:{click:t.contrRolefn}},[t._v("确定")])],1)],1),t._v(" "),a("Modal",{attrs:{width:"360"},model:{value:t.mod.unable,callback:function(e){t.$set(t.mod,"unable",e)},expression:"mod.unable"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),t._v(" "),a("span",[t._v(t._s(t.status?"禁用":"启用"))])],1),t._v(" "),t.status?a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("确定要禁用当前用户？")]),t._v(" "),a("p",[t._v("禁用之后，该用户无法登录管理后台")])]):a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("确定要启用当前用户？")]),t._v(" "),a("p",[t._v("启用之后，该用户便可以登录管理后台.")])]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:""},on:{click:t.unablefn}},[t._v("确定")])],1)]),t._v(" "),a("Modal",{attrs:{title:"查看图片",styles:{top:"20px"}},model:{value:t.mod.showimg,callback:function(e){t.$set(t.mod,"showimg",e)},expression:"mod.showimg"}},[a("img",{staticClass:"fulWidth",attrs:{src:t.imgUrl}})])],1),t._v(" "),a("Row",{staticClass:"margin-top-10 tab minW"},[a("Table",{staticClass:"bgW",attrs:{loading:t.tabload,size:"small",stripe:"",border:"",columns:t.columns,data:t.dts}})],1),t._v(" "),a("Page",{staticClass:"taRit",attrs:{total:t.total,"page-size":t.size,"show-total":!0,current:t.page},on:{"on-change":t.changePage}})],1)},staticRenderFns:[]},t.exports.render._withStripped=!0}});
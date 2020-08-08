<template>
    <div class="container" @keyup.enter="searchData">
        <Container class="filter">
            <Collapse :value="'1'">
                <CollapseItem title="搜索查询" style="padding-left: 10px" name="1" >
            <Header style="width:100%;height:auto">
                <Form class="filter-outer" :model="form" :inline="true">
                    <FormItem class="filter-item" label="岗位编码" style="margin-right: 26px">
                        <Input v-model="form.postCodeLike" size="small" placeholder="请输入岗位编码"/>
                    </FormItem>
                    <FormItem class="filter-item" label="岗位名称" style="margin-right: 26px">
                        <Input v-model="form.postName" size="small" placeholder="请输入岗位名称"/>
                    </FormItem>
                    <div class="filter-button">
                        <Button type="primary" size="small" @click="searchData">查询
                        </Button>
                        <Button type="primary" size="small" @click="resetData">重置</Button>
                    </div>
                </Form>
            </Header>
                </CollapseItem>
            </Collapse>
        </Container>
        <Container class="table-list" direction="vertical">
            <Header class="table-buttons" height="42" style="text-align: right">

                <Button type="success" icon="el-icon-plus" size="small" @click="showChangeDialog"
                        style="margin-left:10px">新建
                </Button>
                <Button type="danger" icon="el-icon-delete" size="small" @click="deleteList" style="margin-left:10px">
                    删除
                </Button>
            </Header>
            <Main style="width:100%">
                <Table tooltip-effect="dark" ref="multipleTable" v-loading="loadings[0]" element-loading-text="拼命加载中"
                       element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)"
                       @selection-change="handleSelectionChange" @sort-change="sortChange" max-height="513"
                       :border='true' :data="tableList">
                    <TableColumn type="selection" width="55" align="center" fixed="left"/>

                    <TableColumn :show-overflow-tooltip="true" prop="postCode" sortable="custom" label="岗位编码"/>
                    <TableColumn :show-overflow-tooltip="true" prop="postName" sortable="custom" label="岗位名称"/>
                    <TableColumn prop="data" label="操作" width='120' align="center" fixed="right">
                        <template slot-scope="scope">
                            <Button  type="text" @click="showDetailDialog(scope)" size="small">查看</Button>
                            <Button  type="text" @click="showChangeDialog(scope)" size="small">编辑</Button>
                        </template>
                    </TableColumn>
                </Table>
                <Row justify="center" type="flex">
                    <Pagination
                            style="margin-top:10px"
                            @current-change="pageChange"
                            @size-change="sizeChange"
                            :page-size="10"
                            :total="tableCount"
                            :background="true"
                            :small="true"
                            :page-sizes="[15, 30, 50, 100]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="form.page"
                    ></Pagination>
                </Row>
            </Main>
        </Container>

        <!-- 详情 -->
        <Dialog :visible.sync="detailDialogVisible"  width="950px" :before-close='closeDialog'>
            <!--            头部-->
            <p slot="title" v-if='dialogType == 1'
               style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                新增数据
            </p>
            <p slot="title" v-if='dialogType == 2'
               style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                编辑信息
            </p>
            <p slot="title" v-if='dialogType == 3'
               style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                查看信息
            </p>
            <!--                内容-->
            <div class="dialog-content" style="padding:0 50px">
                <Form label-position="top" :disabled="dialogType==3" ref="dialogForm" :model="dialogInfo">
                    <Row :gutter="48">

                        <Col :span="24">
                            <FormItem class="filter-item" label="岗位编码:" prop="postCode"
                                      :rules="{ required: true, message: '岗位编码不能为空', trigger: 'blur'}">
                                <Input
                                        v-model="dialogInfo.postCode"
                                        size="small"
                                        style="width: 100%;"
                                        placeholder="请输入岗位编码"
                                />
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem class="filter-item" label="岗位名称:" prop="postName"
                                      :rules="{ required: true, message: '岗位名称不能为空', trigger: 'blur'}">
                                <Input
                                        v-model="dialogInfo.postName"
                                        size="small"
                                        style="width: 100%;"
                                        placeholder="请输入岗位名称"
                                />
                            </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem class="filter-item" label="角色:" prop="roleBaseList"
                                      :rules="{ required: true, message:'角色不能为空', trigger: 'blur'}">
                                <Select
                                        v-model="roleBaseTemList"
                                        :clearable="true"
                                        placeholder="请选择角色"
                                        style="width: 100%;"
                                        size="small"
                                        multiple
                                >
                                    <Option
                                            v-for="item in getRoleList"
                                            :label="item.roleName"
                                            :key="item.roleId"
                                            :value="item.roleId"
                                    >
                                        {{ item.roleName }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <!--            尾部-->
            <div slot="footer" class="dialog-footer">
                <Button @click="closeDialog" size='small'>取 消</Button>
                <Button @click="addList" v-if="dialogType == 1 " size='small' type="primary">保 存</Button>
                <Button @click="changeList" v-if="dialogType == 2 " size='small' type="primary">保 存</Button>
            </div>
        </Dialog>


    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {setRes} from "@/utils";
    import {
        Button,
        Form,
        FormItem,
        Container,
        Header,
        Main,
        Select,
        Option,
        Row,
        Col,
        Input,
        DatePicker,
        Table,
        TableColumn,
        Pagination,
        Dialog,
        Message,
        Popover,
        Loading,
        MessageBox,
        Icon,
        TimeSelect,
        Collapse,
        CollapseItem
    } from "element-ui";
    import {GetPage, AddEx, ModifyEx, Removes, GetEx, GetRoleList} from "./service";

    Vue.use(Loading)
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$Message = Message
    type tableListType = {
        [index: string]: string;
    };

    type rowType = {
        row: object;
        type: string;
    };
    type codeType = {
        label: string;
        value: string;
        color?: string;
    };

    @Component({
        components: {
            Button,
            Form,
            FormItem,
            Container,
            Header,
            Main,
            Select,
            Option,
            Row,
            Col,
            Input,
            DatePicker,
            Table,
            TableColumn,
            Pagination,
            Dialog,
            Popover,
            Icon,
            TimeSelect,
            Collapse,
            CollapseItem
        }
    })
    export default class Index extends Vue {
        $msgbox:any
        $Message:any
        loadings: boolean[] = [false, false];
        //列表list
        tableList = [];
        tableCount: number = 0;
        //字典表变量

        undefined: codeType[] = [];
        getRoleList: codeType[] = [];

        detailDialogVisible: boolean = false;
        dialogType: number = 0; // 1新建 2改变 3 查看
        // dialog详情数据
        dialogInfo: { roleBaseList?: { roleId: string }[] } = {};
        roleBaseTemList: string[] = []

        // 过滤条件
        form: any = {page: 1, rows: 15, oi: "", ot: ""};

        // 列表多选list
        selectList = [];

        async mounted() {
            this.getList();
            this.getCodeList();
        }

        // 增删改查

        async getList() {
            this.$set(this.loadings, 0, true);
            let p = Object.assign({}, this.form);
            let res = await GetPage(p);
            this.tableList = res.list;
            this.tableCount = res.count;
            this.$set(this.loadings, 0, false);
        }

        async addList() {
            this.formatRoleList()
            // @ts-ignore
            this.$refs["dialogForm"].validate(async (valid: boolean) => {
                if (valid) {
                    await this.$msgbox.confirm("此操作将新增信息, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    });
                    let res = await AddEx(this.dialogInfo);
                    setRes(res, () => {
                       if (res.errorCode === '0') {
                             // 操作成功的回调
                            this.$Message.success('保存成功!');
                            this.getList();
                            this.detailDialogVisible = false
                         }else{
                            this.$Message.success('保存失败!'+res.errorMsg);
                         }
                    });
                } else {
                    this.$Message.error("操作失败!");
                }
            });
        }

        async changeList() {
            this.formatRoleList()
            // @ts-ignore
            this.$refs["dialogForm"].validate(async (valid: boolean) => {
                if (valid) {
                    await this.$msgbox.confirm("此操作将修改信息, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    });
                    let res = await ModifyEx(this.dialogInfo);
                    setRes(res, () => {
                        // 操作成功的回调
                        this.$Message.success("修改成功!");
                        this.getList();
                        this.detailDialogVisible = false;
                    });
                } else {
                    this.$Message.error("操作失败!");
                }
            });
        }

        // 显示修改详情
        async showChangeDialog(e: rowType) {
            this.dialogInfo = {};
            if (e.type !== "click") {
                // 更改
                await this.getDetail(e.row);
                this.dialogType = 2;
            } else {
                // 新建
                this.dialogType = 1;
            }
            this.detailDialogVisible = true;
        }

        async deleteList() {
            if (this.selectList.length === 0) {
                this.$Message.error("请选择删除内容!");
                return false;
            }
            await this.$msgbox.confirm("此操作将删除选择内容, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });
            let res = await Removes(this.selectList);
            setRes(res, () => {
                // 操作成功的回调
                this.getList();
                this.$Message.success("删除成功!");
            });
        }

        async getDetail(e: object) {
            let res = await GetEx(e);
            let tem = []
            for (let item of res.roleBaseList) {
                tem.push(item.roleId)
            }
            this.dialogInfo = res;
            this.roleBaseTemList = tem
        }

        formatRoleList() {
            let tem = []
            for (let item of this.roleBaseTemList) {
                tem.push({roleId: item})
            }
            this.dialogInfo.roleBaseList = tem
        }

        // 显示修改详情
        async showDetailDialog(e: rowType) {
            // 查看
            this.dialogInfo = {};
            await this.getDetail(e.row);
            this.dialogType = 3;
            this.detailDialogVisible = true;
        }

        async getCodeList() {
            this.getRoleList = await GetRoleList({});
        }

        // 列表多选
        handleSelectionChange(e: []) {
            this.selectList = e;
            // console.log(e);
        }

        sortChange({prop, order}: { prop: string; order: string }) {
            this.form.oi = prop;
            this.form.ot = order === "ascending" ? "asc" : "desc";
            this.getList();
        }

        // pagination 改变
        pageChange(e: number) {
            this.form.page = e;
            this.getList();
        }

        // pagination size改变
        sizeChange(e: number) {
            this.form.page = 1;
            this.form.rows = e;
            this.getList();
        }

        // 搜索
        searchData() {
            this.form.page = 1;
            this.getList();
        }

        //重置
        resetData() {
            this.form = {page: 1, rows: 15, oi: "", ot: ""};
            this.getList();
        }
        closeDialog(){
            // @ts-ignore
            this.$refs["dialogForm"].resetFields();
            this.detailDialogVisible=false;
        }
    }
</script>

<style lang="scss">
    .container {
        width: 100%;
    }

    .filter,
    .table-list {
        font-size: 14px;
        padding: 10px;
        box-shadow: 0px 0px 7px rgba(170, 170, 170, 0.5);
        width: 98%;
        margin: 0 auto;
        margin-top: 10px;
        overflow: hidden;
    }

    .dialog-title {
        display: inline-block;
        width: 120px;
        text-align: right;
    }

    .dialog-line {
        height: 46px;
        box-sizing: border-box;
    }

    .filter-outer {
        display: inline-block;
        float: left;
        overfloat: hidden;
        width: 100%;
    }

    .filter-button {
        padding-top: 10px;
        text-align: right;
        float: right;
        width: 150px;
    }

    .warn-text {
        color: red;
    }
</style>

<template>
  <el-card class="box">
    <!-- 面包屑 -->

    <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
    <el-row class="searchBox">
      <el-col>
        <el-input clearable class="searchInput" placeholder="请输入内容" @clear="searchInput()" v-model="query">
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>


    <el-table :data='list' style="width: 100%">
      <el-table-column prop="id" label="#" width="80">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="140">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="140">
      </el-table-column>
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">
          <!-- 内层 list.row 表示的是list的每个对象-->
          {{scope.row.create_time|fmtdate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <!-- 内容 -->
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="showDiaEditUser(scope.row)" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" @click="showMsgBox(scope.row)" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="pagesizes" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色表单 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="用户名">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色">
          <!-- {{selevtval}} -->
          <el-select v-model="selevtval" placeholder="请选择角色名">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item) in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        query: '',
        list: [],
        pagenum: 1,
        pagesize: 2,
        total: -1,
        pagesizes: [2, 4, 6, 8],
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        dialogFormVisible: false,
        formdata: {
          username: "",
          password: "",
          email: "",
          mobile: ""
        },
        selevtval: -1,
        currUsername: "",
        roles: [],
        currUserId: -1
      }
    },
    created() {
      this.getTableData()
    },
    methods: {
      async setRole() {
        const res = await this.$http.put(`users/${this.currUserId}/role`, {
          // rid角色id
          rid: this.selevtval
        });
        const {
          meta: {
            msg,
            status
          }
        } = res.data;
        if (status === 200) {
          // 关闭对话框
          this.dialogFormVisible = false;
          this.$message.success(msg);
        }
      },
      async showDiaSetRole(user) {
        this.dialogFormVisible = true
        this.currUsername = user.username;
        this.currUserId = user.id

        const res = await this.$http.get(`roles`);
        // console.log(res);
        const {
          meta: {
            msg,
            status
          },
          data
        } = res.data;
        if (status === 200) {
          this.roles = data;
          // console.log(this.roles);
        }

        const res2 = await this.$http.get(`users/${user.id}`);
        // console.log(res2);
        // const {
        //   meta: { msg2, status2 },
        //   data2
        // } = res2.data;
        // if (status2 === 200) {

        // 所有角色5个[每个角色有自己的id]
        // 用户信息中也有rid 角色rid
        //
        this.selevtval = res2.data.data.rid;
      },

      // 修改状态
      async changeState(user) {
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        const {
          meta: {
            msg,
            status
          }
        } = res.data
        if (status === 200) {
          this.$message.success(msg)
        }
      },
      // 提交编辑表格
      async editUser() {
        const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata);
        const {
          meta: {
            msg,
            status
          }
        } = res.data
        if (status === 200) {
          this.dialogFormVisibleEdit = false;
          this.$message.success('编辑成功');
          this.getTableData()
        }
      },

      // 打开对话框
      async showDiaEditUser(user) {
        this.dialogFormVisibleEdit = true;
        const res = await this.$http.get(`users/${user.id}`);
        this.formdata = res.data.data
      },

      // 显示确认提示框
      showMsgBox(user) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: {
              msg,
              status
            }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData()
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 添加用户
      async addUser() {
        const res = await this.$http.post(`users`, this.formdata);
        this.dialogFormVisibleAdd = false
        // console.log(res)
        this.getTableData();

      },

      // 显示添加用户表单
      showDiaAddUser() {
        this.formdata = {};
        this.dialogFormVisibleAdd = true
      },
      // 删除搜索
      searchInput() {
        this.getTableData();
      },

      // 搜索用户
      searchUser() {
        this.pagenum = 1;
        this.getTableData();
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagenum = 1;
        this.pagesize = val;
        this.getTableData();
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pagenum = val;

        this.getTableData();
      },
      // 获取所有用户表单
      async getTableData() {
        const AUTH_TOKEN = localStorage.getItem("token");
        // console.log(AUTH_TOKEN);
        this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        const res = await this.$http.get(
          `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        const {
          data,
          meta: {
            status,
            msg
          }
        } = res.data
        if (status === 200) {
          this.total = data.total;
          this.list = data.users;
          // console.log(this.list)
        }
      }
    },
  }

</script>

<style scoped>
  .searchBox {
    margin-top: 20px;
  }

  .searchInput {
    width: 400px;
  }

</style>

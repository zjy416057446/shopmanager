<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>
    <el-table :data="roles" height="450px" style="width: 100%">
      <el-table-column type="expand" style="height: 100%">
        <template slot-scope="scope">
          <el-row class="leve1" v-for="(item) in scope.row.children" :key="item.id">
            <el-col :span='4'>
              <el-tag @close="deleRights(scope.row,item)" class="tag" type='' closable>{{item.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span='20'>
              <el-row v-for="(item2) in item.children" :key="item2.id">
                <el-col :span='4'>
                  <el-tag @close="deleRights(scope.row,item2)" class="tag" type='success' closable>{{item.authName}}</el-tag>
                  <!-- <i class="el-icon-arrow-right"></i> -->
                </el-col>
                <el-col :span='20'>
                  <el-tag @close="deleRights(scope.row,item3)" closable class="tag" type='danger' v-for="(item3) in item2.children"
                    :key="item3.id">
                    {{item.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="160"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="160"></el-table-column>
      <el-table-column label="操作" width="360">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!-- node-key 每个节点唯一标识,值来源于treedata中的key名 -->
      <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck"
        :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        roles: [],
        dialogFormVisible: false,
        treedata: [],
        arrCheck: [],
        // 配置选项
        defaultProps: {
          // label和children值来源于树形结构绑定数据treedata中的key名
          label: "authName",
          children: "children"
        },
        currRoleId: -1
      }
    },
    created() {
      this.getRoles()
    },
    methods: {
      async setRights() {


        const arr1 = this.$refs.treeDom.getCheckedKeys();
        // console.log(arr1);

        // 获取树形结构中半选id
        const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
        // console.log(arr2);

        // ES6 展开操作运算符
        const arr = [...arr1, ...arr2];
        console.log(this.currRoleId);

        // 发送请求
        // roles/:roleId/rights
        // roleId当前角色id
        const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
          rids: arr.join(",")
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.dialogFormVisible = false;
          this.getRoles();
        }
      },
      async deleRights(role, rights) {
        const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
        const {
          meta: {
            msg,
            status
          },
          data
        } = res.data
        if (status === 200) {
          // console.log(data);

          this.$message.success(msg)

          role.children = data

        }

      },
      async showDiaSetRights(role) {
        this.currRoleId = role.id;
        const res = await this.$http.get(`rights/tree`);
        // console.log(res);
        const {
          meta: {
            msg,
            status
          },
          data
        } = res.data;
        // console.log(res);

        if (status === 200) {
          this.treedata = data;
        }
        const temp = [];
        role.children.forEach(item1 => {
          // temp.push(item1.id);
          item1.children.forEach(item2 => {
            // temp.push(item2.id);
            item2.children.forEach(item3 => {
              temp.push(item3.id);
            });
          });
        });
        // console.log(temp);
        this.arrCheck = temp;
        this.dialogFormVisible = true
      },
      async getRoles() {
        const res = await this.$http.get(`roles`);
        this.roles = res.data.data;
        // console.log(this.roles);
      }
    },
  }

</script>

<style lang="" scoped>
  /* .box {
    height: 100%;
  } */

  .btn {
    margin-top: 30px;
  }

  .leve1 {
    margin-bottom: 5px;
  }

  .tag {
    margin-bottom: 5px;
    margin-right: 5px;
  }

</style>

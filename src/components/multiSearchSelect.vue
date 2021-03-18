<template>
  <div class="muti-select-container">
    <div ref="showSelectedBox" @click="toggleShowList" class="show-selected-box" :class="isOpen && selectData.length?'open':'ellipsis'" :style="'height:' + (isOpen&&this.selectData.length?'auto':'30px')">
      <div class="please-select" v-show="!selectData.length">{{placeholder || $t('common.pleaseSelect')}}</div>
      <span class="item-box" v-for="(item, index) in selectData" :key="index">
        <span class="content-name ellipsis" @mouseover="handleMouseOverTemp($event, item.label)" @mouseout="handleMouseOutTemp">{{item.label}}</span>
        <i class="el-icon-close" @click.stop="delItem(item.value, index)"></i>
      </span>
    </div>
    <div ref="waitSelectBox" class="wait-select-box" v-show="selecting">
      <el-input class="search-input" v-model="searchKey" suffix-icon="tree-search-icon" @input="handleEnter" @click.native="handleClickOnTreeSearchInput">
        <i slot="suffix" v-show="searchKey" @click="delSearchKey" class="el-input__icon el-icon-circle-close el-input__clear" style="margin-right: 14px;"></i>
      </el-input>
      <div class="wait-item-ul">
        <div class="wait-select-item" v-for="(item, index) in listData" :key="index" @click="changeSelect(item, index)">
          <el-checkbox v-model="item.checked" @change="changeSelect(item, index, true)" @click.native.stop="void 0"></el-checkbox>
          <span @mouseover="handleMouseOverTemp($event, item.label)" @mouseout="handleMouseOutTemp" class="ellipsis name">{{item.label}}</span>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" ref="tooltip" :content='tooltipContent'></el-tooltip>
    <span class="control-open" @click="toggleOpen" v-show="selectData.length">{{isOpen ? $t('common.close') : $t('common.extend')}}</span>
  </div>
</template>
<script>
import { tooltipMixin } from "@/components/mixin";
import utils from "@/common/js/utils";
let clickEvent = null;
export default {
  mixins: [tooltipMixin],
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      searchKey: "",
      isOpen: false,
      // 选中的数据
      selectData: [],
      selecting: false,
      compositioning: false,
      listData: [],
    };
  },
  methods: {
    handleClickOnTreeSearchInput(e) {
      // 如果是点击在搜索图标上，就去查询
      if (
        e &&
        e.target &&
        e.target.className &&
        e.target.className.includes("el-input__icon") &&
        !e.target.className.includes("el-icon-circle-close")
      )
        this.handleEnter();
    },
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    delItem(value, index) {
      this.list.map((item) => {
        if (item.value == this.selectData[index].value) {
          item.checked = false;
        }
      });
      this.selectData.splice(index, 1);
      this.$emit("input", this.selectData);
    },
    toggleShowList() {
      this.selecting = !this.selecting;
    },
    changeSelect(item, index, isClickOnCheckBox) {
      !isClickOnCheckBox &&
        (this.listData[index].checked = !this.listData[index].checked);
      if (!this.listData[index].checked) {
        this.selectData = this.selectData.filter((Item) => {
          return Item.value != item.value;
        });
        this.$emit("input", this.selectData);
      } else {
        this.selectData.push({
          value: item.value,
          label: item.label,
        });
        this.$emit("input", this.selectData);
      }
    },
    listChange() {
      let data = [];
      let listTemp = this.list.map((item) => {
        item = JSON.parse(JSON.stringify(item));
        item.checked = false;
        return item;
      });
      for (let i = 0, length = listTemp.length; i < length; i++) {
        for (let j = 0, lengthJ = this.value.length; j < lengthJ; j++) {
          if (this.value[j].value == listTemp[i].value) {
            listTemp[i].checked = true;
            break;
          } else {
            listTemp[i].checked = false;
          }
        }
      }
      this.listData = listTemp;
    },
    handlecompositionstart() {
      this.compositioning = true;
    },
    handlecompositionend() {
      this.compositioning = false;
    },
    search() {
      this.$emit("search", this.searchKey);
    },
    handleEnter() {
      this.debounce(() => {
        if (this.compositioning) return;
        this.search();
      }, 200)();
    },
    delSearchKey() {
      this.searchKey = "";
      this.$emit("search", this.searchKey);
    },
  },
  mounted() {
    const that = this;
    clickEvent = function (e) {
      if (
        e.path.indexOf(that.$refs.waitSelectBox) == -1 &&
        e.path.indexOf(that.$refs.showSelectedBox) == -1
      ) {
        that.selecting = false;
      }
    };
    document.addEventListener("click", clickEvent);
    this.selectData = JSON.parse(JSON.stringify(this.value));
    this.listChange();
  },
  beforeDestroy() {
    document.removeEventListener("click", clickEvent);
  },
  watch: {
    value() {
      this.selectData = JSON.parse(JSON.stringify(this.value));
      this.listChange();
    },
    list() {
      this.listChange();
    },
  },
};
</script>
<style lang="scss">
.muti-select-container {
  position: relative;
  user-select: none;
  .control-open {
    position: absolute;
    right: 0;
    top: 0;
    display: block;
    height: 30px;
    line-height: 30px;
    color: #409eff;
    cursor: pointer;
    user-select: none;
  }
  .show-selected-box {
    width: calc(100% - 35px) !important;
    border: 1px solid #dedede;
    background: #fff;
    position: relative;
    cursor: pointer;
    .please-select {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      line-height: 28px;
      text-align: center;
    }
    .item-box {
      box-sizing: border-box;
      margin: 2px 0 2px 6px;
      background-color: #f0f2f5;
      height: 24px;
      padding: 0 8px;
      line-height: 22px;
      border-radius: 4px;
      border: 1px solid transparent;
      white-space: nowrap;
      color: #909399;
      display: inline-block;
      .content-name {
        color: #909399;
        white-space: nowrap;
        font-size: 12px;
        display: inline-block;
        max-width: 50px;
      }
      .el-icon-close {
        background-color: #c0c4cc;
        // right: -7px;
        top: -7px;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 10px;
        height: 12px;
        width: 12px;
        line-height: 13px;
        vertical-align: middle;
        &:hover {
          background: #f23838;
        }
      }
    }
    &.open {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .wait-select-box {
    position: absolute;
    width: calc(100% - 35px) !important;
    max-height: 300px;
    border: 1px solid #dedede;
    top: calc(100% + 1px);
    background: #fff;
    padding: 10px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    .search-input {
      .el-input__inner {
        height: 30px;
      }
      .tree-search-icon {
        top: 12px;
      }
    }
    .wait-item-ul {
      flex: 1;
      overflow-y: auto;
      .wait-select-item {
        height: 30px;
        padding-left: 10px;
        display: flex;
        cursor: pointer;
        .name {
          flex: 1;
          margin-left: 10px;
        }
      }
    }
  }
}
i.tree-search-icon {
  position: absolute;
  cursor: pointer;
  top: 7px;
  right: 1px;
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url("~@/common/img/search-N.png") no-repeat;
  &:hover {
    background: url("~@/common/img/search-H.png") no-repeat;
  }
}
</style>



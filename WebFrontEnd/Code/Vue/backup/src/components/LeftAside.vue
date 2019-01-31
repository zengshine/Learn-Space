<template>
<aside class="left-aside slideIn" @click="hideLeftAside">
    <section class="left-aside-mask"></section>
    <section class="left-aside-content">
        <nav>
            <ul>
                <li class="person-info">
                    <article>
                        <section class="account-items-ct flex-row">
                            <div class="cur-account">
                                <span class="cur-account-item"><i class="fa fa-user"></i></span>
                            </div>
                            <div class="account-list flex-row">
                                <span class="other-account-item" v-for="item in [1,2,3]" :key="item"><i class="fa fa-envelope"></i></span>
                            </div>
                        </section>
                        <section class="account-info flex-row">
                            <div>
                                <div class="name">welcome to gmail</div>
                                <div class="address">shineview2018@gamil.com</div>
                            </div>
                            <div class="account-caret flex-center">
                                <span><i class="fa fa-caret-down"></i></span>
                            </div>
                        </section>
                    </article>
                </li>
                <li class="nav-info">
                    <ul>
                        <li class="nav-section-ct">
                            <section class="nav-section">
                                <div class="mg-v-10">recent label</div>
                                <ul>
                                    <li class="nav-item flex-row">
                                        <div class="item-icon"><i class="fa fa-box"></i></div>
                                        <div class="item-name">Inbox</div>
                                        <div class="item-count">99+</div>
                                    </li>
                                </ul>
                            </section>
                        </li>
                        <li>
                            <section class="nav-section">
                                <div class="mg-v-10">all label</div>
                                <ul>
                                     <li class="nav-item flex-row" v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13]" :key="item">
                                        <div class="item-icon"><i class="fa fa-box"></i></div>
                                        <div class="item-name">Inbox</div>
                                        <div class="item-count">99+</div>
                                    </li>
                                </ul>
                            </section>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </section>
</aside>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class vHeader extends Vue {
  private heights?: number;
  @Prop({ default: 100 })
  height!: number;
  data() {
    return {
      heights: 0
    };
  }
  created() {
    let vm = this;
    console.log("created");
  }
  mounted() {}
  hideLeftAside() {
    var vm = this;
    vm.$emit("hideLeftAside");
  }
}
</script>
<style lang="scss" scoped>
%zero-position {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.left-aside-mask {
  position: absolute;
  @extend %zero-position;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.left-aside {
  position: fixed;
  @extend %zero-position;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.slideIn {
  animation-name: left2right;
  animation-duration: 0.2s;
  animation-timing-function: ease-in-out;
}
@keyframes left2right {
  from {
    transform: translate(-100%);
  }
  to {
    transform: translate(0);
  }
}
.left-aside-content {
  width: 78%;
  height: 100%;
  background: #fff;
  overflow: auto;
}
.person-info {
  height: 125px;
  padding: 15px 15px 10px 15px;
  background: #1c80e7;
}
.account-items-ct {
  justify-content: space-between;
}
%account-item {
  display: inline-block;
  color: #fff;
  background: #000;
  border-radius: 50%;
  text-align: center;
}
.cur-account-item {
  @extend %account-item;
  width: 55px;
  height: 55px;
  font-size: 35px;
}
.other-account-item {
  @extend %account-item;
  width: 30px;
  height: 30px;
  font-size: 18px;
  margin: 0 0px 10px 10px;
}
.other-account-item .fa {
  vertical-align: -5px;
}
.cur-account-item .fa {
  vertical-align: -10px;
}
.account-info {
  justify-content: space-between;
  align-items: stretch;
  margin-top: 15px;
  color: #fff;
  line-height: 18px;
  .name {
    font-size: 16px;
    font-weight: bold;
  }
  .address {
    color: #c5bebe;
  }
  .account-caret {
    font-size: 18px;
  }
}
.nav-info {
  .nav-section-ct:not(:last-child) {
    border-bottom: 1px solid #e7e7e7;
  }
  .nav-section {
    padding: 0 15px;
  }
  .nav-item {
    font-size: 16px;
    margin: 20px 0px;
    .item-icon {
      width: 20%;
    }
    .item-name {
      width: 70%;
      font-weight: bold;
    }
    .item-count {
      width: 10%;
      font-size: 12px;
    }
  }
}
</style>

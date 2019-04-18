import Vue from "vue";
import { Header, Swipe, SwipeItem, InfiniteScroll, Popup } from "mint-ui";
Vue.component(Header.name, Header);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.use(InfiniteScroll);
import Vue from "vue";
import { Header, Swipe, SwipeItem, InfiniteScroll, Popup, Actionsheet } from "mint-ui";
Vue.component(Header.name, Header);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.component(Actionsheet.name, Actionsheet);
Vue.use(InfiniteScroll);
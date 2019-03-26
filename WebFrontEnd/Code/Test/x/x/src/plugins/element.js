import Vue from 'vue'
import { Button } from 'element-ui'
// import { Row } from 'element-ui'
// import { Col } from 'element-ui'
// import { Tree } from 'element-ui'
// import { Icon } from 'element-ui'
// import { Input } from 'element-ui'
import { Select } from 'element-ui'
import { Option } from 'element-ui'
import { Message } from 'element-ui'
import { Pagination } from 'element-ui'
// import { Tooltip } from 'element-ui'
import { Checkbox } from 'element-ui'
import { CheckboxGroup } from 'element-ui'
// import { Radio } from 'element-ui'
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Dialog } from 'element-ui'
// import { Form } from 'element-ui'
// import { FormItem } from 'element-ui'
// import { Input } from 'element-ui'
import { MessageBox } from 'element-ui'
// import { Popover } from 'element-ui'
// import { Cascader } from 'element-ui'
// import { Carousel } from 'element-ui'
// import { CarouselItem } from 'element-ui'
import { DatePicker } from 'element-ui'
import { Switch } from 'element-ui'
import { Loading } from 'element-ui';
// import { ColorPicker } from 'element-ui'
// import { Autocomplete } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

import './../theme/element-#1BB797/date-picker.css'
import './../theme/element-#1BB797/pagination.css'
import './../theme/element-#1BB797/switch.css'
import './../theme/element-#1BB797/checkbox.css'
import './../theme/element-#1BB797/message-box.css'

locale.use(lang)

Vue.use(Button)
// Vue.use(Row)
// Vue.use(Col)
// Vue.use(Tree)
// Vue.use(Icon)
// Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
// Vue.use(Tooltip)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
// Vue.use(Radio)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
// Vue.use(Form)
// Vue.use(FormItem);
// Vue.use(Input);
// Vue.use(Popover);
// Vue.use(Cascader);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
Vue.use(DatePicker);
Vue.use(Switch);
Vue.use(Loading);
// Vue.use(ColorPicker);
// Vue.use(Autocomplete)


Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;



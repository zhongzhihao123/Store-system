import Vue from 'vue'
import { Button, Submenu, Tree } from 'element-ui'
import {Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import {Message} from 'element-ui'
import { Container,Header,Aside,Main,Menu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem,Card} from 'element-ui'
import {Timeline, TimelineItem, Upload,CheckboxGroup,Checkbox,Steps,Step,TabPane,Tabs,Alert,Cascader,Option,Select,submenu,input,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,tree} from 'element-ui'
Vue.use(Button)
Vue.use(TabPane)
Vue.use(FormItem)
Vue.use(Form)   
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
// 把消息提示引入到全局使用
Vue.prototype.$message = Message
// 把弹框提示引入到全局使用
Vue.prototype.$confirm =MessageBox


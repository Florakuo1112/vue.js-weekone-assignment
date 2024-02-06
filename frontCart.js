const { defineStore, createPinia, mapState, mapActions } = Pinia;
const createApp = Vue.createApp;
import cartStore from './cartStore.js';
VeeValidate.defineRule('email',VeeValidateRules['email']);
VeeValidate.defineRule('required',VeeValidateRules['required']);

// 步驟 4：加入多國語系 讀取外部的資源json
VeeValidateI18n.loadLocaleFromURL('./zh-TW.json');
// Activate the locale
VeeValidate.configure({
generateMessage: VeeValidateI18n.localize('zh-TW'),
validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = createApp({
    data(){
        return{
            currentCheck:{},
            api:{
                url : 'https://vue3-course-api.hexschool.io/v2',
                api_path : 'florafirstapi'
            },
            data:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:''
                },
                message:''
            }
        }
    },
    methods:{
        getCurrentCheck(item){
            this.currentCheck = item;
            console.log('父元件', this.currentCheck);
            this.$refs.refMoreInfoModal.openModal()
        },
        onSubmit(){
            console.log(this.data);
            const userInfo = this.data;
            console.log(userInfo)
            this.changeIsLoadingStatus();
            //axios.post(`${this.api.url}/api/${this.api.api_path}/order`, {userInfo})
            axios.post('https://ec-course-api.hexschool.io/v2/api/florafirstapi/order', {userInfo})
            .then((res)=>{
                console.log(res)
                this.data={}
                this.changeIsLoadingStatus()
            }).catch((err)=>{
                console.log(err)
                this.changeIsLoadingStatus()
            })
        },
        isPhone(value){
        const phoneNumber = /\d{8,}/;
        return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        ...mapActions(cartStore,['getData','changeIsLoadingStatus'])
    },
    computed:{
        ...mapState(cartStore, ['isLoading'])
    },
});
//產品列表元件
app.component('productList',{
    props:['api'],
    data(){
        return{
            products:[],
            addCart:'',
        }
    },
    methods:{
        checkMoreInfo(item){
            this.$emit('pushCurrentCheck',item)
        },
        addToCart(item){
            this.addCart = item.id;
            let data = {"product_id":item.id, "qty":1};
            axios.post(`${this.api.url}/api/${this.api.api_path}/cart`, {data})
            .then((res)=>{
                console.log(res)
                this.getData()
                this.addCart='';
            }).catch((err)=>{
                console.log(err)
            })
        },
         //取出cardStore方法要用陣列
        ...mapActions(cartStore,['getData','changeIsLoadingStatus'])
    },
    mounted(){
        this.changeIsLoadingStatus();
        axios.get(`${this.api.url}/api/${this.api.api_path}/products/all`)
        .then((res)=>{
            this.changeIsLoadingStatus();
            this.products = res.data.products
            console.log(this.products)
        });
    },
    template:
    `<table class="table align-middle">
    <thead>
    <tr>
        <th>圖片</th>
        <th>商品名稱</th>
        <th>價格</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for='(item, key) in products' :key='item.id'>
        <td style="width: 200px">
        <div style="height: 100px; background-size: cover; background-position: center">
        <img :src='item.imageUrl' style='height:100px'>
        </div>
        </td>
        <td>
        {{item.title}}
        </td>
        <td>
        <div class="h5">現在只要 {{item.price}} 元</div>
        </td>
        <td>
        <div class="btn-group btn-group-sm">
        <button type="button" class="btn btn-outline-secondary" @click='checkMoreInfo(item)'>
        <i class="fas fa-spinner fa-pulse"></i>
        查看更多
        </button>
        <button type="button" class="btn btn-outline-danger" @click='addToCart(item)' :disabled='item.id === addCart '>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if='item.id === addCart'></span>
        加到購物車
        </button>
        </div>
        </td>
    </tr>
    </tbody>
    </table>`
});
//modal元件
app.component('moreInfoModal',{
    props:['currentCheck', 'api'],
    data(){
        return{
            myModal:null,
            productQty:1,
            loading:false
        }
    },
    methods:{
        openModal(){
            this.myModal.show();
        },
        closeModal(){
        this.myModal.hide();
        this.productQty=1;
        },
        addToCart(){
            this.loading=true;
            console.log(this.currentCheck.id, this.productQty);
            let data = {"product_id":this.currentCheck.id, "qty":this.productQty};
            axios.post(`${this.api.url}/api/${this.api.api_path}/cart`, {data})
            .then((res)=>{
                console.log(res)
                this.getData()
                this.myModal.hide();
                this.productQty=1;
                this.loading=false;
            }).catch((err)=>{
                this.productQty=1;
                console.log(err)
            })
        },
         //取出cardStore方法要用陣列
        ...mapActions(cartStore,['getData'])
    },
    template:
`<div class="modal fade"  ref="refMoreInfoModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
    <div class="modal-header bg-dark text-white">
    <h5 class="modal-title" id="exampleModalLabel">
        <span>{{currentCheck.title}}</span>
    </h5>
    <button type="button" class="btn-closse-light"
    @click='closeModal' aria-label="Close"></button>
    </div>
    <div class="modal-body">
    <div class="row">
        <div class="col-sm-6">
        <img class="img-fluid" :src="currentCheck.imageUrl" alt="">
    </div>
        <div class="col-sm-6">
        <span class="badge bg-primary rounded-pill">{{  }}</span>
        <p>商品描述：{{currentCheck.description}}</p>
        <p>商品內容：{{currentCheck.content}}</p>
        <div class="h5">{{currentCheck.price}} 元</div>
        <del class="h6">原價 {{currentCheck.origin_price}} 元</del>
        <div class="h5">現在只要 {{currentCheck.price}} 元</div>
        <div>
            <div class="input-group">
            <button type='button' @click='productQty>1?productQty--:productQty=1' :disabled='loading'> - </button>
            <input type="number" class="form-control"min="1" readonly v-model='productQty'>
            <button type='button' @click='productQty++'> + </button>
            <button type="button" class="btn btn-primary" @click='addToCart' :disabled='loading'>
            <span :class="{'spinner-border':loading}" role="status">
            </span>
            加入購物車</button>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
`,
    mounted(){
        this.myModal = new bootstrap.Modal(this.$refs.refMoreInfoModal,{
            keyboard:false,
            backdrop:'static'
        });
    },
});
//註冊vueloading 元件
app.component('loading', VueLoading.Component)

//購物車清單元件
app.component('cartList',{
    props:['api'],
    data(){
        return{
            cart:{},
            reviseItem:''
        }
    },
    methods:{
        getCartList(){
            axios.get(`${this.api.url}/api/${this.api.api_path}/cart`)
            .then((res)=>{
                this.cart=res.data.data
                console.log(this.cart)
            }).catch((err)=>{
                console.log(err)
            });
        },
        addQty(par,id){
            this.reviseItem = id
            console.log(par,id);
            console.log(this.reviseItem)
            const data={
                "product_id":id,
                "qty": par+1
            };
            console.log(data)
            axios.put(`${this.api.url}/api/${this.api.api_path}/cart/${id}`,{data})
            .then((res)=>{
                console.log(res);
                this.getCartList();
                this.reviseItem = ''
            }).catch((err)=>{
                console.log(err)
            })
        },
        redQty(par,id){
            console.log(par,id);
            const data = {
                "product_id":id
            };
            if(par>1){
                this.reviseItem = id
                data.qty=par-1
                axios.put(`${this.api.url}/api/${this.api.api_path}/cart/${id}`,{data})
                .then((res)=>{
                    console.log(res);
                    this.getCartList();
                    this.reviseItem = ''
                }).catch((err)=>{
                    console.log(err)
                })
            }else{
                alert('數量至少一個')
            }
        },
        deleteProduct(id){
            this.changeIsLoadingStatus();
            axios.delete(`${this.api.url}/api/${this.api.api_path}/cart/${id}`)
            .then((res)=>{
                console.log(res);
                this.changeIsLoadingStatus()
                this.getCartList();
            }).catch((err)=>{
                this.changeIsLoadingStatus()
                console.log(err)
            })
        },
        deleteCart(){
            this.changeIsLoadingStatus();
            axios.delete(`${this.api.url}/api/${this.api.api_path}/carts`)
            .then((res)=>{
                console.log(res);
                this.changeIsLoadingStatus()
                this.getCartList();
            }).catch((err)=>{
                this.changeIsLoadingStatus()
                console.log(err)
            })
        },
        ...mapActions(cartStore, ['changeIsLoadingStatus'])
    },
    computed:{
        //取出cardStore state 資料狀態 要用陣列, 不能和card1變數一樣
        ...mapState(cartStore,['cartData']),
    },
    watch:{
        cartData(){
            this.getCartList()
        }
    },
    mounted(){
        this.getCartList()
    }
    ,
    template:
    `<div class="text-end">
        <button class="btn btn-outline-danger" type="button" @click='deleteCart'>清空購物車</button>
        </div>
        <table class="table align-middle">
            <thead>
            <tr class='justify-content-between'>
                <th></th>
                <th>品名</th>
                <th style="width: 150px">數量/單位</th>
                <th >單價</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <template v-if='cart.carts'>
                <tr v-for='item in cart.carts' :key='item.id'>
                <td>
                    <button type="button" class="btn btn-outline-danger btn-sm" @click='deleteProduct(item.id)'>
                    <i class="fas fa-spinner fa-pulse"></i>
                    x
                    </button>
                </td>
                <td>
                    {{item.product.title}}
                    <div class="text-success">
                    已套用優惠券
                    </div>
                </td>
                <td style='width:100px'>
                    <div class="input-group input-group-sm" >
                    <div class="input-group mb-3" :class="{'d-none':item.id === reviseItem}">
                    <button type='button'  @click='redQty(item.qty, item.id)' :disabled='item.id === reviseItem'> 
                    -
                    </button>
                    <input type="number" class="form-control text-center" min="1" readonly :value='item.qty'>
                    <button type='button'  @click='addQty(item.qty, item.id)'  :disabled='item.id === reviseItem'> 
                    +
                    </button>
                    </div>
                    </div>

                    <div class="text-center">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if='item.id === reviseItem'></span>
                    </div>
                </td>
                <td>{{item.product.price}}</td>
                <td class="text-end">
                    <small class="text-success">折扣價：</small>
                    {{item.final_total}}
                </td>
                </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{cart.total}}</td>
            </tr>
            <tr>
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{cart.final_total}}</td>
            </tr>
            </tfoot>
        </table>
    `,
});

//VeeValidatem
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field); //input, selector
app.component('ErrorMessage', VeeValidate.ErrorMessage);//錯誤回饋
// 將 Pinia 套用至 Vue 環境中，請確保加入在 `const app = createApp...` 之後，並在 `app.mount` 之前。
const pinia = createPinia();
app.use(pinia);
app.mount('#app')
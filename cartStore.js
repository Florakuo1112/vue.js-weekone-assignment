//用來放置更新的購物車清單與vue loading overlay 的狀態
// 取用pinia 最前方將 defineStore、createPinia 方法取出
const { defineStore, createPinia, mapState, mapActions } = Pinia;
export default defineStore('cartStore',{
    state:()=>{
        return{
            cartData:{},
            api:{
                url :'https://vue3-course-api.hexschool.io/v2',
                api_path : 'florafirstapi'
            },
            isLoading:false,
        }
    },
    actions:{
        getData(){
            axios.get(`${this.api.url}/api/${this.api.api_path}/cart`)
            .then((res)=>{
                this.cartData = res.data.data.carts;
                console.log(this.cartData)
            })
        },
        changeIsLoadingStatus(){
            this.isLoading=!this.isLoading
        }
    },
    getters:{

    }
})
const createApp = Vue.createApp;
import pagination from './pagination.js';
import deleteModal from './delete.js'
import productModal from './productModal.js';

const app = createApp({
    components:{
pagination,
productModal,
deleteModal

    },
    data(){
        return{
            api:{
                url : 'https://vue3-course-api.hexschool.io/v2',
                api_path : 'florafirstapi',
                token:''
            },
            productList:[],
            editStatus:'',
            productId:'',
            tempUrl:'',
            temp:{
                data: {
                    //https://picsum.photos/200
                    title: "",
                    category: "",
                    origin_price: '',
                    price:'',
                    unit: '',
                    description: "",
                    content: "",
                    is_enabled: 1,
                    imageUrl: "",
                    imagesUrl: []
                        }       
            },
            modalProduct:null,
            modalDel:null,
            isAddingPhotos:false,
            pages:{},
        };
    },
    methods:{
        getProducts(page=1){
            axios.get(`${this.api.url}/api/${this.api.api_path}/admin/products?page=${page}`).then((res)=>{
                console.log(res.data);
                this.productList=res.data.products;
                this.pages=res.data.pagination
            }).catch((err)=>{
                console.log(err)
            })
        },
          //打開新增/編輯modal
        openModal(text,item){
            this.editStatus=text;
            if(this.editStatus === '編輯'){
               // this.modalProduct.show();
                
               this.$refs.refProductModal.openModal()
                this.productId = item.id;
                console.log(this.editStatus)
                console.log(this.productId)
                this.temp.data= JSON.parse(JSON.stringify(item))
                //編輯功能不可以在還沒存時就更新，由於編輯時有物件傳參考的問題，請確保編輯物件與原始物件參考不是同一個
                //超過一層,要用深拷貝
            };
            if(this.editStatus === '新增'){
                console.log(this.editStatus)
    
                this.temp.data = {
                    imagesUrl:[],
                };
                //this.modalProduct.show();
                //子元件在html標籤綁定ref,可以用來開啟子元件的openModal
                this.$refs.refProductModal.openModal()
            };
            if(this.editStatus === '刪除'){
                console.log('delete');
                this.productId = item.id;
                console.log(this.productId);
                this.temp.data= JSON.parse(JSON.stringify(item));
                this.$refs.refDelModal.openModal();
            }
        },
        addProduct(){
            console.log(this.editStatus)
            if(this.editStatus === '新增'){
                axios.post(`${this.api.url}/api/${this.api.api_path}/admin/product`, this.temp)
                .then((res)=>{
                    console.log(res);
                    //productModal.hide();
                    this.$refs.refProductModal.closeModal()
                    this.getProducts(this.pages.current_page);

                }).catch((err)=>{
                    console.log(err);
                    alert(err.data.message)
                })
            };
            if(this.editStatus === '編輯'){
                axios.put(`${this.api.url}/api/${this.api.api_path}/admin/product/${this.productId}`, this.temp)
                .then((res)=>{
                    console.log(res);
                    //productModal.hide();
                    this.$refs.refProductModal.closeModal()
                    this.getProducts(this.pages.current_page);
                }).catch((err)=>{
                    console.log(err);
                    
                })
            };


        },
        deleteProduct(){
            axios.delete(`${this.api.url}/api/${this.api.api_path}/admin/product/${this.productId}`).then((res)=>{
                console.log(res.data);
                this.productList=res.data.products;
                this.getProducts(this.pages.current_page);
                this.temp.data = {
                    imagesUrl:[],
                };
                this.productId=''
                //this.modalDel.hide()
                this.$refs.refDelModal.closeModal()
            }).catch((err)=>{
                console.log(err)
            })
        },
        addPhotos(){
            this.isAddingPhotos=true;
        },
        changePhoto(text){
            console.log(text)
             this.temp.data.imagesUrl.push(text);
             console.log(this.temp.data);
             this.isAddingPhotos=false;
        }

    },
    mounted(){
        const token = document.cookie.split("; ").find((row) => row.startsWith("floraFirstApiToken="))?.split("=")[1];
        console.log(token);
        axios.defaults.headers.common['Authorization']=token;
        this.getProducts();
        console.log(this.$refs);
        //this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
        //this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
    }
});

app.component('delProductModal',{
    template:'#delProductModal'
})


app.mount('#app')


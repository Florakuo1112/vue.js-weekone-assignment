//1.先把元件環境建立好
//2.把版型加入
// 3.解除版型內的錯誤
// 4.refs Bootstraps
 //https://picsum.photos/200
export default {
    props:['temp','addProduct'],
    data(){
      return{ 
      modalProduct:null
            }
    },
    methods:{
      openModal(){
        this.modalProduct.show()
      },
      closeModal(){
        this.modalProduct.hide()
      },
    },
    template:`<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
  <div class="modal-dialog modal-xl">
   <div class="modal-content border-0">
     <div class="modal-header bg-dark text-white">
       <h5 id="productModalLabel" class="modal-title">
          <span v-show="editStatus=='新增'" >新增產品</span>
          <span v-show="editStatus=='編輯'">編輯產品</span>
       </h5>
       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
     </div>
     <div class="modal-body">
       <div class="row">
           <!-- 左半邊 -->
         <div class="col-sm-4">
           <div class="mb-2">
             <div class="mb-3">
               <label for="imageUrl" class="form-label">輸入主要圖片網址</label>
               <input type="text" class="form-control"
                      placeholder="請輸入圖片連結" v-model="temp.data.imageUrl">
             </div>
             <img class="img-fluid" :src=" temp.data.imageUrl" alt="主要圖片" :class="{'d-none':!temp.data.imageUrl}">
  
           </div>
           <h4>多圖新增</h4>
           
          <div v-show="temp.data.imagesUrl" v-for="(item, key) in temp.data.imagesUrl" :key="key+123">
                  <img :src="item" alt=""  class="img-fluid" >
                  <input type="text" class="form-control" v-model.lazy="temp.data.imagesUrl[key]">
          </div>
  
          <div  v-show="isAddingPhotos">
              <label for="imagesUrl" class="form-label">輸入多圖網址</label>
              <input type="text" class="form-control"
              placeholder="請輸入圖片連結" v-model="tempUrl" @change="temp.data.imagesUrl.push(tempUrl);tempUrl=''">
              
          </div>
  
  
           <div>
             <button class="btn btn-outline-primary btn-sm d-block w-100" @click="isAddingPhotos=true">
               新增圖片
             </button>
           </div>
           <div >
             <button class="btn btn-outline-danger btn-sm d-block w-100" @click="temp.data.imagesUrl.pop()">
               刪除圖片
             </button>
           </div>
         </div>
         <div class="col-sm-8">
             <pre>
              {{temp}}{{tempUrl}}
             </pre>
             
           <div class="mb-3">
             <label for="title" class="form-label">標題</label>
             <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="temp.data.title">
           </div>
  
           <div class="row">
             <div class="mb-3 col-md-6">
               <label for="category" class="form-label">分類</label>
               <input id="category" type="text" class="form-control"
                      placeholder="請輸入分類" v-model="temp.data.category">
             </div>
             <div class="mb-3 col-md-6">
               <label for="price" class="form-label">單位</label>
               <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="temp.data.unit">
             </div>
           </div>
  
           <div class="row">
             <div class="mb-3 col-md-6">
               <label for="origin_price" class="form-label">原價</label>
               <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="temp.data.origin_price">
             </div>
             <div class="mb-3 col-md-6">
               <label for="price" class="form-label" >售價</label>
               <input id="price" type="number" min="0" class="form-control"
                      placeholder="請輸入售價" v-model.number="temp.data.price">
             </div>
           </div>
           <hr>
  
           <div class="mb-3">
             <label for="description" class="form-label">產品描述</label>
             <textarea id="description" type="text" class="form-control"
                       placeholder="請輸入產品描述" v-model="temp.data.description">
             </textarea>
           </div>
           <div class="mb-3">
             <label for="content" class="form-label" >說明內容</label>
             <textarea id="description" type="text" class="form-control"
                       placeholder="請輸入說明內容" v-model="temp.data.content">
             </textarea>
           </div>
           <div class="mb-3">
             <div class="form-check">
               <input id="is_enabled" class="form-check-input" type="checkbox"
                      :true-value="1" :false-value="0" v-model="temp.data.is_enabled">
               <label class="form-check-label" for="is_enabled">是否啟用</label>
             </div>
           </div>
         </div>
       </div>
     </div>
     <div class="modal-footer">
       <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
         取消
       </button>
       <button type="button" class="btn btn-primary" @click="addProduct">
         確認
       </button>
     </div>
   </div>
  </div>
  </div>`,
    mounted(){
      this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
      
    },
}
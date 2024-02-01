//1.先把元件環境建立好
//2.把版型加入
// 3.解除版型內的錯誤
// 4.refs Bootstraps
 //https://picsum.photos/200

export default {
    props:['temp','deleteProduct'],
    data(){
      return{
        modalDel:null
      }
      },
    template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1" aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog ">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="delProductModalLabel">刪除產品</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{temp.data.title}}</strong> (商品刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
        </div>
      </div>
    </div>
</div>`,
  methods:{
    openModal(){
      this.modalDel.show()
  },
  closeModal(){
    this.modalDel.hide()
  }
  },
    mounted(){
        console.log(this.$refs)
        this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
        
    }
}

//先把元件環境用好
//版型加入
//除錯
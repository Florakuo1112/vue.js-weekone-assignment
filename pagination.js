export default {
    props:['pages','getProducts'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">

      <li class="page-item" :class="{disabled:!pages.has_pre} " @click="getProducts(pages.current_page-1)" >
        <a class="page-link" href="#" aria-label="Previous" >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" v-for="page in pages.total_pages" :key="page+123" :class="{active:page==pages.current_page}"><a class="page-link" href="#" @click="getProducts(page)">{{page}}</a></li>


      <li class="page-item" :class="{disabled:!pages.has_next}" @click="getProducts(pages.current_page+1)">
        <a class="page-link" href="#" aria-label="Next" >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
      
    </ul>
  </nav>`
}

//先把元件環境用好
//版型加入
//除錯
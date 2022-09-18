import numberFormat from '@/helpers/numberFormat';
import { computed, reactive, ref} from 'vue'
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default function() {
  const productData = ref( null );

  const category = computed(() =>{
    return productData.value.category;
  })

  const fetchStatus = reactive( {
    isLoading: false,
    isFailed: false,
  })

  const fetchProduct = async (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isFailed = false;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/${productId}`)
      const product = res.data;
      let img = null;
      try {
        img = product.colors[0].gallery[0].file.url
      } catch (error) {
        img = null;
      }
      productData.value = {
        id: product.id,
        categoryId: product.category.id,
        category: product.category,
        title: product.title,
        price: product.price,
        img: img,
        colorList: product.colors,
        color: {id: product.colors[0].id, colorId:product.colors[0].color.id},
        sizes: product.sizes,
        size: product.sizes[0].id,
        materials: product.materials,
        pricePretty: numberFormat(product.price),
      }
    } catch (e) {
      fetchStatus.isFailed = true;
    }
    finally {
      fetchStatus.isLoading = false;
    }
  }

  return {
    product: productData,
    category,
    status: fetchStatus,

    fetchProduct,
  }
}

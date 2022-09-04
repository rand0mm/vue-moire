import numberFormat from '@/helpers/numberFormat';
import { computed, reactive, ref} from 'vue'
import shop from '@/api/shop'

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
      const res = await shop.getProduct(productId);
      const product = res.data;
      productData.value = {
        id: product.id,
        categoryId: product.category.id,
        category: product.category,
        title: product.title,
        price: product.price,
        img: product.image.url,
        colorList: product.colors,
        color: product.colors.map((i) => i.id)[0],
        pricePretty: numberFormat(product.price),
      }
    } catch (error) {
      fetchStatus.isFailed = true;
      productData.value = 'Продукт не найден';
      if(productData.value) fetchStatus.isFailed = false;
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

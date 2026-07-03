import { apiRequest } from "./api";

export const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price),
  image: product.image_url,
  specs: product.specifications || {},
  category: product.category?.slug,
});

export const productService = {
  async getProducts(params = {}, options = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    const data = await apiRequest(
      `/products${query ? `?${query}` : ""}`,
      options
    );

    return {
      ...data,
      items: data.items.map(normalizeProduct),
    };
  },

  async getProduct(productId, options = {}) {
    const product = await apiRequest(
      `/products/${productId}`,
      options
    );

    return normalizeProduct(product);
  },
};
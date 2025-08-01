import type {
  CategoryListResponse,
  ProductDetail,
  ProductListResponse,
  QueryProduct,
} from "@/types";
import { apiClient } from "@/services/api";
import { log } from "console";

class ProductService {
  // Lấy danh sách sản phẩm với filters
  async getProducts(params?: QueryProduct): Promise<ProductListResponse> {
    try {
      const response = await apiClient.get<ProductListResponse>(
        "/api/products",
        params,
      );
      console.log("Received query parameters:", params);

      console.log("Lấy danh sách sản phẩm thành công:", response);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  }

  // Lấy chi tiết một sản phẩm
  async getProductById(productId: string): Promise<ProductDetail> {
    try {
      const response = await apiClient.get<ProductDetail>(
        `/api/products/${productId}`,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      throw error;
    }
  }

  // Lấy danh sách categories
  async getCategories(): Promise<CategoryListResponse> {
    try {
      const response = await apiClient.get<CategoryListResponse>(
        "/api/categories",
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
      throw error;
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(
    searchTerm: string,
    params?: QueryProduct,
  ): Promise<ProductListResponse> {
    try {
      const searchParams = {
        ...params,
        search: searchTerm,
      };
      const response = await apiClient.get<ProductListResponse>(
        "/api/products",
        searchParams,
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  }
}

export const productService = new ProductService();

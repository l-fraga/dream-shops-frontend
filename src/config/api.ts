// Configurações da API baseadas nas variáveis de ambiente
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
  PREFIX: process.env.REACT_APP_API_PREFIX,
  JWT_EXPIRATION: parseInt(process.env.REACT_APP_JWT_EXPIRATION as string),

  
  // Endpoints disponíveis
  ENDPOINTS: {
    // Autenticação (disponível)
    LOGIN: '/auth/login',
    
    // Futuros endpoints (conforme documentação)
    USERS: {
      GET_USER: (userId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/users/${userId}/user`,
      CREATE_USER: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/users/add`,
      UPDATE_USER: (userId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/users/${userId}/update`,
    },
    
    PRODUCTS: {
      GET_ALL: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/products/all`,
      GET_BY_ID: (productId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/products/product/${productId}/product`,
      GET_BY_BRAND: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/products/product/by-brand`,
    },
    
    CATEGORIES: {
      GET_ALL: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/categories/all`,
    },
    
    CART: {
      GET_CART: (cartId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/carts/${cartId}`,
      CLEAR_CART: (cartId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/carts/${cartId}`,
      GET_TOTAL: (cartId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/carts/${cartId}/total-price`,
      ADD_ITEM: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/cartItems/add`,
      UPDATE_ITEM: (cartId: number, itemId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/cartItems/${cartId}/${itemId}/update`,
    },
    
    ORDERS: {
      CREATE_ORDER: `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/orders/order`,
      GET_ORDER: (orderId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/orders/${orderId}/order`,
      GET_USER_ORDERS: (userId: number) => `${process.env.REACT_APP_API_PREFIX || '/api/v1'}/orders/user/${userId}/order`,
    }
  }
};

// Headers para requisições autenticadas
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// URL completa para endpoints
export const getFullApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
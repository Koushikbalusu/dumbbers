import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const sort = searchParams.get('sort') || 'relevance';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    if (!query) {
      return NextResponse.json({
        success: false,
        message: 'Search query is required'
      }, { status: 400 });
    }

    // Map frontend sort values to backend sort values
    const sortMapping = {
      'relevance': 'relevance',
      'price-asc': 'price_asc',
      'price-desc': 'price_desc',
      'name-asc': 'name_asc',
      'name-desc': 'name_desc',
      'newest': 'newest',
      'popularity': 'popularity',
      'rating': 'rating'
    };
    
    const backendSort = sortMapping[sort] || 'relevance';

    // Build the backend API URL
    const backendUrl = new URL('https://dumbbers-backend.onrender.com/api/products');
    backendUrl.searchParams.set('q', query);
    backendUrl.searchParams.set('page', page);
    backendUrl.searchParams.set('limit', limit);
    backendUrl.searchParams.set('sort', backendSort);
    
    if (category) backendUrl.searchParams.set('category', category);
    if (minPrice) backendUrl.searchParams.set('minPrice', minPrice);
    if (maxPrice) backendUrl.searchParams.set('maxPrice', maxPrice);
    if (inStock) backendUrl.searchParams.set('inStock', inStock);

    // Try to fetch from backend
    const response = await fetch(backendUrl.toString());
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Fallback: search all products and filter locally
      const allProductsResponse = await fetch('https://dumbbers-backend.onrender.com/api/products');
      
      if (!allProductsResponse.ok) {
        throw new Error('Backend API not available');
      }
      
      const allProductsData = await allProductsResponse.json();
      
      if (!allProductsData.success || !allProductsData.data?.items) {
        throw new Error('No products available');
      }
      
      let products = allProductsData.data.items;
      
      // Filter by search query
      const searchTerms = query.toLowerCase().split(' ');
      products = products.filter(product => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
      
      // Filter by category
      if (category) {
        products = products.filter(product => 
          product.category?.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Filter by price range
      if (minPrice) {
        products = products.filter(product => product.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        products = products.filter(product => product.price <= parseFloat(maxPrice));
      }
      
      // Filter by stock
      if (inStock === 'true') {
        products = products.filter(product => product.stock > 0);
      }
      
      // Sort products - handle both frontend and backend sort values
      switch (sort) {
        case 'price-asc':
        case 'price_asc':
          products.sort((a, b) => {
            // Get the minimum price from variants for comparison
            const aPrice = Math.min(...(a.variants?.map(v => v.price) || [a.price || 0]));
            const bPrice = Math.min(...(b.variants?.map(v => v.price) || [b.price || 0]));
            return aPrice - bPrice;
          });
          break;
        case 'price-desc':
        case 'price_desc':
          products.sort((a, b) => {
            // Get the minimum price from variants for comparison
            const aPrice = Math.min(...(a.variants?.map(v => v.price) || [a.price || 0]));
            const bPrice = Math.min(...(b.variants?.map(v => v.price) || [b.price || 0]));
            return bPrice - aPrice;
          });
          break;
        case 'name-asc':
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
        case 'name_desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'popularity':
          products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
          break;
        case 'rating':
          products.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
          break;
        default: // relevance - keep original order
          break;
      }
      
      // Pagination
      const totalResults = products.length;
      const totalPages = Math.ceil(totalResults / parseInt(limit));
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: {
          items: paginatedProducts,
          total: totalResults,
          page: parseInt(page),
          totalPages: totalPages,
          limit: parseInt(limit)
        }
      });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Search service temporarily unavailable'
    }, { status: 500 });
  }
}

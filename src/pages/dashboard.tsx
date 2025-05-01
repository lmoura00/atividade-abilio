import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    StyleSheet, 
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../hooks/use-profile';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/cart-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product } from '../types';

const ProductItem = ({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity 
            style={styles.productContainer} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductDetail', { product })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.thumbnail }} style={styles.image} />
                {product.discountPercentage > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
                    </View>
                )}
            </View>
            <View style={styles.productDetails}>
                <Text style={styles.brand}>{product.brand}</Text>
                <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    {product.discountPercentage > 0 && (
                        <Text style={styles.originalPrice}>
                            ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                        </Text>
                    )}
                </View>
                
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                }}
            >
                <Icon name="add-shopping-cart" size={20} color="#6200ee" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const CartIcon = ({ totalItems }: { totalItems: number }) => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity 
            style={styles.cartIconContainer}
            onPress={() => navigation.navigate('Cart')}
        >
            <Icon name="shopping-cart" size={24} color="#6200ee" />
            {totalItems > 0 && (
                <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const LoadingView = () => (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
    </View>
);

const ErrorView = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
    <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
    </View>
);

export function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { token } = useAuth();
    const { addToCart, totalItems } = useCart();

    const fetchProducts = async () => {
        try {
            setRefreshing(true);
            const response = await axios.get('https://dummyjson.com/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProducts(response.data.products);
            setFilteredProducts(response.data.products);
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || error.message);
            } else {
                setError('Ocorreu um erro ao carregar os produtos');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    useEffect(() => {
        let result = products;
        
        if (selectedCategory) {
            result = result.filter(product => 
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        
        if (searchQuery) {
            result = result.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        setFilteredProducts(result);
    }, [searchQuery, selectedCategory, products]);

    const categories = [...new Set(products.map(product => product.category))];

    if (loading && !refreshing) {
        return <LoadingView />;
    }

    if (error) {
        return <ErrorView error={error} onRetry={fetchProducts} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Nossos Produtos</Text>
                <CartIcon totalItems={totalItems} />
            </View>
            
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        !selectedCategory && styles.selectedCategoryButton
                    ]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        !selectedCategory && styles.selectedCategoryButtonText
                    ]}>
                        Todos
                    </Text>
                </TouchableOpacity>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.selectedCategoryButton
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === category && styles.selectedCategoryButtonText
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                    <ProductItem 
                        product={item} 
                        onAddToCart={() => addToCart(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                refreshing={refreshing}
                onRefresh={fetchProducts}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    productContainer: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ff3d71',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 10,
    },
    discountText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    productDetails: {
        padding: 12,
    },
    brand: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        height: 36,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 12,
        color: '#ffc107',
    },
    row: {
        justifyContent: 'space-between',
    },
    listContent: {
        paddingBottom: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    error: {
        color: '#ff3d71',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    cartIconContainer: {
        position: 'relative',
        padding: 8,
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ff3d71',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        paddingLeft: 40,
        fontSize: 16,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 14,
    },
    categoriesContainer: {
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    selectedCategoryButton: {
        backgroundColor: '#6200ee',
    },
    categoryButtonText: {
        color: '#666',
    },
    selectedCategoryButtonText: {
        color: 'white',
    },
    addToCartButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
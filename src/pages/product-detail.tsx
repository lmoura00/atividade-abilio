import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity,
    Dimensions,
    FlatList
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/cart-context';
import { Product } from '../types';

const { width } = Dimensions.get('window');

export function ProductDetail() {
    const route = useRoute();
    const { product } = route.params as { product: Product };
    const { addToCart } = useCart();
    
    const handleBuyNow = () => {
        addToCart(product);
        alert(`${product.title} adicionado ao carrinho!`);
    };
    
    const renderReview = ({ item }: { item: Product['reviews'][0] }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                <View style={styles.reviewRating}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.reviewRatingText}>{item.rating}</Text>
                </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: product.thumbnail }} 
                    style={styles.image} 
                    resizeMode="contain"
                />
                {product.discountPercentage > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            -{product.discountPercentage}% OFF
                        </Text>
                    </View>
                )}
            </View>
            
            <View style={styles.mainInfoContainer}>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                </View>
                
                <Text style={styles.title}>{product.title}</Text>
                
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={20} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {product.rating} ({product.reviews?.length || 0} reviews) | 
                        <Text style={styles.stockText}> {product.stock} em estoque</Text>
                    </Text>
                </View>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    {product.discountPercentage > 0 && (
                        <Text style={styles.originalPrice}>
                            ${(product.price / (1 - product.discountPercentage/100)).toFixed(2)}
                        </Text>
                    )}
                    {product.weight && (
                        <Text style={styles.pricePerUnit}>${(product.price/product.weight).toFixed(2)}/lb</Text>
                    )}
                </View>
                
                <Text style={styles.shortDescription}>{product.description}</Text>
            </View>
            
            {product.tags && product.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {product.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
            
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
                
                {product.weight && (
                    <View style={styles.detailRow}>
                        <IconMI name="weight" size={20} color="#666" />
                        <Text style={styles.detailText}>Peso: {product.weight} lbs</Text>
                    </View>
                )}
                
                {product.dimensions && (
                    <View style={styles.detailRow}>
                        <IconMI name="ruler" size={20} color="#666" />
                        <Text style={styles.detailText}>
                            Dimensões: {product.dimensions.width}" × {product.dimensions.height}" × {product.dimensions.depth}"
                        </Text>
                    </View>
                )}
                
                {product.shippingInformation && (
                    <View style={styles.detailRow}>
                        <Icon name="local-shipping" size={20} color="#666" />
                        <Text style={styles.detailText}>Envio: {product.shippingInformation}</Text>
                    </View>
                )}
                
                {product.returnPolicy && (
                    <View style={styles.detailRow}>
                        <Icon name="assignment-return" size={20} color="#666" />
                        <Text style={styles.detailText}>Política de devolução: {product.returnPolicy}</Text>
                    </View>
                )}
                
                {product.warrantyInformation && (
                    <View style={styles.detailRow}>
                        <Icon name="verified" size={20} color="#666" />
                        <Text style={styles.detailText}>Garantia: {product.warrantyInformation}</Text>
                    </View>
                )}
                
                {product.availabilityStatus && (
                    <View style={styles.detailRow}>
                        <Icon name="store" size={20} color="#666" />
                        <Text style={styles.detailText}>Disponibilidade: {product.availabilityStatus}</Text>
                    </View>
                )}
                
                {product.minimumOrderQuantity && (
                    <View style={styles.detailRow}>
                        <Icon name="shopping-cart" size={20} color="#666" />
                        <Text style={styles.detailText}>Quantidade mínima: {product.minimumOrderQuantity} unidades</Text>
                    </View>
                )}
            </View>
            
            {product.reviews && product.reviews.length > 0 && (
                <View style={styles.reviewsSection}>
                    <Text style={styles.sectionTitle}>Avaliações ({product.reviews.length})</Text>
                    <FlatList
                        data={product.reviews}
                        renderItem={renderReview}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>
            )}
            
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.buyButton]}
                    onPress={handleBuyNow}
                >
                    <Icon name="shopping-cart" size={20} color="white" />
                    <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    imageContainer: {
        width: '100%',
        height: width * 0.8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#ff3d71',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    discountText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    mainInfoContainer: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
    stockText: {
        color: '#4CAF50',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200ee',
        marginRight: 10,
    },
    originalPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 10,
        alignSelf: 'center',
    },
    pricePerUnit: {
        fontSize: 14,
        color: '#666',
        alignSelf: 'center',
    },
    shortDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginTop: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#333',
        textTransform: 'capitalize',
    },
    detailsSection: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    reviewsSection: {
        padding: 20,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    reviewItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    reviewerName: {
        fontWeight: 'bold',
        color: '#333',
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewRatingText: {
        marginLeft: 5,
        color: '#666',
    },
    reviewComment: {
        color: '#555',
        marginBottom: 5,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    buttonsContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'white',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        flex: 1,
    },
    buyButton: {
        backgroundColor: '#6200ee',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../context/cart-context';
import { Product } from '../types';
import Constants from 'expo-constants';

export function CartScreen() {
    const { 
        cart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalPrice
    } = useCart();

    const handleCheckout = () => {
        alert(`Compra finalizada! Total: $${totalPrice.toFixed(2)}`);
        clearCart();
    };

    const renderCartItem = ({ item }: { item: Product }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: item.thumbnail }} 
                style={styles.cartItemImage} 
            />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.cartItemPrice}>
                    ${item.price.toFixed(2)}
                </Text>
                
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    >
                        <Icon name="remove" size={16} color="#6200ee" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>
                        {item.quantity}
                    </Text>
                    
                    <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                        <Icon name="add" size={16} color="#6200ee" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
            >
                <Icon name="delete" size={24} color="#ff3d71" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meu Carrinho</Text>
            
            {cart.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Icon name="remove-shopping-cart" size={60} color="#ccc" />
                    <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.cartItemsContainer}>
                        <FlatList
                            data={cart}
                            renderItem={renderCartItem}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                        />
                        
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total de itens:</Text>
                                <Text style={styles.summaryValue}>{totalItems}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal:</Text>
                                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Frete:</Text>
                                <Text style={styles.summaryValue}>Grátis</Text>
                            </View>
                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={[styles.summaryLabel, styles.totalLabel]}>Total:</Text>
                                <Text style={[styles.summaryValue, styles.totalValue]}>
                                    ${totalPrice.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                    
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={clearCart}
                        >
                            <Text style={styles.clearButtonText}>Limpar Carrinho</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
        marginTop: Constants.statusBarHeight,
        paddingBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
    },
    cartItemsContainer: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    cartItemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    cartItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: 16,
    },
    removeButton: {
        padding: 8,
    },
    summaryContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
    },
    clearButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#ff3d71',
        fontWeight: 'bold',
    },
    checkoutButton: {
        padding: 12,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
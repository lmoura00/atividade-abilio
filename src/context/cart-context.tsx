import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';

// Defina o tipo com todas as propriedades obrigatórias
type CartContextType = {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

// Crie um valor padrão para o contexto
const defaultCartContext: CartContextType = {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    totalItems: 0,
    totalPrice: 0
};

// Passe o valor padrão como argumento para createContext
const CartContext = createContext<CartContextType>(defaultCartContext);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: (item.quantity || 1) + 1 } 
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Agora não precisamos mais verificar se o contexto é undefined
export const useCart = () => useContext(CartContext);
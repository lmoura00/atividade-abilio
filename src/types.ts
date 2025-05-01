export type Product = {
    returnPolicy: any;
    shippingInformation: any;
    tags: boolean;
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    rating?: number;
    discountPercentage?: number;
    brand?: string;
    category?: string;
    description?: string;
    stock?: number;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    reviews?: Array<{
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }>;
    quantity?: number;
};

export type CartContextType = {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};
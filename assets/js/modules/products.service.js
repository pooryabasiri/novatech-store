export async function loadProducts() {
    try {
        const response = await fetch("assets/data/products.json");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        return await response.json();
    } catch (error) {
        console.error("Products load error:", error);
        return getDefaultProducts();
    }
}

export function getDefaultProducts() {
    return [
        {
            id: "iphone-16-pro",
            name: "iPhone 16 Pro",
            category: "phone",
            price: 1199,
            rating: 4.9,
            reviews: 2847,
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop&auto=format",
            description: "Titanium design with A18 Pro chip. Revolutionary camera control and stunning ProMotion display.",
            features: ["A18 Pro chip", "Titanium design", "48MP camera system", "ProMotion 120Hz"],
            badge: "New"
        },
        {
            id: "macbook-pro-m4",
            name: "MacBook Pro M4",
            category: "laptop",
            price: 1999,
            rating: 4.8,
            reviews: 1523,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop&auto=format",
            description: "The most powerful MacBook ever. M4 chip delivers groundbreaking performance for professionals.",
            features: ["M4 chip", "24GB unified memory", "Liquid Retina XDR", "22-hour battery"],
            badge: "Featured"
        },
        {
            id: "airpods-pro",
            name: "AirPods Pro",
            category: "audio",
            price: 249,
            rating: 4.7,
            reviews: 4521,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop&auto=format",
            description: "Adaptive Audio with intelligent noise cancellation and personalized spatial audio.",
            features: ["Active Noise Cancellation", "Adaptive Audio", "USB-C charging", "6hr battery life"],
            badge: "Popular"
        },
        {
            id: "samsung-galaxy-s25",
            name: "Samsung Galaxy S25 Ultra",
            category: "phone",
            price: 1299,
            rating: 4.7,
            reviews: 1892,
            image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=400&fit=crop&auto=format",
            description: "Galaxy AI-powered smartphone with S Pen and 200MP camera system for ultimate creativity.",
            features: ["Snapdragon 8 Elite", "S Pen included", "200MP camera", "Titanium frame"],
            badge: ""
        },
        {
            id: "sony-wh1000xm5",
            name: "Sony WH-1000XM5",
            category: "audio",
            price: 349,
            rating: 4.8,
            reviews: 3210,
            image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=400&fit=crop&auto=format",
            description: "Industry-leading noise canceling with exceptional sound quality and supreme comfort.",
            features: ["30hr battery life", "Multipoint connection", "Speak-to-Chat", "LDAC Hi-Res Audio"],
            badge: ""
        },
        {
            id: "apple-watch-ultra",
            name: "Apple Watch Ultra 2",
            category: "wearable",
            price: 799,
            rating: 4.9,
            reviews: 2156,
            image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=400&fit=crop&auto=format",
            description: "The most rugged and capable Apple Watch with precision dual-frequency GPS.",
            features: ["49mm titanium case", "72hr battery", "Depth gauge", "Action button"],
            badge: "New"
        },
        {
            id: "dell-xps-15",
            name: "Dell XPS 15",
            category: "laptop",
            price: 1499,
            rating: 4.6,
            reviews: 987,
            image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=400&fit=crop&auto=format",
            description: "Ultra-precise 3.5K OLED InfinityEdge display with Intel Core Ultra processor.",
            features: ["Intel Core Ultra 7", "3.5K OLED display", "32GB RAM", "GeForce RTX 4060"],
            badge: ""
        },
        {
            id: "asus-rog-phone",
            name: "ASUS ROG Phone 9",
            category: "phone",
            price: 1099,
            rating: 4.5,
            reviews: 756,
            image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop&auto=format",
            description: "Ultimate gaming phone with Snapdragon 8 Elite and 185Hz AMOLED display.",
            features: ["Snapdragon 8 Elite", "185Hz AMOLED", "6000mAh battery", "AirTrigger controls"],
            badge: ""
        },
        {
            id: "mag-safe-charger",
            name: "Apple MagSafe Charger",
            category: "accessory",
            price: 39,
            rating: 4.4,
            reviews: 5621,
            image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=400&fit=crop&auto=format",
            description: "Wireless charging with alignment magnets for iPhone and AirPods. Fast and effortless.",
            features: ["15W fast charging", "Magnetic alignment", "USB-C cable", "Qi compatible"],
            badge: ""
        },
        {
            id: "google-pixel-watch",
            name: "Google Pixel Watch 3",
            category: "wearable",
            price: 349,
            rating: 4.6,
            reviews: 1245,
            image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=400&fit=crop&auto=format",
            description: "AI-powered health insights with Fitbit integration and the latest Wear OS by Google.",
            features: ["Wear OS 5", "Fitbit health metrics", "45mm always-on display", "40hr battery life"],
            badge: ""
        },
        {
            id: "sony-a7rv",
            name: "Sony A7R V",
            category: "accessory",
            price: 3899,
            rating: 4.9,
            reviews: 423,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=400&fit=crop&auto=format",
            description: "61MP full-frame mirrorless camera with AI-based autofocus and 8K video recording.",
            features: ["61MP full-frame sensor", "AI-based autofocus", "8K video recording", "5-axis stabilization"],
            badge: "Premium"
        },
        {
            id: "bose-qcu",
            name: "Bose QuietComfort Ultra",
            category: "audio",
            price: 429,
            rating: 4.7,
            reviews: 2089,
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400&fit=crop&auto=format",
            description: "Immersive spatial audio with world-class noise cancellation and CustomTune technology.",
            features: ["Immersive spatial audio", "CustomTune technology", "24hr battery life", "Aware mode"],
            badge: ""
        }
    ];
}
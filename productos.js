const CATEGORIAS = [
    "Tecnología",
    "Celulares & Tablets",
    "PC & Hardware",
    "TV & Audio",
    "Electrodomésticos",
    "Ropa & Accesorios",
    "Zapatillas & Calzado",
    "Deportes & Fitness",
    "Hogar & Muebles",
    "Juguetes & Niños",
    "Libros & Papelería",
    "Belleza & Cuidado Personal",
    "Alimentos & Bebidas",
    "Herramientas & Construcción",
    "Autos & Motos",
    "Mascotas",
    "Joyería & Relojes",
    "Arte & Manualidades",
    "Jardín & Exterior",
    "Ofertas del Día"
];
 
const PRODUCTOS = [
    {
        id: 1,
        nombre: "Notebook Lenovo IdeaPad 3 15\" Intel Core i5 16GB RAM 512GB SSD",
        precio: 649999,
        cuotas: 12,
        categoria: "PC & Hardware",
        imagen: "ID1- Notebook Lenovo.jpg",
        destacado: true,
        diasEntrega: 2
    },
    {
        id: 2,
        nombre: "iPhone 15 Pro 256GB Titanio Natural",
        precio: 1299999,
        cuotas: 18,
        categoria: "Celulares & Tablets",
        imagen: "ID2- Iphone 15.jpg",
        destacado: true,
        diasEntrega: 1
    },
    {
        id: 3,
        nombre: "Samsung Galaxy S24 Ultra 512GB Negro Titanio",
        precio: 1099999,
        cuotas: 18,
        categoria: "Celulares & Tablets",
        imagen: "ID3- Samsung S24.webp",
        destacado: true,
        diasEntrega: 1
    },
    {
        id: 4,
        nombre: "Smart TV Samsung 55\" QLED 4K 2024",
        precio: 589999,
        cuotas: 12,
        categoria: "TV & Audio",
        imagen: "ID4- TV Samsung QLED.webp",
        destacado: true,
        diasEntrega: 3
    },
    {
        id: 5,
        nombre: "Sony WH-1000XM5 Auriculares Noise Cancelling Bluetooth",
        precio: 179999,
        cuotas: 6,
        categoria: "TV & Audio",
        imagen: "ID5- Sony WH-1000XM5.webp",
        destacado: true,
        diasEntrega: 2
    },
    {
        id: 6,
        nombre: "iPad Air 11\" M2 256GB Wi-Fi Azul Cielo",
        precio: 849999,
        cuotas: 12,
        categoria: "Celulares & Tablets",
        imagen: "ID6- iPad Air 11.webp",
        destacado: true,
        diasEntrega: 2
    },
    {
        id: 7,
        nombre: "Zapatillas Nike Air Max 270 Hombre Negro/Blanco",
        precio: 129999,
        cuotas: 6,
        categoria: "Zapatillas & Calzado",
        imagen: "ID7- Zapatillas Nike Air Max 270.JPG",
        destacado: true,
        diasEntrega: 3
    },
    {
        id: 8,
        nombre: "Cafetera Nespresso Vertuo Pop Crema",
        precio: 89999,
        cuotas: 6,
        categoria: "Electrodomésticos",
        imagen: "ID8- Cafetera Nespresso.jpeg",
        destacado: true,
        diasEntrega: 2
    },
    {
        id: 9,
        nombre: "Perfume Carolina Herrera Good Girl 80ml EDP",
        precio: 74999,
        cuotas: 3,
        categoria: "Belleza & Cuidado Personal",
        imagen: "ID9- Perfume Carolina Herrera Good Girl.jpeg",
        destacado: true,
        diasEntrega: 2
    },
    {
        id: 10,
        nombre: "Sillón Reclinable Cuero Sintético Chocolate 3 Posiciones",
        precio: 219999,
        cuotas: 12,
        categoria: "Hogar & Muebles",
        imagen: "ID10- Sillón Reclinable Cuero Sintético Chocolate 3 Posiciones.webp",
        destacado: true,
        diasEntrega: 5
    },
 
    {
        id: 11,
        nombre: "PS5 Slim + Control DualSense Blanco",
        precio: 899999,
        cuotas: 18,
        categoria: "Tecnología",
        imagen: "ID11- PS5 Slim + Control DualSense Blanco.webp",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 12,
        nombre: "Monitor Gamer LG UltraGear 27\" 144Hz QHD IPS",
        precio: 379999,
        cuotas: 12,
        categoria: "PC & Hardware",
        imagen: "ID12- Monitor Gamer LG UltraGear 27.jpeg",
        destacado: false,
        diasEntrega: 3
    },
    {
        id: 13,
        nombre: "Campera North Face Thermoball Mujer Azul M",
        precio: 149999,
        cuotas: 6,
        categoria: "Ropa & Accesorios",
        imagen: "ID13- Campera North Face Thermoball.webp",
        destacado: false,
        diasEntrega: 3
    },
    {
        id: 14,
        nombre: "Bicicleta MTB Rodado 29\" Aluminio 21V",
        precio: 289999,
        cuotas: 12,
        categoria: "Deportes & Fitness",
        imagen: "ID14- Bicicleta MTB Rodado 29.webp",
        destacado: false,
        diasEntrega: 5
    },
    {
        id: 15,
        nombre: "Robot Aspiradora Roomba j7+ con Vaciado Automático",
        precio: 469999,
        cuotas: 12,
        categoria: "Electrodomésticos",
        imagen: "ID15- Robot Aspiradora Roomba j7.webp",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 16,
        nombre: "Reloj Casio G-Shock GA-2100 Negro Carbono",
        precio: 99999,
        cuotas: 6,
        categoria: "Joyería & Relojes",
        imagen: "ID16- Reloj Casio G-Shock GA-2100.webp",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 17,
        nombre: "Set LEGO Technic Lamborghini Huracán 1461 piezas",
        precio: 159999,
        cuotas: 6,
        categoria: "Juguetes & Niños",
        imagen: "ID17- Set LEGO Technic Lamborghini Huracán.jpg",
        destacado: false,
        diasEntrega: 3
    },
    {
        id: 18,
        nombre: "Taladro Percutor Inalámbrico DeWalt 20V 2 baterías",
        precio: 189999,
        cuotas: 6,
        categoria: "Herramientas & Construcción",
        imagen: "ID18- Taladro Percutor Inalámbrico DeWalt 20V 2 baterías.jpg",
        destacado: false,
        diasEntrega: 3
    },
    {
        id: 19,
        nombre: "Comida Premium Royal Canin Maxi Adult 15kg",
        precio: 44999,
        cuotas: 3,
        categoria: "Mascotas",
        imagen: "ID19- Comida Premium Royal Canin Maxi Adult 15kg.jpeg",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 20,
        nombre: "Kindle Paperwhite 16GB Luz Cálida Sin Publicidad",
        precio: 79999,
        cuotas: 3,
        categoria: "Libros & Papelería",
        imagen: "ID20- Kindle Paperwhite 16GB.webp",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 21,
        nombre: "Zapatillas Adidas Ultraboost 22 Running Mujer Blanca",
        precio: 139999,
        cuotas: 6,
        categoria: "Zapatillas & Calzado",
        imagen: "ID21- Zapatillas Adidas Ultraboost.jpg",
        destacado: false,
        diasEntrega: 3
    },
    {
        id: 22,
        nombre: "Licuadora Nutribullet Pro 900W Plateada",
        precio: 59999,
        cuotas: 3,
        categoria: "Electrodomésticos",
        imagen: "ID22- Licuadora Nutribullet.webp",
        destacado: false,
        diasEntrega: 2
    },
    {
        id: 23,
        nombre: "Mesa de Jardín Ratán Sintético + 4 Sillas",
        precio: 174999,
        cuotas: 6,
        categoria: "Jardín & Exterior",
        imagen: "ID23- Mesa de Jardín Ratán Sintético.webp",
        destacado: false,
        diasEntrega: 6
    },
    {
        id: 24,
        nombre: "Cámara Sony Alpha ZV-E10 Mirrorless + Lente 16-50mm",
        precio: 549999,
        cuotas: 12,
        categoria: "Tecnología",
        imagen: "ID24- Cámara Sony Alpha ZV-E10 Mirrorless.jpg",
        destacado: false,
        diasEntrega: 3
    }
];
 
function getProductosPorCategoria(categoria) {
    return PRODUCTOS.filter(p => p.categoria === categoria);
}
 
function getProductosDestacados() {
    return PRODUCTOS.filter(p => p.destacado);
}
 
function buscarProductos(query, categoria = "all") {
    const q = query.toLowerCase().trim();
    return PRODUCTOS.filter(p => {
        const matchQuery = q === "" || p.nombre.toLowerCase().includes(q);
        const matchCat = categoria === "all" || p.categoria === categoria;
        return matchQuery && matchCat;
    });
}
 
function formatPrecio(precio) {
    return precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });
}
 
function calcularCuota(precio, cuotas) {
    return formatPrecio(Math.ceil(precio / cuotas));
}
 
function calcularEntrega(dias) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + dias);
    const opciones = { weekday: "long", day: "numeric", month: "long" };
    const str = hoy.toLocaleDateString("es-AR", opciones);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getImagenProducto(producto) {
    if (!producto || !producto.imagen || producto.imagen === "######") {
        return null;
    }

    if (/^https?:\/\//i.test(producto.imagen) || producto.imagen.includes("/")) {
        return producto.imagen;
    }
 
    const esSubcarpeta = window.location.pathname.includes("/pages/");
    const prefijo = esSubcarpeta ? "../../" : "./";
 
    return `${prefijo}img/productos/${encodeURI(producto.imagen)}`;
}
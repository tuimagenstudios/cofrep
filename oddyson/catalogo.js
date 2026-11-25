// Catálogo de ODDYSON. Imágenes alojadas en nuestro sitio.
const menuCategories = {"cafeteria": {"name": ["Cafetería", "Coffee & snacks"], "tab": ["Cafetería", "Coffee & snacks"]}, "entradas": {"name": ["Entradas", "Starters"], "tab": ["Entradas", "Starters"]}, "hamburguesas": {"name": ["Burgers premium", "Premium burgers"], "tab": ["Burgers premium", "Premium burgers"]}, "milanesas": {"name": ["Milanesas", "Milanesas"], "tab": ["Milanesas", "Milanesas"]}, "pastas": {"name": ["Pastas artesanales", "Handmade pasta"], "tab": ["Pastas artesanales", "Handmade pasta"]}, "pizzas": {"name": ["Pizzas artesanales", "Artisan pizzas"], "tab": ["Pizzas artesanales", "Artisan pizzas"]}, "bebidas": {"name": ["Bebidas", "Soft drinks"], "tab": ["Bebidas", "Soft drinks"]}, "tragos": {"name": ["Tragos y cervezas", "Drinks & beer"], "tab": ["Tragos y cervezas", "Drinks & beer"]}, "postres": {"name": ["Postres", "Desserts"], "tab": ["Postres", "Desserts"]}, "varios": {"name": ["Adicionales y salsas", "Extras & sauces"], "tab": ["Adicionales y salsas", "Extras & sauces"]}};
const menuDishes = [
  {
    "id": "fudo-3",
    "category": "cafeteria",
    "name": "Cafe Chico",
    "nameEn": "Cafe Chico",
    "price": 4000,
    "description": "Café chico",
    "image": "fotos/producto-3.webp",
    "descriptionEn": "Small coffee"
  },
  {
    "id": "fudo-4",
    "category": "cafeteria",
    "name": "Cafe Jarrito",
    "nameEn": "Cafe Jarrito",
    "price": 4800,
    "description": "",
    "image": "fotos/producto-4.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-28",
    "category": "cafeteria",
    "name": "Café doble",
    "nameEn": "Double coffee",
    "price": 6000,
    "description": "",
    "image": "fotos/producto-28.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-30",
    "category": "cafeteria",
    "name": "Submarino",
    "nameEn": "Submarine",
    "price": 6500,
    "description": "",
    "image": "fotos/producto-30.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-57",
    "category": "cafeteria",
    "name": "Te",
    "nameEn": "Tea",
    "price": 3500,
    "description": "",
    "image": "fotos/producto-57.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-127",
    "category": "cafeteria",
    "name": "Lagrima en jarrito",
    "nameEn": "Tear in a jar",
    "price": 4800,
    "description": "",
    "image": "fotos/producto-127.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-180",
    "category": "cafeteria",
    "name": "Cafe grande",
    "nameEn": "Large coffee",
    "price": 7000,
    "description": "",
    "image": "fotos/producto-180.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-5",
    "category": "cafeteria",
    "name": "Medialunas",
    "nameEn": "Croissants",
    "price": 1500,
    "description": "Dulce/salada",
    "image": "fotos/producto-5.webp",
    "descriptionEn": "Sweet/Salty"
  },
  {
    "id": "fudo-193",
    "category": "cafeteria",
    "name": "Avocado toast con huevo revuelt",
    "nameEn": "Avocado toast with scrambled egg",
    "price": 9500,
    "description": "Tostada con pan de campo, huevo revuelto y palta con queso crema.",
    "image": "fotos/producto-193.webp",
    "descriptionEn": "Toasted bread with country bread, scrambled egg and avocado with cream cheese."
  },
  {
    "id": "fudo-192",
    "category": "cafeteria",
    "name": "Tostadas con queso crema y mermelada.",
    "nameEn": "Toast with cream cheese and jam.",
    "price": 8500,
    "description": "2 tostadas con pan de campo, un dip de mermelada y un dip de queso crema.",
    "image": "fotos/producto-192.webp",
    "descriptionEn": "2 slices of country bread toast, a jam dip and a cream cheese dip."
  },
  {
    "id": "fudo-31",
    "category": "cafeteria",
    "name": "Tostado de jamón y queso",
    "nameEn": "Ham and cheese toastie",
    "price": 7000,
    "description": "Tostado de jamón y queso en pan de miga.",
    "image": "fotos/producto-31.webp",
    "descriptionEn": "Toasted ham and cheese on white bread."
  },
  {
    "id": "fudo-61",
    "category": "cafeteria",
    "name": "Medialuna con jamón y queso",
    "nameEn": "Croissant with ham and cheese",
    "price": 3500,
    "description": "",
    "image": "fotos/producto-61.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-165",
    "category": "cafeteria",
    "name": "Alfajores",
    "nameEn": "Caramel cookies",
    "price": 2500,
    "description": "",
    "image": "fotos/producto-165.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-198",
    "category": "entradas",
    "name": "Papas fritas",
    "nameEn": "French fries",
    "price": 14000,
    "description": "Porción de papas fritas, hechas con papas naturales.",
    "image": "fotos/producto-198.webp",
    "descriptionEn": "Portion of french fries, made with natural potatoes."
  },
  {
    "id": "fudo-196",
    "category": "entradas",
    "name": "Papas fritas a caballo",
    "nameEn": "French fries with a fried egg on top",
    "price": 14500,
    "description": "Papas naturales con dos huevos.",
    "image": "fotos/producto-196.webp",
    "descriptionEn": "Plain potatoes with two eggs."
  },
  {
    "id": "fudo-197",
    "category": "entradas",
    "name": "Papas fritas al champiñón",
    "nameEn": "Mushroom fries",
    "price": 16000,
    "description": "Papas naturales con crema y champiñones.",
    "image": "fotos/producto-197.webp",
    "descriptionEn": "Plain potatoes with cream and mushrooms."
  },
  {
    "id": "fudo-195",
    "category": "entradas",
    "name": "Papas fritas con crema de verdeo",
    "nameEn": "French fries with green onion cream",
    "price": 15000,
    "description": "Papas naturales con crema y cebolla de verdeo.",
    "image": "fotos/producto-195.webp",
    "descriptionEn": "Natural potatoes with cream and green onions."
  },
  {
    "id": "fudo-138",
    "category": "hamburguesas",
    "name": "Golden steak burger",
    "nameEn": "Golden steak burger",
    "price": 14800,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, cebolla caramelizada, bacon, salsa secreta y cheddar. Incluye una porción de papas fritas.",
    "image": "fotos/producto-138.webp",
    "descriptionEn": "Potato bun, top sirloin medallion and roast beef, caramelized onions, bacon, secret sauce and cheddar. Includes a side of fries."
  },
  {
    "id": "fudo-129",
    "category": "hamburguesas",
    "name": "Big mc burguer",
    "nameEn": "Big McBurger",
    "price": 14500,
    "description": "Reversión de la famosa Big Mac. Pan de papa, medallón de tapa de asado y roastbeef, salsa Big Mac, cheddar, pepinillos, lechuga y cebolla morada. Incluye porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-129.webp",
    "descriptionEn": "A twist on the famous Big Mac. Potato bun, top sirloin and roast beef patty, Big Mac sauce, cheddar cheese, pickles, lettuce, and red onion. Includes a side of fries. Veggie option available."
  },
  {
    "id": "fudo-21",
    "category": "hamburguesas",
    "name": "Big oddy",
    "nameEn": "Big Oddy",
    "price": 14800,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef con queso roquefort, tomates, miel y queso fundido. Incluye porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-21.webp",
    "descriptionEn": "Potato bread, roast beef medallion with Roquefort cheese, tomatoes, honey, and melted cheese. Includes a side of fries. A vegetarian option is available upon request."
  },
  {
    "id": "fudo-142",
    "category": "hamburguesas",
    "name": "Mushroom burger",
    "nameEn": "Mushroom burger",
    "price": 15000,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, roquefort, champiñones, rúcula, alioli y mostaza dulce. Incluye una porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-142.webp",
    "descriptionEn": "Potato bun, roast beef medallion, Roquefort cheese, mushrooms, arugula, aioli, and honey mustard. Includes a side of fries. A vegetarian option is available upon request."
  },
  {
    "id": "fudo-190",
    "category": "hamburguesas",
    "name": "Royal roquefort",
    "nameEn": "Royal Roquefort",
    "price": 15000,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, roquefort, queso tybo, cebolla caramelizada y panceta. Incluye una porción de papas fritas.",
    "image": "fotos/producto-190.webp",
    "descriptionEn": "Potato bread, top round medallion and roast beef, Roquefort cheese, Tybo cheese, caramelized onions and bacon. Includes a portion of French fries."
  },
  {
    "id": "fudo-130",
    "category": "hamburguesas",
    "name": "The king oddy",
    "nameEn": "The King Oddy",
    "price": 14800,
    "description": "Reversión de la famosa Whopper by Oddyson. Pan de papa, medallón de tapa de asado y roastbeef, lechuga, tomate, cebolla, cheddar y salsa King Oddy. Incluye porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-130.webp",
    "descriptionEn": "Oddyson's take on the famous Whopper. Potato bun, top sirloin and roast beef patty, lettuce, tomato, onion, cheddar cheese, and King Oddy sauce. Includes a side of fries. Veggie option available."
  },
  {
    "id": "fudo-20",
    "category": "hamburguesas",
    "name": "Gorddyson burger",
    "nameEn": "Gordyson Burger",
    "price": 15000,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, cheddar, bacon y huevo a la plancha. Incluye una porción de papas fritas.",
    "image": "fotos/producto-20.webp",
    "descriptionEn": "Potato bun, top round medallion and roast beef, cheddar, bacon and fried egg. Includes a portion of fries."
  },
  {
    "id": "fudo-132",
    "category": "hamburguesas",
    "name": "By fogg",
    "nameEn": "By fogg",
    "price": 14500,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, alioli ahumado, cebolla morada brunoise y cheddar. Incluye una porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-132.webp",
    "descriptionEn": "Potato bun, top sirloin medallion and roast beef, smoked aioli, diced red onion and cheddar cheese. Includes a side of fries. Vegetarian option available."
  },
  {
    "id": "fudo-137",
    "category": "hamburguesas",
    "name": "Oklahoma fríed onion",
    "nameEn": "Oklahoma fried onion",
    "price": 14500,
    "description": "Pan de papa, cheddar, cebolla cortada finamente, medallón de tapa de asado y roastbeef. Incluye porción de fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-137.webp",
    "descriptionEn": "Potato bun, cheddar cheese, finely sliced ​​onions, top round medallion, and roast beef. Includes a side of fries. A vegetarian option is available upon request."
  },
  {
    "id": "fudo-189",
    "category": "hamburguesas",
    "name": "Deluxe burger",
    "nameEn": "Deluxe burger",
    "price": 14500,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, cheddar, lechuga, tomate, cebolla morada y alioli. Incluye una porción de papas fritas.",
    "image": "fotos/producto-189.webp",
    "descriptionEn": "Potato bun, top sirloin medallion and roast beef, cheddar, lettuce, tomato, red onion and aioli. Includes a portion of French fries."
  },
  {
    "id": "fudo-131",
    "category": "hamburguesas",
    "name": "Chesse burger",
    "nameEn": "Cheese burger",
    "price": 14300,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, cheddar y una porción de fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-131.webp",
    "descriptionEn": "Potato bun, roast beef medallion, cheddar cheese, and a side of fries. A vegetarian option is available upon request."
  },
  {
    "id": "fudo-19",
    "category": "hamburguesas",
    "name": "Classic",
    "nameEn": "Classic",
    "price": 14600,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef con lechuga, tomate, jamón y queso. Incluye una porción de papas fritas. Se puede pedir opción veggie.",
    "image": "fotos/producto-19.webp",
    "descriptionEn": "Potato bun, roast beef medallion with lettuce, tomato, ham, and cheese. Includes a side of fries. Vegetarian option available."
  },
  {
    "id": "fudo-133",
    "category": "hamburguesas",
    "name": "Oddy style",
    "nameEn": "Oddy style",
    "price": 15000,
    "description": "Reversión de una de las hamburguesas de In-N-Out. Pan de papa, medallón de tapa de asado y roastbeef con mostaza a la plancha, doble queso, cebolla caramelizada, lechuga, tomate y salsa especial.",
    "image": "fotos/producto-133.webp",
    "descriptionEn": "A twist on one of In-N-Out's burgers. Potato bun, top sirloin patty and grilled roast beef with mustard, double cheese, caramelized onions, lettuce, tomato, and special sauce."
  },
  {
    "id": "fudo-170",
    "category": "hamburguesas",
    "name": "Paltastic Burger",
    "nameEn": "Paltastic Burger",
    "price": 15500,
    "description": "Pan de papa, medallón de tapa de asado y roastbeef, cheddar, palta y bacon. Incluye una porción de papas fritas.",
    "image": "fotos/producto-170.webp",
    "descriptionEn": "Potato bun, top sirloin medallion and roast beef, cheddar, avocado and bacon. Includes a portion of fries."
  },
  {
    "id": "fudo-12",
    "category": "milanesas",
    "name": "milanesa napolitana",
    "nameEn": "Neapolitan milanesa",
    "price": 19500,
    "description": "Clásica milanesa casera de ternera, cubierta con salsa de tomate artesanal, jamón cocido, queso mozzarella gratinado y un toque de orégano fresco. Servida con guarnición a elección.",
    "image": "fotos/producto-12.webp",
    "descriptionEn": "Classic homemade breaded veal cutlet, topped with homemade tomato sauce, cooked ham, melted mozzarella cheese, and a touch of fresh oregano. Served with your choice of side dish."
  },
  {
    "id": "fudo-15",
    "category": "milanesas",
    "name": "Milanesa con crema de verdeo",
    "nameEn": "Breaded cutlet with green onion cream",
    "price": 19500,
    "description": "Milanesa de ternera casera con crema de verdeo y guarnición a elección.",
    "image": "fotos/producto-15.webp",
    "descriptionEn": "Homemade veal milanesa with green onion cream and side dish of your choice."
  },
  {
    "id": "fudo-16",
    "category": "milanesas",
    "name": "Milanesa oddyson",
    "nameEn": "Milanesa Oddyson",
    "price": 20500,
    "description": "Milanesa de ternera casera con queso cheddar, panceta crocante y huevo a la plancha. Acompañada de guarnición a elección.",
    "image": "fotos/producto-16.webp",
    "descriptionEn": "Homemade breaded veal cutlet with cheddar cheese, crispy bacon, and a fried egg. Served with your choice of side dish."
  },
  {
    "id": "fudo-92",
    "category": "milanesas",
    "name": "Milanesa Royal",
    "nameEn": "Royal Milanese",
    "price": 19500,
    "description": "Milanesa con salsa de roquefort y queso mozzarella. Acompañada de una guarnición a elección.",
    "image": "fotos/producto-92.webp",
    "descriptionEn": "Breaded cutlet with Roquefort sauce and mozzarella cheese. Served with a side dish of your choice."
  },
  {
    "id": "fudo-139",
    "category": "milanesas",
    "name": "Milanesa a caballo",
    "nameEn": "Milanesa a caballo",
    "price": 19000,
    "description": "Milanesa de ternera acompañada con huevo a la plancha y una guarnición.",
    "image": "fotos/producto-139.webp",
    "descriptionEn": "Veal Milanese served with a fried egg and a side dish."
  },
  {
    "id": "fudo-140",
    "category": "milanesas",
    "name": "Milanesa con crema de champiñones",
    "nameEn": "Breaded cutlet with mushroom cream",
    "price": 22000,
    "description": "Milanesa de ternera acompañada con crema de champiñones y una guarnición a elección.",
    "image": "fotos/producto-140.webp",
    "descriptionEn": "Veal Milanese served with mushroom cream and a side dish of your choice."
  },
  {
    "id": "fudo-148",
    "category": "milanesas",
    "name": "Milanesa con rúcula y jamón crudo",
    "nameEn": "Breaded cutlet with arugula and prosciutto",
    "price": 22000,
    "description": "Milanesa con jamón crudo, tomate, rúcula y queso parmesano. Incluye una guarnición a elección.",
    "image": "fotos/producto-148.webp",
    "descriptionEn": "Breaded cutlet with prosciutto, tomato, arugula, and Parmesan cheese. Includes a choice of side dish."
  },
  {
    "id": "fudo-181",
    "category": "milanesas",
    "name": "Milanesa a la pizza",
    "nameEn": "Milanesa a la pizza",
    "price": 21000,
    "description": "Milanesa de ternera, con mozzarella, tomate y orégano. Acompañada de una porción de papas fritas.",
    "image": null,
    "descriptionEn": "Breaded veal cutlet with mozzarella, tomato, and oregano. Served with a side of French fries."
  },
  {
    "id": "fudo-182",
    "category": "milanesas",
    "name": "Milanesa capresse",
    "nameEn": "Caprese Milanese",
    "price": 19500,
    "description": "Milanesa de ternera, con mozzarella, albahaca y tomates cherrys. Acompañada de una porción de papas fritas.",
    "image": null,
    "descriptionEn": "Breaded veal cutlet with mozzarella, basil, and cherry tomatoes. Served with a side of French fries."
  },
  {
    "id": "fudo-183",
    "category": "milanesas",
    "name": "Milanesa texana",
    "nameEn": "Texan breaded cutlet",
    "price": 20000,
    "description": "Milanesa de ternera con cheddar, panceta y cebolla caramelizada.",
    "image": null,
    "descriptionEn": "Veal Milanese with cheddar, bacon and caramelized onion."
  },
  {
    "id": "fudo-184",
    "category": "milanesas",
    "name": "Milanesa 4 quesos",
    "nameEn": "Four cheese milanesa",
    "price": 20000,
    "description": "Milanesa de ternera con 4 quesos, acompañada de una porción de papas fritas.",
    "image": null,
    "descriptionEn": "Veal Milanese with 4 cheeses, accompanied by a portion of french fries."
  },
  {
    "id": "fudo-185",
    "category": "milanesas",
    "name": "Milanesa BBQ",
    "nameEn": "BBQ Milanesa",
    "price": 20000,
    "description": "Milanesa de ternera con barbacoa, cheddar y panceta ahumada. Incluye porción de papas fritas.",
    "image": null,
    "descriptionEn": "Breaded veal cutlet with barbecue sauce, cheddar cheese, and smoked bacon. Includes a side of fries."
  },
  {
    "id": "fudo-186",
    "category": "milanesas",
    "name": "Milanesa argenta",
    "nameEn": "Argentine milanesa",
    "price": 21000,
    "description": "Milanesa de ternera con jamón, mozzarella, lechuga, tomate y huevo a la plancha. Incluye una porción de papas fritas.",
    "image": null,
    "descriptionEn": "Breaded veal cutlet with ham, mozzarella, lettuce, tomato, and a fried egg. Includes a side of French fries."
  },
  {
    "id": "fudo-95",
    "category": "pastas",
    "name": "Ñoquis de papa con salsa a elección.",
    "nameEn": "Potato gnocchi with your choice of sauce.",
    "price": 19500,
    "description": "Ñoquis con varias salsas a elección, elegí la que más te guste!",
    "image": "fotos/producto-95.webp",
    "descriptionEn": "Gnocchi with various sauces of your choice, choose the one you like best!"
  },
  {
    "id": "fudo-99",
    "category": "pizzas",
    "name": "Pizza mozzarella",
    "nameEn": "Mozzarella pizza",
    "price": 17500,
    "description": "",
    "image": "fotos/producto-99.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-100",
    "category": "pizzas",
    "name": "Pizza especial",
    "nameEn": "Special pizza",
    "price": 19200,
    "description": "Pizza de masa madre con muzzarella, jamón y morrones.",
    "image": "fotos/producto-100.webp",
    "descriptionEn": "Sourdough pizza with mozzarella, ham and bell peppers."
  },
  {
    "id": "fudo-101",
    "category": "pizzas",
    "name": "Pizza de roquefort",
    "nameEn": "Roquefort pizza",
    "price": 20000,
    "description": "Pizza de masa madre con roquefort, mozzarella y aceitunas.",
    "image": "fotos/producto-101.webp",
    "descriptionEn": "Sourdough pizza with Roquefort, mozzarella and olives."
  },
  {
    "id": "fudo-102",
    "category": "pizzas",
    "name": "La oddy pizza",
    "nameEn": "The Oddy Pizza",
    "price": 23000,
    "description": "Pizza de masa madre, salsa de tomate casera, mozzarella, panceta crocante, cheddar y huevo a la plancha.",
    "image": "fotos/producto-102.webp",
    "descriptionEn": "Sourdough pizza, homemade tomato sauce, mozzarella, crispy bacon, cheddar and fried egg."
  },
  {
    "id": "fudo-110",
    "category": "pizzas",
    "name": "Pizza 4 quesos",
    "nameEn": "Four cheese pizza",
    "price": 21000,
    "description": "Pizza de masa madre, con 4 quesos: pategrás, muzzarella, roquefort y tybo.",
    "image": "fotos/producto-110.webp",
    "descriptionEn": "Sourdough pizza with 4 cheeses: pategrás, mozzarella, roquefort and tybo."
  },
  {
    "id": "fudo-111",
    "category": "pizzas",
    "name": "Pizza napolitana",
    "nameEn": "Neapolitan pizza",
    "price": 19500,
    "description": "Pizza de masa madre con tomate, ajo y mozzarella.",
    "image": "fotos/producto-111.webp",
    "descriptionEn": "Sourdough pizza with tomato, garlic and mozzarella."
  },
  {
    "id": "fudo-112",
    "category": "pizzas",
    "name": "Pizza calabresa",
    "nameEn": "Calabrese pizza",
    "price": 20000,
    "description": "",
    "image": "fotos/producto-112.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-136",
    "category": "pizzas",
    "name": "Pizza con rúcula y jamón crudo",
    "nameEn": "Pizza with arugula and prosciutto",
    "price": 23000,
    "description": "",
    "image": "fotos/producto-136.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-145",
    "category": "pizzas",
    "name": "Pizza capresse",
    "nameEn": "Caprese pizza",
    "price": 19500,
    "description": "Tomate fresco, albahaca, mozzarella y aceitunas.",
    "image": "fotos/producto-145.webp",
    "descriptionEn": "Fresh tomato, basil, mozzarella and olives."
  },
  {
    "id": "fudo-201",
    "category": "pizzas",
    "name": "Pizza fugazetta",
    "nameEn": "Fugazetta pizza",
    "price": 20000,
    "description": "",
    "image": "fotos/producto-201.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-1",
    "category": "bebidas",
    "name": "Coca-Cola 500ml",
    "nameEn": "Coca-Cola 500ml",
    "price": 4000,
    "description": "",
    "image": "fotos/producto-1.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-6",
    "category": "bebidas",
    "name": "Agua Mineral 500ml",
    "nameEn": "Mineral Water 500ml",
    "price": 3000,
    "description": "",
    "image": "fotos/producto-6.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-23",
    "category": "bebidas",
    "name": "Coca cola zero 500ml",
    "nameEn": "Coca-Cola Zero 500ml",
    "price": 4000,
    "description": "",
    "image": "fotos/producto-23.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-24",
    "category": "bebidas",
    "name": "Sprite 500ml",
    "nameEn": "Sprite 500ml",
    "price": 4000,
    "description": "",
    "image": "fotos/producto-24.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-25",
    "category": "bebidas",
    "name": "Fanta 500ml",
    "nameEn": "Fanta 500ml",
    "price": 4000,
    "description": "",
    "image": "fotos/producto-25.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-26",
    "category": "bebidas",
    "name": "Agua saborizada",
    "nameEn": "Flavored water",
    "price": 3500,
    "description": "",
    "image": "fotos/producto-26.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-51",
    "category": "tragos",
    "name": "GIN TONIC FRUTOS ROJOS",
    "nameEn": "Red Fruit Gin and Tonic",
    "price": 9000,
    "description": "",
    "image": "fotos/producto-51.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-173",
    "category": "tragos",
    "name": "GIN TONIC DE LIMON",
    "nameEn": "Lemon Gin and Tonic",
    "price": 9000,
    "description": "",
    "image": "fotos/producto-173.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-174",
    "category": "tragos",
    "name": "GIN TONIC MENTA Y PEPINO",
    "nameEn": "Mint and Cucumber Gin and Tonic",
    "price": 9000,
    "description": "",
    "image": "fotos/producto-174.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-175",
    "category": "tragos",
    "name": "GIN TONIC DE NARANJA Y CANELA",
    "nameEn": "Orange and cinnamon gin and tonic",
    "price": 9000,
    "description": "",
    "image": "fotos/producto-175.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-36",
    "category": "tragos",
    "name": "FERNET",
    "nameEn": "FERNET",
    "price": 8000,
    "description": "",
    "image": "fotos/producto-36.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-37",
    "category": "tragos",
    "name": "CERVEZA",
    "nameEn": "BEER",
    "price": 6500,
    "description": "Cervezas artesanales",
    "image": "fotos/producto-37.webp",
    "descriptionEn": "Craft beers"
  },
  {
    "id": "fudo-38",
    "category": "tragos",
    "name": "GANCIA",
    "nameEn": "GANCIA",
    "price": 7000,
    "description": "",
    "image": "fotos/producto-38.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-40",
    "category": "tragos",
    "name": "Vino tinto",
    "nameEn": "Red wine",
    "price": 16000,
    "description": "",
    "image": "fotos/producto-40.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-41",
    "category": "tragos",
    "name": "CAMPARI",
    "nameEn": "CAMPARI",
    "price": 7000,
    "description": "",
    "image": "fotos/producto-41.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-66",
    "category": "tragos",
    "name": "Copa Vino",
    "nameEn": "Wine Glass",
    "price": 4500,
    "description": "",
    "image": "fotos/producto-66.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-143",
    "category": "tragos",
    "name": "Heineken litro",
    "nameEn": "Heineken liter",
    "price": 14000,
    "description": "",
    "image": "fotos/producto-143.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-144",
    "category": "tragos",
    "name": "Stella artois",
    "nameEn": "Stella Artois",
    "price": 10500,
    "description": "",
    "image": "fotos/producto-144.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-176",
    "category": "tragos",
    "name": "TINTO DE VERANO",
    "nameEn": "Summer red wine",
    "price": 6500,
    "description": "",
    "image": "fotos/producto-176.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-7",
    "category": "postres",
    "name": "Flan clásico",
    "nameEn": "Classic flan",
    "price": 5000,
    "description": "Suave flan de vainilla, elaborado de manera artesanal, acompañado con crema batida fresca y dulce de leche casero.",
    "image": "fotos/producto-7.webp",
    "descriptionEn": "Smooth vanilla flan, handcrafted, served with fresh whipped cream and homemade dulce de leche."
  },
  {
    "id": "fudo-199",
    "category": "postres",
    "name": "Tiramisu",
    "nameEn": "Tiramisu",
    "price": 7500,
    "description": "",
    "image": "fotos/producto-199.webp",
    "descriptionEn": ""
  },
  {
    "id": "fudo-10",
    "category": "varios",
    "name": "pure de papas",
    "nameEn": "mashed potatoes",
    "price": 0,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-11",
    "category": "varios",
    "name": "papas fritass",
    "nameEn": "french fries",
    "price": 0,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-34",
    "category": "varios",
    "name": "Doble",
    "nameEn": "Double",
    "price": 2000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-35",
    "category": "varios",
    "name": "Triple",
    "nameEn": "Triple",
    "price": 3000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-69",
    "category": "varios",
    "name": "puré de batatas",
    "nameEn": "sweet potato puree",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-70",
    "category": "varios",
    "name": "Salsa de verdeo",
    "nameEn": "Green onion sauce",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-71",
    "category": "varios",
    "name": "salsa bolognesa",
    "nameEn": "Bolognese sauce",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-72",
    "category": "varios",
    "name": "salsa de roquefort",
    "nameEn": "Roquefort sauce",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-73",
    "category": "varios",
    "name": "salsa fileto",
    "nameEn": "filetto sauce",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-84",
    "category": "varios",
    "name": "Cuadruple",
    "nameEn": "Quadruple",
    "price": 4000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-97",
    "category": "varios",
    "name": "Milanesa XXL",
    "nameEn": "XXL Milanese",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-98",
    "category": "varios",
    "name": "Salsa de 4 quesos",
    "nameEn": "Four cheese sauce",
    "price": 5000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-134",
    "category": "varios",
    "name": "salsa big mac",
    "nameEn": "Big Mac sauce",
    "price": 1500,
    "description": "Salsa cremosa y con sabor dulce-ácido que se elabora principalmente con una base de mayonesa, mostaza y relish de pepinillos agridulces, complementada con vinagre, cebolla en polvo y pimentón.",
    "image": null,
    "descriptionEn": "A creamy, sweet-and-sour sauce made primarily with a base of mayonnaise, mustard, and sweet and sour pickle relish, complemented with vinegar, onion powder, and paprika."
  },
  {
    "id": "fudo-135",
    "category": "varios",
    "name": "salsa stacker",
    "nameEn": "Stacker sauce",
    "price": 1500,
    "description": "Salsa a base de mayonesa, ketchup, mostaza, cebolla y condimentos.",
    "image": null,
    "descriptionEn": "Sauce made with mayonnaise, ketchup, mustard, onion and seasonings."
  },
  {
    "id": "fudo-149",
    "category": "varios",
    "name": "Salsa Cheddar",
    "nameEn": "Cheddar Sauce",
    "price": 2500,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-154",
    "category": "varios",
    "name": "OPCION VEGETARIANA",
    "nameEn": "VEGETARIAN OPTION",
    "price": 0,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-171",
    "category": "varios",
    "name": "ali oli",
    "nameEn": "aioli",
    "price": 3000,
    "description": "",
    "image": null,
    "descriptionEn": ""
  },
  {
    "id": "fudo-188",
    "category": "varios",
    "name": "milanesa doble XXL",
    "nameEn": "XXL double milanesa",
    "price": 0,
    "description": "",
    "image": null,
    "descriptionEn": ""
  }
];

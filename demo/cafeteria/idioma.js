/* Keldy Café · traducción español / inglés.
   Para un producto nuevo: agregá "Texto en español":"English text" en EN. */
(function(){
const EN={
 "Carta":"Menu","Visitanos":"Visit us","Pedir":"Order","¿Todavía no pasaste por tu":"Haven't had your","café?":"coffee yet?",
 "Café de especialidad y pastelería artesanal al paso, en el centro de la ciudad. Almuerzos con envío y 15 % off pagando en efectivo.":"Specialty coffee and homemade pastries to go, downtown. Lunch delivery and 15% off when paying cash.",
 "Pedir por WhatsApp":"Order on WhatsApp","Ver la carta":"See the menu","Café de especialidad":"Specialty coffee","Pastelería artesanal":"Homemade pastries",
 "Almuerzos con envío":"Lunch delivery","15 % off en efectivo":"15% off paying cash","Take away":"Take away","Keldy, al paso":"Keldy, on the go",
 "Tu pausa":"Your everyday","de todos":"little","los días.":"break.","Un mostrador chico en el centro, café recién hecho y todo lo dulce horneado acá.":"A small counter downtown, freshly brewed coffee and every sweet treat baked right here.",
 "Para llevar":"To go","Almuerzos":"Lunch","Envíos de 9 a 14 h":"Delivery 9 am to 2 pm","Bowls":"Bowls","Pagando en efectivo":"Paying cash","15 % off":"15% off",
 "Dónde estamos":"Find us","La carta":"The menu","Qué hay":"What's on","hoy.":"today.",
 "Precios actualizados. Pedí por WhatsApp y pasá a buscar, o pedí el almuerzo con envío.":"Updated prices. Order on WhatsApp and pick it up, or get lunch delivered.",
 "Sándwiches":"Sandwiches","Ensaladas":"Salads","Tarta del día":"Quiche of the day","Pastelería":"Pastries","Panadería":"Bakery",
 "Envíos de almuerzo de 9 a 14 h":"Lunch delivery 9 am to 2 pm","15 % off pagando en efectivo":"15% off paying cash","Pedidos solo por WhatsApp":"Orders by WhatsApp only",
 "Pedidos":"Orders","Escribinos":"Message us","y listo.":"and you're set.","Armamos tu pedido para que pases a buscarlo o te lo mandamos.":"We'll get your order ready for pickup or send it to you.",
 "Dirección":"Address","Horario":"Hours","Lun a sáb · desde las 8 h":"Mon to Sat · from 8 am","Envíos":"Delivery","Hasta las 19 h":"Until 7 pm",
 "Volver arriba ↑":"Back to top ↑","Preguntar por WhatsApp ↗":"Ask on WhatsApp ↗",
 /* Sándwiches */
 "Jamón cocido y queso":"Ham and cheese","Clásico":"Classic","Jamón crudo y queso":"Prosciutto and cheese","Salame bastón y queso":"Salami and cheese",
 "Lomito ahumado":"Smoked pork loin","Con tomate":"With tomato","Focaccia de mortadela":"Mortadella focaccia","Mortadela con pistacho, rúcula y queso gouda":"Pistachio mortadella, arugula and gouda",
 "Jamón crudo y parmesano":"Prosciutto and parmesan","Con rúcula y tomate":"With arugula and tomato","Jamón cocido y palta":"Ham and avocado",
 "Queso, tomate, lechuga y crema de palta":"Cheese, tomato, lettuce and avocado cream","Brie y tomate confitado":"Brie and confit tomato","Con rúcula":"With arugula",
 "Veggie":"Veggie","Palta, rúcula, tomate y hummus":"Avocado, arugula, tomato and hummus","Pollo y crema de palta":"Chicken and avocado cream",
 "Con cebolla morada y tomate":"With red onion and tomato","Pollo y parmesano gratinado":"Chicken and melted parmesan","Con rúcula y crema de tomates":"With arugula and tomato cream",
 "Ternera y mostaza":"Beef and mustard","Con cebolla caramelizada y rúcula":"With caramelized onion and arugula","Cerdo braseado":"Braised pork",
 "Con rúcula y chutney":"With arugula and chutney","Atún y queso crema":"Tuna and cream cheese","Con pepino y aceitunas negras":"With cucumber and black olives",
 /* Ensaladas */
 "César":"Caesar","Lechuga crespa, pollo, parmesano, croutons y aderezo César":"Lettuce, chicken, parmesan, croutons and Caesar dressing",
 "Pollo":"Chicken","Hojas verdes, tomate confitado, champiñón, croutons y huevo poché":"Greens, confit tomato, mushroom, croutons and poached egg",
 "Calabaza":"Pumpkin","Hojas verdes, calabaza asada, brie, aceitunas negras, uvas y tomate cherry":"Greens, roasted pumpkin, brie, black olives, grapes and cherry tomato",
 "Atún":"Tuna","Hojas verdes, zanahoria, tomate, choclo, lomito de atún y palta":"Greens, carrot, tomato, corn, tuna and avocado",
 "Arroz yamaní y lentejas":"Brown rice and lentils","Zanahoria, tomate, rúcula, huevo duro y vinagreta opcional de perejil y limón":"Carrot, tomato, arugula, boiled egg and optional parsley-lemon vinaigrette",
 "Consultanos por la variedad de hoy":"Ask us about today's flavor",
 /* Pastelería y panadería */
 "Scones":"Scones","Scones de queso":"Cheese scones","Cookies de avena, manzana y pasas":"Oat, apple and raisin cookies","Cookies de avena, maní y chocolate":"Oat, peanut and chocolate cookies",
 "Cookies doble choco":"Double chocolate cookies","Muffins":"Muffins","Budines":"Pound cakes","Alfajores":"Alfajores","Alfacookies":"Alfacookies",
 "Cuadrado de zanahoria y nuez":"Carrot and walnut bar","Cuadrado de limón":"Lemon bar","Cuadrado de limón y frutos rojos":"Lemon and berry bar",
 "Cuadrado de ciruela y nuez":"Plum and walnut bar","Cuadrado de naranja y chocolate":"Orange and chocolate bar","Cuadrado de coco y dulce de leche":"Coconut and dulce de leche bar",
 "Cuadrado de brownie con maní":"Peanut brownie","Cuadrado solo chocolate":"Chocolate bar","Cuadrado de brownie con arándano y nuez":"Cranberry walnut brownie",
 "Crumble de manzana":"Apple crumble","Crumble de frutos rojos":"Berry crumble","Cheesecake de frutos rojos":"Berry cheesecake","Chocotorta":"Chocotorta",
 "Medialunas y vigilantes":"Croissants and pastries","Croissants":"Croissants","Croissant con jamón y queso":"Ham and cheese croissant",
 "Roll de manzana y canela":"Apple cinnamon roll","Pain au chocolat":"Pain au chocolat",
 /* atributos */
 "Cambiar a modo oscuro":"Switch to dark mode","Cambiar a modo claro":"Switch to light mode","Ver categorías anteriores":"Previous categories","Ver más categorías":"More categories",
 "Leche vaporizada cayendo en un vaso de café para llevar":"Steamed milk poured into a coffee to go","Café con un corazón de espuma":"Coffee with latte art",
 "Bowl con vegetales, pollo y huevo poché":"Bowl with vegetables, chicken and poached egg","Mostrador de la cafetería":"Coffee shop counter"
};
const ES={};for(const k in EN)ES[EN[k]]=k;
let idioma=(()=>{try{return localStorage.getItem("keldy-idioma")||"es"}catch(e){return "es"}})();
const ATTR=["placeholder","aria-label","alt","title"];
function traducir(raiz){
 const dic=idioma==="en"?EN:ES;
 const w=document.createTreeWalker(raiz,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest("script,style"))continue;
  const v=n.nodeValue,k=v.trim(),k2=k.replace(/\s*·$/,"");if(k&&dic[k])n.nodeValue=v.replace(k,dic[k]);else if(k2&&dic[k2])n.nodeValue=v.replace(k2,dic[k2])}
 (raiz.querySelectorAll?raiz:document).querySelectorAll("*").forEach(e=>ATTR.forEach(a=>{const v=e.getAttribute(a);if(v&&dic[v])e.setAttribute(a,dic[v])}));
}
const btn=document.createElement("button");btn.type="button";btn.className="theme-btn";btn.id="langBtn";
btn.style.cssText="width:auto;padding:0 8px;font:700 .75rem Arial,sans-serif;opacity:1";
const tema=document.getElementById("themeBtn");tema.parentNode.insertBefore(btn,tema);
function aplicar(){document.documentElement.lang=idioma;btn.textContent=idioma==="es"?"EN":"ES";btn.setAttribute("aria-label",idioma==="es"?"English":"Español");traducir(document.body)}
btn.onclick=()=>{idioma=idioma==="es"?"en":"es";try{localStorage.setItem("keldy-idioma",idioma)}catch(e){};aplicar()};
let ocupado=false;
new MutationObserver(ms=>{if(ocupado||idioma==="es")return;ocupado=true;ms.forEach(m=>m.addedNodes.forEach(x=>{if(x.nodeType===1)traducir(x);else if(x.nodeType===3&&x.parentElement)traducir(x.parentElement)}));ocupado=false})
 .observe(document.body,{childList:true,subtree:true});
if(idioma==="en")aplicar();else btn.textContent="EN";
})();

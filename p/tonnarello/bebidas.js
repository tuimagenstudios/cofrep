// Catálogo íntegro de bebidas del PDF INV2026. Cada producto tiene ID estable.
// Las apariciones repetidas del PDF se expresan en BEVERAGE_GROUPS, sin duplicar precios.
window.BEVERAGE_CATALOG=[];
const drink=(id,price,names,descriptions,allergens='',symbols=[],page=1)=>{
 const multilingual=value=>typeof value==='string'?{it:value,en:value,es:value}:value;
 BEVERAGE_CATALOG.push({id,price,names:multilingual(names),descriptions:multilingual(descriptions),allergens,symbols,page});
};
const wine=(id,price,name,region,abv,kind,bio=false)=>{
 const serving={glass:{it:'Al bicchiere',en:'By the glass',es:'Por copa'},bottle:{it:'In bottiglia',en:'Bottle',es:'En botella'},houseBottle:{it:'Bottiglia 0,75 L',en:'0.75 L bottle',es:'Botella de 0,75 L'}}[kind];
 const names=bio?{it:name,en:name.replace('BIO della casa','· house organic'),es:name.replace('BIO della casa','· ecológico de la casa')}:name;
 drink(id,price,names,{it:[serving.it,region,`${abv.replace('.',',')}%`].filter(Boolean).join(' · '),en:[serving.en,region,`${abv}%`].filter(Boolean).join(' · '),es:[serving.es,region,`${abv.replace('.',',')} %`].filter(Boolean).join(' · ')},'12',bio?['foglia']:[]);
};
// Página 1, columna izquierda, de arriba a abajo.
wine('pecorino-glass',5.5,'Pecorino IGT BIO della casa','Abruzzo','13','glass',true);
wine('chardonnay-glass',6,'Chardonnay Costamarina','Lazio','12.5','glass');
wine('rose-glass',6.5,'Rosé Negramaro Spaccafico','Puglia','12.5','glass');
wine('pinot-glass',8,'Pinot grigio Ca’povolta','Veneto','12','glass');
wine('prosecco-glass',6.5,'Prosecco DOC Treviso Marton','Veneto','11','glass');
drink('spritz',8.5,{it:'Spritz l’Aperitivo',en:'Spritz aperitif',es:'Spritz de aperitivo'},'','12');
wine('pecorino-bottle',16.5,'Pecorino IGT BIO della casa','Abruzzo','13','houseBottle',true);
wine('chardonnay-bottle',20,'Chardonnay Costamarina','Lazio','12.5','bottle');
wine('passerina-bottle',20,'Passerina Talamonti','Abruzzo','12.5','bottle');
wine('frascati-bottle',22,'Frascati Santa Passera','Lazio','13.5','bottle');
wine('pinot-bottle',22.5,'Pinot grigio Ca’povolta','Veneto','12','bottle');
wine('rose-bottle',24,'Rosé Negramaro Spaccafico','Puglia','12.5','bottle');
wine('gewurztraminer-bottle',28.5,'Gewurztraminer Hutte','Trentino','13.5','bottle');
wine('moscato-banfi-bottle',23.5,'Moscato d’Asti Banfi','Piemonte','5','bottle');
wine('bramito-bottle',46.5,'Bramito del Cervo Antinori','Umbria','12.5','bottle');
wine('jermann-bottle',42,'Pinot Grigio Jermann','Friuli','12.5','bottle');
wine('planeta-bottle',52,'Chardonnay Planeta','Sicilia','13','bottle');
wine('prosecco-bottle',26,'Prosecco DOC Treviso Marton','Veneto','11','bottle');
wine('ferrari-bottle',45,'Trento DOC Perlè Ferrari','Trentino','12.5','bottle');
wine('franciacorta-bottle',55,'Franciacorta DOCG Prestige Cà del bosco','', '12.5','bottle');
// Bottigliame: precio común de 4 € para cada alternativa de la lista.
const bottled={it:'Bottigliame',en:'Bottled soft drinks and juices',es:'Refrescos y zumos embotellados'};
[
 ['chinotto','Chinotto Neri'],['sprite','Sprite'],['fanta','Fanta'],['cedrata','Cedrata Tassoni'],
 ['tonic',{it:'Acqua tonica',en:'Tonic water',es:'Agua tónica'}],['schweppes-lemon','Schweppes Lemon'],
 ['coca-cola','Coca Cola'],['coca-cola-zero','Coca Cola Zero'],['iced-tea',{it:'Tè freddo',en:'Iced tea',es:'Té frío'}],
 ['ginger-ale','Ginger Ale'],['ginger-beer','Ginger Beer'],['red-bull','Red Bull'],['crodino','Crodino'],['ace','Ace'],
 ['orange',{it:'Arancia',en:'Orange',es:'Naranja'}],['pineapple',{it:'Ananas',en:'Pineapple',es:'Piña'}],
 ['peach',{it:'Pesca',en:'Peach',es:'Melocotón'}],['green-apple',{it:'Mela verde',en:'Green apple',es:'Manzana verde'}]
].forEach(([id,name])=>drink(id,4,name,bottled));
drink('passito-glass',6,'Passito di Pantelleria',{it:'Vino dolce al bicchiere',en:'Sweet wine by the glass',es:'Vino dulce por copa'},'12');
drink('moscato-sweet-glass',6,'Moscato d’Asti',{it:'Vino dolce al bicchiere',en:'Sweet wine by the glass',es:'Vino dulce por copa'},'12');
[
 ['espresso',2.5,'Espresso',''],
 ['espresso-corretto',3,{it:'Espresso corretto',en:'Espresso with liqueur',es:'Café espresso con licor'},''],
 ['caffellatte',4,{it:'Caffellatte',en:'Caffè latte',es:'Café con leche'},'7'],
 ['americano',3,{it:'Caffè americano',en:'Americano coffee',es:'Café americano'},''],
 ['cappuccino',4.5,{it:'Cappuccino',en:'Cappuccino',es:'Capuchino'},'7'],
 ['decaf',3,{it:'Decaffeinato',en:'Decaffeinated coffee',es:'Café descafeinado'},''],
 ['barley',3,{it:'Orzo',en:'Barley coffee',es:'Café de cebada'},'1'],
 ['hot-tea',4.5,{it:'Tè caldo',en:'Hot tea',es:'Té caliente'},'']
].forEach(([id,price,name,allergens])=>drink(id,price,name,'',allergens));
// Página 1, columna derecha.
wine('montepulciano-glass',6,'Montepulciano DOP BIO della casa','Abruzzo','13.5','glass',true);
wine('merlot-glass',6.5,'Merlot Costamarina','Lazio','12.5','glass');
wine('lambrusco-glass',6.5,'Lambrusco Panzon','Emilia','11','glass');
wine('chianti-glass',7,'Chianti DOCG Poggio Uberti','Toscana','12.5','glass');
wine('ripasso-glass',8.5,'Valpolicella Ripasso Bovaro','Veneto','13.5','glass');
wine('montepulciano-bottle',16.5,'Montepulciano DOP BIO della casa','Abruzzo','13.5','houseBottle',true);
wine('syrah-bottle',20.5,'Syrah Barbarella','Lazio','13','bottle');
wine('merlot-bottle',20,'Merlot Costamarina','Lazio','12.5','bottle');
wine('nero-troia-bottle',22,'Nero di Troia Spaccafico','Puglia','13','bottle');
wine('chianti-bottle',22,'Chianti DOCG Poggio Uberti','Toscana','12.5','bottle');
wine('cesanese-bottle',24,'Cesanese Federici','Lazio','14','bottle');
wine('lambrusco-bottle',22.5,'Lambrusco Panzon','Emilia','11','bottle');
wine('ripasso-bottle',28.5,'Valpolicella Ripasso Bovaro','Veneto','13.5','bottle');
wine('amarone-bottle',56,'Amarone Bovaro','Veneto','15.5','bottle');
wine('bruciato-bottle',60,'Bolgheri Il Bruciato Antinori','Toscana','13.5','bottle');
wine('barolo-bottle',55,'Barolo Batasiolo','Piemonte','14.5','bottle');
wine('brunello-bottle',58,'Brunello I Palazzi','Toscana','14','bottle');
wine('tignanello-bottle',210,'Tignanello Antinori','Toscana','14','bottle');
const beer=(id,price,name,size,draught=true)=>drink(id,price,size?{it:`${name} · ${size.replace('.',',')} L`,en:`${name} · ${size} L`,es:`${name} · ${size.replace('.',',')} L`}:name,draught?{it:'Alla spina',en:'Draught',es:'De barril'}:{it:'In bottiglia',en:'Bottled',es:'En botella'},'1');
beer('nastro-200',5,'Peroni Nastro Azzurro','0.2');beer('nastro-400',8,'Peroni Nastro Azzurro','0.4');
beer('gran-riserva-200',5.5,'Peroni Gran Riserva','0.2');beer('gran-riserva-400',9,'Peroni Gran Riserva','0.4');
beer('grolsch-200',5.5,'Grolsch Weizen','0.2');beer('grolsch-400',8.5,'Grolsch Weizen','0.4');
beer('nastro-zero',5,'Peroni Nastro Azzurro 0.0','',false);beer('raffo',5,'Raffo Ricetta Originale','',false);
beer('peroni-cruda',5.5,'Peroni Cruda','',false);beer('corona',6,'Corona','',false);
beer('guinness',6.5,'Guinness','',false);beer('peroni-gluten-free',6,'Peroni Gluten Free','',false);
// Página 2: lista completa de amari a precio común, seguida de Jefferson y grappe.
[
 ['limoncello','Limoncello'],['amaro-capo','Amaro del Capo'],['baileys','Baileys'],['montenegro','Montenegro'],
 ['jagermeister','Jagermeister'],['disaronno','Amaretto Disaronno'],['sambuca','Sambuca'],['averna','Averna'],
 ['unicum','Unicum'],['fernet','Fernet Branca'],['mirto','Mirto'],['genziana','Genziana'],['nerone','Nerone'],['anima-nera','Anima Nera']
].forEach(([id,name])=>drink(id,4.5,name,'',id==='baileys'?'7':'',[],2));
drink('jefferson',6.5,'Amaro Jefferson','','',[],2);
drink('grappa-bianca',6.5,'Grappa Poli Bianca','','',[],2);
drink('grappa-barricata',7.5,'Grappa Poli Barricata','','',[],2);
drink('water',2,{it:'Acqua a catinelle · 1 L',en:'Water by the jug · 1 L',es:'Agua en jarra · 1 L'},{it:'Trattata e/o gassata in caraffa',en:'Treated still and/or sparkling water in a jug',es:'Agua tratada sin gas y/o con gas en jarra'},'',[],2);

// Recorrido por columnas del PDF: izquierda, derecha y cierre de la página de comida.
const drinksGroup=(key,id,ids)=>({key,id,indexes:ids.map(product=>{const index=BEVERAGE_CATALOG.findIndex(entry=>entry.id===product);if(index<0)throw new Error('Beverage ID missing: '+product);return index;})});
window.BEVERAGE_GROUPS=[
 drinksGroup('whiteGlass','bianchi-calice',['pecorino-glass','chardonnay-glass','rose-glass','pinot-glass','prosecco-glass','spritz']),
 drinksGroup('whiteBottle','bianchi-bottiglia',['pecorino-bottle','chardonnay-bottle','passerina-bottle','frascati-bottle','pinot-bottle','rose-bottle','gewurztraminer-bottle','moscato-banfi-bottle']),
 drinksGroup('topWhite','bianchi-selezione',['bramito-bottle','jermann-bottle','planeta-bottle']),
 drinksGroup('sparkling','bollicine',['prosecco-bottle','ferrari-bottle','franciacorta-bottle']),
 drinksGroup('soft','bibite',['chinotto','sprite','fanta','cedrata','tonic','schweppes-lemon','coca-cola','coca-cola-zero','iced-tea','ginger-ale','ginger-beer','red-bull','crodino','ace','orange','pineapple','peach','green-apple']),
 drinksGroup('sweet','vini-dolci',['passito-glass','moscato-sweet-glass']),
 drinksGroup('coffee','caffe',['espresso','espresso-corretto','caffellatte','americano','cappuccino','decaf','barley','hot-tea']),
 drinksGroup('redGlass','rossi-calice',['montepulciano-glass','merlot-glass','lambrusco-glass','chianti-glass','ripasso-glass','spritz']),
 drinksGroup('redBottle','rossi-bottiglia',['montepulciano-bottle','syrah-bottle','merlot-bottle','nero-troia-bottle','chianti-bottle','cesanese-bottle','lambrusco-bottle','ripasso-bottle']),
 drinksGroup('topRed','rossi-selezione',['amarone-bottle','bruciato-bottle','barolo-bottle','brunello-bottle','tignanello-bottle']),
 drinksGroup('aperitif','aperitivi',['spritz']),
 drinksGroup('draft','birre',['nastro-200','nastro-400','gran-riserva-200','gran-riserva-400','grolsch-200','grolsch-400']),
 drinksGroup('bottledBeer','birre-bottiglia',['nastro-zero','raffo','peroni-cruda','corona','guinness','peroni-gluten-free']),
 drinksGroup('spirits','amari',['limoncello','amaro-capo','baileys','montenegro','jagermeister','disaronno','sambuca','averna','unicum','fernet','mirto','genziana','nerone','anima-nera','jefferson','grappa-bianca','grappa-barricata']),
 drinksGroup('wine','vini',['pecorino-bottle','pecorino-glass','montepulciano-bottle','montepulciano-glass']),
 drinksGroup('water','acqua',['water'])
];
const allDrinks=MENU.find(category=>category.id==='bevande');
allDrinks.note='';allDrinks.items=BEVERAGE_CATALOG.map(entry=>[entry.names.it,entry.price,entry.descriptions.it,entry.allergens,false,entry.id]);
MENU_SYMBOLS.bevande=BEVERAGE_CATALOG.map(entry=>entry.symbols);
const drinkCategoryNames={
 it:{whiteGlass:'Bianchi al bicchiere',whiteBottle:'Bianchi in bottiglia',topWhite:'Selezione di bianchi',sparkling:'Bollicine',soft:'Bibite e succhi',sweet:'Vini dolci al bicchiere',coffee:'Caffè e tè',redGlass:'Rossi al bicchiere',redBottle:'Rossi in bottiglia',topRed:'Selezione di rossi',aperitif:'Aperitivi',draft:'Birre alla spina',bottledBeer:'Birre in bottiglia',spirits:'Amari e grappe',wine:'Vino della casa',water:'Acqua'},
 en:{whiteGlass:'White wine by the glass',whiteBottle:'Bottled white wine',topWhite:'White wine selection',sparkling:'Sparkling wine',soft:'Soft drinks and juices',sweet:'Sweet wine by the glass',coffee:'Coffee and tea',redGlass:'Red wine by the glass',redBottle:'Bottled red wine',topRed:'Red wine selection',aperitif:'Aperitifs',draft:'Draught beers',bottledBeer:'Bottled beers',spirits:'Bitters and grappa',wine:'House wine',water:'Water'},
 es:{whiteGlass:'Blancos por copa',whiteBottle:'Blancos en botella',topWhite:'Selección de blancos',sparkling:'Espumosos',soft:'Refrescos y zumos',sweet:'Vinos dulces por copa',coffee:'Café y té',redGlass:'Tintos por copa',redBottle:'Tintos en botella',topRed:'Selección de tintos',aperitif:'Aperitivos',draft:'Cervezas de barril',bottledBeer:'Cervezas en botella',spirits:'Digestivos y grappa',wine:'Vino de la casa',water:'Agua'}
};
for(const lang of ['it','en','es']){
 I18N[lang].drinkCategories=drinkCategoryNames[lang];
 if(lang!=='it')I18N[lang].categories.bevande={name:lang==='en'?'Drinks and wine':'Bebidas y vinos',note:'',items:BEVERAGE_CATALOG.map(entry=>[entry.names[lang],entry.descriptions[lang]])};
}
I18N.it.ui.scope='Carta completa di cibo e bevande. Fonte: menù INV2026.';
I18N.en.ui.scope='Complete food and drinks menu. Source: INV2026 menu.';
I18N.es.ui.scope='Carta completa de comida y bebidas. Fuente: carta INV2026.';
Object.assign(I18N.it.ui,{searchLabel:'Cerca un piatto o una bevanda',placeholder:'Carbonara, Prosecco…'});
Object.assign(I18N.en.ui,{searchLabel:'Search for food or a drink',placeholder:'Carbonara, Prosecco…'});
Object.assign(I18N.es.ui,{searchLabel:'Busca un plato o una bebida',placeholder:'Carbonara, Prosecco…'});
// El PDF repite la focaccia tras las ensaladas. Se conserva también esa ubicación.
const focaccia=MENU.find(category=>category.id==='antipasti').items[8];
let foodSequence=0;
MENU.filter(category=>category.id!=='bevande').forEach(category=>category.items.forEach(item=>{if(!item[5])item[5]='food-'+String(++foodSequence).padStart(3,'0');}));
MENU.find(category=>category.id==='insalatone').items.push(focaccia);
MENU_SYMBOLS.insalatone.push(['foglia']);
for(const lang of ['en','es'])I18N[lang].categories.insalatone.items.push(I18N[lang].categories.antipasti.items[8]);

// Avisos completos de las dos caras del PDF, además de la leyenda de 14 alérgenos.
I18N.it.notes[0]='Ai sensi del Reg. (UE) n. 1169/2011, si avvisa la gentile clientela che negli alimenti e nelle bevande preparati in questo esercizio possono essere contenuti ingredienti o coadiuvanti considerati allergeni. Le informazioni circa la presenza di sostanze o prodotti che provocano allergie o intolleranze sono disponibili rivolgendosi al personale in servizio e sul menù.';
I18N.en.notes[0]='Under Regulation (EU) No. 1169/2011, customers are advised that food and drinks prepared here may contain ingredients or processing aids considered allergens. Information about substances or products that cause allergies or intolerances is available from our staff and in the menu.';
I18N.es.notes[0]='De conformidad con el Reglamento (UE) n.º 1169/2011, se informa de que los alimentos y bebidas preparados en este establecimiento pueden contener ingredientes o coadyuvantes considerados alérgenos. La información sobre sustancias o productos que causan alergias o intolerancias está disponible a través del personal y en la carta.';
I18N.it.foodPassion='Il cibo è una nostra grande passione: i nostri pasti sono realizzati con ingredienti di elevata qualità e facciamo del nostro meglio per soddisfare le esigenze dei clienti con allergie alimentari. Tuttavia, non possiamo garantire un ambiente completamente privo di allergeni e tracce di alcuni ingredienti potrebbero essere presenti nei nostri piatti.';
I18N.en.foodPassion='Food is a great passion of ours: our meals are made with high-quality ingredients and we do our best to meet the needs of customers with food allergies. However, we cannot guarantee an entirely allergen-free environment and traces of some ingredients may be present in our dishes.';
I18N.es.foodPassion='La comida es una de nuestras grandes pasiones: preparamos nuestros platos con ingredientes de alta calidad y hacemos lo posible por atender las necesidades de los clientes con alergias alimentarias. Sin embargo, no podemos garantizar un entorno completamente libre de alérgenos y puede haber trazas de algunos ingredientes en nuestros platos.';
I18N.it.notes[3]='Si avvisa la gentile clientela che, in base alla disponibilità del mercato, i prodotti contrassegnati con il simbolo * possono essere surgelati all’origine oppure sottoposti a trattamento di bonifica preventiva mediante congelamento, in conformità al Reg. CE 853/2004, Allegato III, Sezione VIII, Capitolo III, lettera D, punto 1.';
I18N.en.notes[3]='Depending on market availability, products marked with * may be frozen at source or undergo preventive treatment by freezing, in accordance with Regulation (EC) 853/2004, Annex III, Section VIII, Chapter III, point D(1).';
I18N.es.notes[3]='Según la disponibilidad del mercado, los productos marcados con * pueden estar ultracongelados en origen o someterse a un tratamiento preventivo mediante congelación, de conformidad con el Reglamento (CE) 853/2004, anexo III, sección VIII, capítulo III, letra D, punto 1.';
I18N.it.allergyReminder='I nostri clienti e le loro allergie sono le più speciali del mondo: specificare sempre e chiedere il menù allergeni.';
I18N.en.allergyReminder='Our customers and their allergies are the most special in the world: always tell us and ask for the allergen menu.';
I18N.es.allergyReminder='Nuestros clientes y sus alergias son los más especiales del mundo: comunícalas siempre y solicita la carta de alérgenos.';

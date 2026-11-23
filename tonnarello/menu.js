// Transcripción para boceto: Tonnarello Original, INV2026. Importes en EUR.
// Las bebidas son una selección. El PDF enlazado contiene la carta completa.
window.MENU = [
{id:'antipasti',name:'Antipasti',note:'',items:[
['Carciofo alla Giudia',9.5,'Secondo disponibilità di stagione','1-4-14'],
['Le nostre patate Cacio e Pepe',8.5,'','1-4-7-14',true],
['Tris di Bruschette',10.5,'Pomodoro, Mozzarella e Prosciutto Crudo, Mozzarella e Alici','1-4-6-7'],
['Cestino di Supplì Mignon',10.5,'All’Amatriciana, al Ragù, Cacio e Pepe e Crocchetta di patate (8 pz tot)','1-4-7-9-14'],
['Cartoccio di Calamari dorati',18.5,'','1-4-14',true],
['Tagliere Genuino di Salumi e Formaggi',22,'','7'],
['Caprese',13.5,'Mozzarella di latte di Bufala e Pomodoro','7'],
['Prosciutto Crudo e Mozzarella di latte di bufala',14.5,'','7'],
['Focaccia calda',6.5,'Olio E.V.O. e Rosmarino','1-6'],
['Pane',3,'','1-6'],['Salsa Marinara',3,'Pomodoro, aglio e origano','']
]},
{id:'primi',name:'Primi',note:'- Tutte le nostre Paste vengono servite con Grana Padano Dop o Pecorino secondo Tradizione e Tanto tanto Amore.',featured:true,items:[
['Tonnarello Cacio e Pepe',12,'','1-3-7'],
['Tonnarello Carbonara',13.5,'','1-3-7'],
['Tonnarello “Nonna Nadia”',13,'Melanzane, olive, capperi e pomodorini','1-3-7-9'],
['Tonnarello al sugo di Polpette',16.5,'','1-3-7-8-9'],
['Tonnarello all’Amatriciana',13,'','1-3-7-9'],
['Tonnarello Gricia',12.5,'','1-3-7'],
['Rigatoni al Pesto con Pinoli e pomodorini',12.5,'','1-3-7-8'],
['Lasagna Ragù',14,'Provola e Grana Padano Dop','1-3-7-9',true]
]},
{id:'polpette',name:'Polpette per Tutti',note:'Ogni piatto è accompagnato da cicoria ripassata (aglio, peperoncino) e patate al forno.',featured:true,items:[
['Polpette alla Vaccinara',18.5,'','1-3-4-7-9-14'],
['Polpette Cacio e Pepe',16.5,'Manzo','1-3-4-7-9-14'],
['Polpette al Sugo di Mamma',16.5,'','1-3-7-8-9'],
['Polpette di Baccalà',16,'Con Salsa Marinara','1-3-4-7-14',true],
['Polpette di Melanzane e Patate',15.5,'','1-3-4-7-14']
]},
{id:'secondi',name:'Secondi',note:'con CONTORNO',items:[
['Saltimbocca alla Romana',18.5,'Con purè di patate','1-3-7'],
['Abbacchio al forno',22.5,'Con patate',''],
['Coda alla Vaccinara',18.5,'Con purè di patate','7-9'],
['Pollo alla Romana',16.5,'Con peperoni, patate al forno e pomodoro','9'],
['Tagliata di Manzo',22.5,'Rucola, Grana e Pomodorini','3-7'],
['Cotoletta Gigante Panata',18.5,'Con * patate fritte','1-3-4-14'],
['Straccetti al Vino',19.5,'Rucola e Grana con patate al forno','1-3-7-12']
]},
{id:'contorni',name:'Contorni',note:'',items:[
['Cicoria ripassata',6,'Aglio, peperoncino',''],['Insalata con Pomodori',6,'',''],
['Patate al forno',6,'',''],['Patate fritte',6.5,'','1-4-14',true],['Purè di patate',6,'','3-7']
]},
{id:'pinse',name:'Pinse',note:'Leggera e Saporita',items:[
['Margherita',11.5,'Pomodoro, Mozzarella e Basilico','1-6-7'],
['Funghi',12.5,'Pomodoro, Mozzarella e Funghi','1-6-7'],
['Cacio e Pepe',12,'Mozzarella, Cacio e Pepe','1-6-7'],
['Contadina',14.5,'Pomodoro, Mozzarella, Zucchine, Melanzane e Peperoni','1-6-7'],
['Napoli',12.5,'Pomodoro, Mozzarella, Alici e Origano','1-4-6-7'],
['Parma',15.5,'Pomodoro, Mozzarella e Prosciutto Crudo','1-6-7'],
['Quattro Formaggi Bianca',13.5,'Formaggio erborinato, Mozzarella, Provola, Brie','1-6-7'],
['Diavola',13,'Pomodoro, Mozzarella e Salame piccante','1-6-7'],
['Capricciosa',16,'Pomodoro, Mozzarella, Prosciutto Crudo, Uovo, Olive, Carciofini e Funghi','1-3-6-7'],
['Boscaiola',13.5,'Mozzarella, Funghi e Salsiccia','1-6-7'],
['Salsiccia e Patate',15.5,'Mozzarella, Salsiccia, Patate al forno e Rosmarino','1-6-7'],
['Tonno',15,'Pomodoro, Mozzarella, Tonno, Cipolla e Capperi','1-4-6-7'],
['Rustica',14,'Pomodoro, Mozzarella, Salsiccia e Cicoria ripassata','1-6-7'],
['Bufalina “base bianca”',16.5,'Pomodorini freschi, Mozzarella, Mozzarella di latte di Bufala, Basilico','1-6-7'],
['Salmone',15,'Mozzarella, Salmone affumicato e Rucola','1-4-6-7'],
['Crostino',14,'Mozzarella, Prosciutto Cotto, Olio Evo','1-6-7']
]},
{id:'insalatone',name:'Insalatone',note:'',items:[
['Trastevere',14,'Misticanza, Mozzarella di latte di Bufala, Pomodori, Olive, Mais, Zucchine','7'],
['Borgo',14.5,'Rucola, salmone affumicato, feta, agrumi, noci','4-7-8'],
['Testaccio',13.5,'Rucola, bresaola, grana, olive, melanzane','3-7'],
['Garbatella',13.5,'Misticanza, tonno, mais, uovo sodo, olive, pomodori, carote','3-4']
]},
{id:'dolci',name:'Dolci',note:'',items:[
['Tiramisù espresso “Tonnarello”',7.5,'','1-3-7-8',true],
['Cheesecake ai frutti di bosco',7,'','1-3-6-7-8',true],
['Cheesecake Nutella',7,'','1-3-6-7-8',true],
['Pannacotta con le Fragole',6.5,'','7'],
['Salame di Cioccolato',7,'Fatto in casa con Panna','1-3-6-7-8',true],
['Tortino al cioccolato con cuore caldo',7,'','1-3-6-7',true],
['Torta di mele calda',7.5,'Con gelato alla crema','1-3-7',true],
['Gelato alla Crema o al cioccolato',7.5,'Affogato al caffè','3-7-8',true]
]},
{id:'bevande',name:'Bevande e vini',note:'Una selezione per questo bozzetto. Consulta il PDF per la carta completa.',items:[
['Acqua a catinelle · 1 Lt',2,'Trattata e/o gassata in caraffa',''],
['Spritz l’Aperitivo',8.5,'','12'],
['Pecorino BIO della casa',5.5,'Bianco al bicchiere · Abruzzo','12'],
['Montepulciano BIO della casa',6,'Rosso al bicchiere · Abruzzo','12'],
['Pecorino BIO della casa · 0,75 L',16.5,'Abruzzo · 13%','12'],
['Montepulciano BIO della casa · 0,75 L',16.5,'Abruzzo · 13,5%','12'],
['Peroni Nastro Azzurro · 0,2 L',5,'Alla spina','1'],
['Peroni Nastro Azzurro · 0,4 L',8,'Alla spina','1'],
['Espresso',2.5,'',''],['Cappuccino',4.5,'','7'],
['Amari',4.5,'Vedi la selezione nel PDF. Baileys: allergene 7.',''],
['Amaro Jefferson',6.5,'',''],['Grappa Poli Bianca',6.5,'',''],['Grappa Poli Barricata',7.5,'','']
]}
];

// Símbolos visuales contrastados con la cara gastronómica del PDF INV2026.
// Se conservan las combinaciones originales; no se deducen de los alérgenos.
window.MENU_SYMBOLS = {
 antipasti:[['foglia','carciofo'],['foglia'],['pesce','suino'],['suino','bovino'],['calamaro'],['bovino','suino'],['foglia'],['suino'],['foglia'],['foglia'],['foglia']],
 primi:[['foglia'],['suino'],['foglia'],['suino','bovino'],['suino'],['suino'],['foglia'],['bovino']],
 polpette:[['bovino'],['bovino'],['suino','bovino'],['pesce'],['foglia']],
 secondi:[['suino'],['agnello'],['bovino'],['pollo'],['bovino'],['carne'],['bovino']],
 contorni:[['foglia'],['foglia'],['foglia'],['foglia'],['foglia']],
 pinse:[['foglia'],['foglia'],['foglia'],['foglia'],['pesce'],['suino'],['foglia'],['suino'],['suino'],['suino'],['suino'],['pesce'],['suino'],['foglia'],['pesce'],['suino']],
 insalatone:[['foglia'],['pesce'],['bovino'],['pesce']],
 bevande:[[],[],['foglia'],['foglia'],['foglia'],['foglia'],[],[],[],[],[],[],[],[]]
};
window.SYMBOL_LABELS={foglia:'Foglia',bovino:'Bovino',suino:'Suino',pesce:'Pesce',pollo:'Pollo',agnello:'Agnello',carne:'Carne',calamaro:'Calamaro',carciofo:'Carciofo'};

/* Actualización facilitada por el usuario en las tres imágenes de avisos y menús.
   Sustituye los dos menús anteriores; las referencias a la carta permanecen. */
window.PATIO_SERVICE_ES={minimum:25,bread:1.70,container:0.25,bag:0.20};
const experienceGroup=window.PATIO_MENU_ES.groups.find(group=>group.id==='menus');
experienceGroup.name='Menús con flamenco';
experienceGroup.description='Tres formas de disfrutar de nuestra cocina con espectáculo flamenco incluido.';
experienceGroup.menus=[
{id:'puente-romano',name:'Menú flamenco Puente Romano',shortName:'Puente Romano',price:42,condition:'Mesa completa · Mínimo 2 personas',flamenco:true,summary:'Una mesa para compartir los clásicos del Patio, con el flamenco como compañía.',included:'Pan y una bebida por persona: agua, refresco, cerveza o copa de vino de la casa.',courses:[
['Trampantojo Ferrero Rocher de foie','Bombón de foie con crujiente de frutos secos y delicado acabado dorado.'],
['Ensaladilla Patio de la Judería','Con puerro, jamón y un suave toque de mostaza.'],
['Salmorejo cordobés','Elaborado con tomate, aceite de oliva virgen extra y jamón.'],
['Croquetas caseras','Cremosas por dentro y crujientes por fuera.'],
['Medallón de solomillo ibérico de cerdo al Pedro Ximénez','Acompañado de guarnición de temporada y salsa elaborada con vino dulce de nuestra bodega familiar.'],
['Postre de la casa','']
]},
{id:'paseo-cordoba',name:'Menú Paseo por Córdoba',shortName:'Paseo por Córdoba',price:46,condition:'Mesa completa · Mínimo 2 personas',flamenco:true,summary:'Un recorrido por algunos de los sabores que definen la cocina cordobesa y andaluza.',included:'Pan y una bebida por persona: agua, refresco, cerveza o copa de vino de la casa.',courses:[
['Berenjenas sefardíes fritas con miel de caña','Crujientes y acompañadas de uno de los contrastes más representativos de nuestra cocina.'],
['Salmorejo cordobés','Con tomate, aceite de oliva virgen extra y jamón.'],
['Rollitos mozárabes','Rellenos de pollo, almendras y especias, acompañados de una salsa suave.']
],choices:{title:'Plato principal a elegir',items:[
['Carrillada de ternera sobre parmentier de patata','Cocinada lentamente hasta conseguir una textura tierna y melosa.'],
['Bacalao confitado con aromas cítricos de naranja','Cocinado a baja temperatura y acompañado de una guarnición de temporada.']
]},desserts:[
['Pastel cordobés','Hojaldre relleno de cabello de ángel y terminado con azúcar y canela.'],
['Degustación de Pedro Ximénez','Vino dulce local Marqués de la Vega, medalla de oro, procedente de nuestro viñedo y bodega familiar.']
]},
{id:'historia-cordoba',name:'Menú degustación Historia y sabores de Córdoba',shortName:'Historia y sabores de Córdoba',price:50,condition:'Menú degustación',flamenco:true,summary:'Un recorrido por sabores, culturas y tradiciones que han dejado su huella en la cocina cordobesa.',included:'Pan y una bebida por persona: agua, refresco, cerveza o copa de vino de la casa.',courses:[
['Trampantojo Ferrero Rocher de foie','Bombón de foie con crujiente de frutos secos y delicado acabado dorado.'],
['Lomo de sardina ahumada sobre pan carasau','Sardina de sabor intenso, contrapunto fresco y crujiente de pan carasau.'],
['Salmorejo tradicional con jamón','Preparado con tomate, aceite de oliva virgen extra y jamón.'],
['Berenjena frita con miel de caña','Un encuentro entre la textura crujiente de la berenjena y el dulzor profundo de la miel.'],
['Rabo de toro cocinado lentamente','Deshuesado y acompañado de parmentier de patata y su propio jugo.'],
['Pastel cordobés','Hojaldre relleno de cabello de ángel, azúcar y canela.'],
['Café o infusión',''],
['Degustación de Pedro Ximénez','Vino dulce local Marqués de la Vega, medalla de oro, procedente de nuestro viñedo y bodega familiar.']
]}
];

# Cómo cambiar tu carta desde Google Sheets

## Primera vez (lo hacemos nosotros)
1. Subir `planilla-carta.csv` a Google Drive y abrirlo con Google Sheets.
2. Archivo → Compartir → **Publicar en la web** → elegir la hoja → formato **CSV** → Publicar.
3. Copiar el link y pegarlo en `app.js`, línea 4: `const PLANILLA_CSV="...link...";`

## Lo que podés cambiar vos
| Columna | Qué hace |
|---|---|
| Nombre ES / Nombre EN | Nombre del plato en español e inglés |
| Tamaño | Ej: 300 ml, 250 g |
| Precio | Solo el número, sin símbolo |
| Disponible (SI/NO) | Poné **NO** y el plato desaparece de la carta. Volvé a **SI** para mostrarlo |
| Descripción ES / EN | Texto debajo del nombre |

Los cambios aparecen en la carta en 1 a 5 minutos.

## Lo que NO hay que tocar
- La columna **ID**: es la que une cada fila con su foto.
- No borres filas: si algo no se vende más, poné **NO**.

## Lo que hacemos nosotros (plan Mantenimiento)
Fotos nuevas, platos o categorías nuevas, promociones y cambios de diseño. Escribinos por WhatsApp.

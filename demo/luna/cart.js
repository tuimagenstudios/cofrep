import { products } from './menu.js';
export function normalizeCart(value) {
  const result = {};
  if (!value || typeof value !== 'object') return result;
  for (const p of products) if (Number.isInteger(value[p.id]) && value[p.id] > 0) result[p.id] = Math.min(value[p.id], 99);
  return result;
}
export function changeQuantity(cart, id, delta) {
  const next = normalizeCart(cart);
  if (!products.some(p => p.id === id)) return next;
  const quantity = Math.max(0, Math.min(99, (next[id] || 0) + delta));
  if (quantity) next[id] = quantity; else delete next[id];
  return next;
}
export function summarize(cart) {
  const safe = normalizeCart(cart);
  const items = products.filter(p => safe[p.id]).map(p => ({...p, quantity:safe[p.id]}));
  return {items,count:items.reduce((n,p)=>n+p.quantity,0),total:items.reduce((n,p)=>n+p.quantity*p.price,0)};
}
export function orderMessage(cart, details, money) {
  const {items,total} = summarize(cart);
  return [`Hola Luna ☾, quisiera consultar este pedido:`, ...items.map(p=>`${p.quantity} × ${p.name} — ${money(p.price*p.quantity)}`), `Total: ${money(total)}`, `Nombre: ${details.name.trim()}`, `Entrega: ${details.delivery === 'delivery' ? 'A domicilio' : 'Retiro en local'}`, details.delivery === 'delivery' ? `Dirección: ${details.address.trim()}` : '',details.notes.trim() ? `Indicaciones: ${details.notes.trim()}` : ''].filter(Boolean).join('\n');
}

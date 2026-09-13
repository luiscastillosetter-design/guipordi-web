"use client";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site.config";

export default function Cart() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const generateWhatsAppMessage = () => {
    let text = "¡Hola! Quiero procesar el siguiente pedido:\n\n";
    cartItems.forEach((item) => {
      text += `- ${item.quantity}x ${item.name} - $${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
    });
    text += `\n*Total estimado: $${cartTotal.toFixed(2)}*`;
    
    // Aquí está la magia: Tomamos tu enlace de WhatsApp y le cortamos 
    // cualquier texto viejo que traiga desde siteConfig usando split('?')[0]
    const baseUrl = siteConfig.hero.whatsappLink.split('?')[0];
    
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-cyan-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-[#030712]">
            {totalItems}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#09090b] h-full shadow-2xl flex flex-col border-l border-white/10 animate-slide-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  <p className="text-sm tracking-widest uppercase font-bold">Carrito vacío</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5 relative">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-black/50 p-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-sm font-bold text-white line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-cyan-400 font-mono font-bold">${item.price}</span>
                        <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1 border border-white/10">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-zinc-400 hover:text-white px-2 font-bold">-</button>
                          <span className="text-xs font-bold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-zinc-400 hover:text-white px-2 font-bold">+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-zinc-900/80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Total</span>
                  <span className="text-3xl font-black text-white font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <a href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-4 rounded-xl font-black tracking-[0.2em] uppercase text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] transition-transform">
                  Procesar Pedido
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
"use client";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site.config";

export default function Cart() {
  const { cart, removeFromCart, total, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) {
    return (
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-110 transition flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </button>
    );
  }

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    let message = `¡Hola! Quiero procesar el siguiente pedido:\n\n`;
    cart.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} ($${item.price})\n`;
    });
    message += `\n*Total estimado: $${total.toFixed(2).replace(".", ",")}*\n\n¿Me indicas los pasos para el pago y envío?`;

    const cleanLink = siteConfig.hero.whatsappLink.split('wa.me/')[1] || siteConfig.hero.whatsappLink;
    const whatsappUrl = `https://wa.me/${cleanLink}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-white/10">
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900">
          <h2 className="text-xl font-black tracking-wider text-cyan-400">TU CARRITO</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-zinc-800 rounded-lg p-1" 
                  onError={(e) => { e.currentTarget.src = "/images/logo.jpg"; }} 
                />
                <div className="flex-1">
                  <h3 className="text-sm font-bold line-clamp-2">{item.name}</h3>
                  <p className="text-cyan-400 font-mono text-sm">${item.price}</p>
                  <p className="text-xs text-zinc-500">Cant: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-zinc-900 border-t border-white/10 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Estimado:</span>
            <span className="text-cyan-400 font-mono">${total.toFixed(2).replace(".", ",")}</span>
          </div>
          <button 
            onClick={handleWhatsAppCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black tracking-widest rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            ENVIAR PEDIDO POR WHATSAPP
          </button>
        </div>
      </div>
    </div>
  );
}
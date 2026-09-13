import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

// Para evitar que Vercel guarde esto en caché y Esther lea datos viejos
export const revalidate = 0; 

export async function GET() {
  try {
    // Extraemos todo el catálogo limpio para la IA
    const query = `*[_type == "product"] {
      "id": id.current,
      name,
      "category": category->title,
      description,
      price,
      "imageUrl": image.asset->url
    }`;
    
    const products = await client.fetch(query);
    
    // Devolvemos un JSON estructurado para que lo consuma Python, n8n o tu agente
    return NextResponse.json({
      success: true,
      agentInfo: "Base de conocimientos activa para Esther AI",
      totalProducts: products.length,
      catalog: products
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error conectando con la base de datos" }, { status: 500 });
  }
}
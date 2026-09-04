import json
import os
import openpyxl
from openpyxl_image_loader import SheetImageLoader
import difflib

def limpiar_texto(texto):
    if not texto: return ""
    return " ".join(str(texto).split()).strip().upper()

print("1. Cargando catálogo JSON...")
ruta_json = 'src/data/products.json' 

try:
    with open(ruta_json, 'r', encoding='utf-8') as f:
        productos_json = json.load(f)
except Exception as e:
    print(f"Error cargando JSON: {e}")
    exit()

mapa_productos = { limpiar_texto(prod['name']): prod['id'] for prod in productos_json }
# ORDEN MÁGICO: Ordenamos de mayor a menor longitud para que la búsqueda por inclusión no se confunda
nombres_json = sorted(list(mapa_productos.keys()), key=len, reverse=True) 

carpeta_destino = 'public/images/products'
os.makedirs(carpeta_destino, exist_ok=True)

print("2. Leyendo Excel y cruzando datos (Nivel 3 de Inteligencia)...")
try:
    pxl_doc = openpyxl.load_workbook('LISTA VENDEDOR (1).xlsx', data_only=True)
    sheet = pxl_doc.active
    image_loader = SheetImageLoader(sheet)
except Exception as e:
    print(f"Error leyendo el Excel: {e}")
    exit()

procesadas_exactas = 0
procesadas_similares = 0
procesadas_incluidas = 0
no_encontradas = []

for row in range(2, sheet.max_row + 1):
    celda_imagen = f'A{row}'
    celda_nombre = f'B{row}'
    
    nombre_excel = sheet[celda_nombre].value
    
    if nombre_excel and image_loader.image_in(celda_imagen):
        nombre_limpio = limpiar_texto(nombre_excel)
        id_producto = None
        
        # Nivel 1: Intento Exacto
        if nombre_limpio in mapa_productos:
            id_producto = mapa_productos[nombre_limpio]
            procesadas_exactas += 1
        else:
            # Nivel 2: Intento por Inclusión (El nombre del JSON está DENTRO del nombre largo del Excel)
            encontrado_por_inclusion = False
            for nj in nombres_json:
                # Exigimos al menos 10 caracteres para no cruzar palabras sueltas por error
                if len(nj) > 10 and (nj in nombre_limpio):
                    id_producto = mapa_productos[nj]
                    procesadas_incluidas += 1
                    encontrado_por_inclusion = True
                    print(f"🔍 Rescatada (Inclusión): '{nombre_limpio[:40]}...' cruzada con '{nj[:40]}...'")
                    break
            
            # Nivel 3: Intento Inteligente (Similitud del 80%)
            if not encontrado_por_inclusion:
                coincidencias = difflib.get_close_matches(nombre_limpio, nombres_json, n=1, cutoff=0.80)
                if coincidencias:
                    mejor_coincidencia = coincidencias[0]
                    id_producto = mapa_productos[mejor_coincidencia]
                    procesadas_similares += 1
                    print(f"🪄 Rescatada (Similitud): '{nombre_limpio[:40]}...' cruzada con '{mejor_coincidencia[:40]}...'")
                else:
                    no_encontradas.append(nombre_limpio)
        
        # Si logramos emparejarlo, guardamos la imagen sobrescribiendo si ya existía
        if id_producto:
            for char in '<>:"|?*':
                id_producto = id_producto.replace(char, '_')
                
            imagen = image_loader.get(celda_imagen)
            
            if imagen.mode != 'RGB':
                imagen = imagen.convert('RGB')
                
            ruta_guardado = os.path.join(carpeta_destino, f"{id_producto}.jpg")
            os.makedirs(os.path.dirname(ruta_guardado), exist_ok=True)
            
            try:
                imagen.save(ruta_guardado)
            except Exception as e:
                pass

# Actualizar el archivo de huérfanos con los que de verdad sobren
if no_encontradas:
    with open("productos_huerfanos.txt", "w", encoding="utf-8") as f:
        for n in no_encontradas:
            f.write(f"{n}\n")

print(f"\n🚀 ¡PROCESO COMPLETADO!")
print(f"✅ Exactas: {procesadas_exactas}")
print(f"🔍 Por Inclusión: {procesadas_incluidas}")
print(f"🪄 Por Similitud: {procesadas_similares}")
print(f"⚠️ Huérfanas restantes: {len(no_encontradas)}")
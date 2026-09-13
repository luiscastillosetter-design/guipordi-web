import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categorías',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la Categoría',
      type: 'string',
      description: 'Ejemplo: INVERSOR, MINI UPS, BATERIAS',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen de Fondo (Horizontal 16:9)',
      type: 'image',
      options: { hotspot: true },
      description: 'Esta foto se usará como fondo de las tarjetas gigantes en el catálogo.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
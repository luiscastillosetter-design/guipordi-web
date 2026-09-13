import { defineField, defineType } from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Ajustes de la Tienda',
  type: 'document',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Nombre de la Marca',
      type: 'string',
      description: 'Ejemplo: Guipordi',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Principal (PNG sin fondo)',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappLink',
      title: 'Enlace de WhatsApp',
      type: 'string',
      description: 'Tu enlace directo. Ejemplo: https://wa.me/1234567890',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título Principal (Inicio)',
      type: 'string',
      description: 'El texto gigante de la primera pantalla.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo (Inicio)',
      type: 'text',
    }),
  ],
})
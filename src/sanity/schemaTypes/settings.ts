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
      description: 'Tu enlace directo. Ejemplo: https://wa.me/58...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono de Contacto (Llamadas)',
      type: 'string',
      description: 'Ejemplo: +58 412-1234567',
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico de Contacto',
      type: 'string',
      description: 'Ejemplo: ventas@guipordi.com',
    }),
    defineField({
      name: 'address',
      title: 'Dirección Física / Local',
      type: 'string',
      description: 'Ejemplo: Av. Francisco de Miranda, Caracas, Venezuela',
    }),
    defineField({
      name: 'instagram',
      title: 'Enlace de Instagram',
      type: 'string',
    }),
    defineField({
      name: 'tiktok',
      title: 'Enlace de TikTok',
      type: 'string',
    }),
    defineField({
      name: 'facebook',
      title: 'Enlace de Facebook',
      type: 'string',
    }),
    defineField({
      name: 'linkedin',
      title: 'Enlace de LinkedIn',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título Principal (Inicio)',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo (Inicio)',
      type: 'text',
    }),
  ],
})
import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { categoryType } from './category'
import { settingsType } from './settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType, categoryType, settingsType],
}
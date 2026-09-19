import { gallery, images } from './images'
import { hours } from './hours'
import { menu } from './menu'
import { restaurant } from './restaurant'
import type { GalleryImage, Hours, Menu, Restaurant } from './types'

/**
 * The content boundary.
 *
 * Every page reads content through these accessors and never imports the seed
 * files directly. They are async on purpose: in phase 2 the menu and the hours
 * start coming from Postgres via Drizzle, and only the bodies of these four
 * functions change. No page, no component, and no type moves.
 */

export async function getRestaurant(): Promise<Restaurant> {
  return restaurant
}

export async function getMenu(): Promise<Menu> {
  return menu
}

export async function getHours(): Promise<Hours> {
  return hours
}

export async function getGallery(): Promise<readonly GalleryImage[]> {
  return gallery
}

export { images }
export * from './types'

export type FavoriteItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  size?: string;
};

const FAVORITES_KEY = "ressential_favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
}

export function saveFavorites(favorites: FavoriteItem[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event("favorites-updated"));
}

export function isFavorite(id: string) {
  return getFavorites().some((item) => item.id === id);
}

export function toggleFavorite(item: FavoriteItem) {
  const favorites = getFavorites();

  const exists = favorites.some((favorite) => favorite.id === item.id);

  if (exists) {
    saveFavorites(favorites.filter((favorite) => favorite.id !== item.id));
    return false;
  }

  saveFavorites([...favorites, item]);
  return true;
}

export function removeFavorite(id: string) {
  saveFavorites(getFavorites().filter((item) => item.id !== id));
}
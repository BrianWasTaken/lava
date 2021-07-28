import { Item, ItemOptions, ItemAssets, ItemConfig } from 'lava/akairo';

export type BoxItemAssets = Omit<ItemAssets, 'category' | 'sellRate' | 'upgrade'>;

export type BoxItemConfig = Omit<ItemConfig, 'premium' | 'sellable'>;


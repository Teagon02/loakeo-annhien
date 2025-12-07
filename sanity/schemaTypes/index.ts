import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { cartType } from "./cartType";
import { wishlistType } from "./wishlistType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    cartType,
    wishlistType,
  ],
};

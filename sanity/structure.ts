import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  // Get all document type list items
  const defaultItems = S.documentTypeListItems();

  // Find product and order items
  const productItemIndex = defaultItems.findIndex(
    (item: any) => item.getId() === "product"
  );
  const orderItemIndex = defaultItems.findIndex(
    (item: any) => item.getId() === "order"
  );

  // Create custom product structure with categories
  const productStructure = S.listItem()
    .title("Sản phẩm")
    .id("product")
    .child(
      S.list()
        .title("Sản phẩm")
        .items([
          // Tất cả sản phẩm
          S.listItem()
            .title("📋 Tất cả sản phẩm")
            .id("product-all")
            .child(
              S.documentList()
                .title("Tất cả sản phẩm")
                .filter('_type == "product"')
                .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            ),
          S.divider(),
          // Theo danh mục
          S.listItem()
            .title("🏷️ Theo danh mục")
            .id("product-by-category")
            .child(
              S.documentTypeList("category")
                .title("Chọn danh mục")
                .child((categoryId) =>
                  S.documentList()
                    .title("Sản phẩm trong danh mục")
                    .filter('_type == "product" && references($categoryId)')
                    .params({ categoryId })
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                )
            ),
        ])
    );

  // Create custom order structure with tabs
  const orderStructure = S.listItem()
    .title("Đơn hàng")
    .id("order")
    .child(
      S.list()
        .title("Đơn hàng")
        .items([
          S.listItem()
            .title("🔄 Chờ thanh toán")
            .id("order-pending")
            .child(
              S.documentList()
                .title("Chờ thanh toán")
                .filter('_type == "order" && status == "pending"')
                .defaultOrdering([{ field: "orderDate", direction: "desc" }])
            ),
          S.listItem()
            .title("🔴 Đã thanh toán")
            .id("order-paid")
            .child(
              S.documentList()
                .title("Đã thanh toán")
                .filter('_type == "order" && status == "paid"')
                .defaultOrdering([{ field: "orderDate", direction: "desc" }])
            ),
          S.listItem()
            .title("✅ Đã gửi hàng")
            .id("order-shipped")
            .child(
              S.documentList()
                .title("Đã gửi hàng")
                .filter('_type == "order" && status == "shipped"')
                .defaultOrdering([{ field: "orderDate", direction: "desc" }])
            ),
          S.listItem()
            .title("❌ Đã hủy")
            .id("order-cancelled")
            .child(
              S.documentList()
                .title("Đã hủy")
                .filter('_type == "order" && status == "cancelled"')
                .defaultOrdering([{ field: "orderDate", direction: "desc" }])
            ),
          S.divider(),
          S.listItem()
            .title("Tất cả đơn hàng")
            .id("order-all")
            .child(
              S.documentList()
                .title("Tất cả đơn hàng")
                .filter('_type == "order"')
                .defaultOrdering([{ field: "orderDate", direction: "desc" }])
            ),
        ])
    );

  // Replace product and order items with custom structures
  if (productItemIndex !== -1) {
    defaultItems[productItemIndex] = productStructure;
  } else {
    defaultItems.unshift(productStructure);
  }

  if (orderItemIndex !== -1) {
    defaultItems[orderItemIndex] = orderStructure;
  } else {
    defaultItems.unshift(orderStructure);
  }

  // Reorder items: Products and Orders first, then others
  const reorderedItems = [];

  // Add Products and Orders first
  reorderedItems.push(productStructure);
  reorderedItems.push(orderStructure);
  reorderedItems.push(S.divider());

  // Add remaining items (excluding products and orders)
  defaultItems.forEach((item: any) => {
    const itemId = item.getId();
    if (itemId !== "product" && itemId !== "order") {
      reorderedItems.push(item);
    }
  });

  return S.list().title("Quản lý cửa hàng").items(reorderedItems);
};

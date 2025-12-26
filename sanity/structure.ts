import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  // Get all document type list items
  const defaultItems = S.documentTypeListItems();

  // Find the order item and replace it with a custom structure
  const orderItemIndex = defaultItems.findIndex(
    (item: any) => item.getId() === "order"
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

  // Replace the order item with the custom structure
  if (orderItemIndex !== -1) {
    defaultItems[orderItemIndex] = orderStructure;
  } else {
    // If order type doesn't exist in default items, add it at the beginning
    defaultItems.unshift(orderStructure);
  }

  return S.list().title("Quản lý đơn hàng").items(defaultItems);
};

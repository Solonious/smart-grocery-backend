import Product from "../models/product";
import { fetchNovusProductsWithPuppeteer } from "./fetch-novus-product-puppeteer";

// Оновлення цін товарів
const UPDATE_INTERVAL_HOURS = 24; // :snowflake: Оновлюємо товари раз на добу

export const updateProductPrices = async () => {

  console.log(":arrows_counterclockwise: Оновлення цін товарів...");

  const products = await Product.find();

  for (const product of products) {
    try {
      console.log(`:mag: Оновлення: ${product.name} (${product.store})`);

      const [updatedProduct] = await fetchNovusProductsWithPuppeteer(product.name);

      if (updatedProduct) {
        await Product.findOneAndUpdate(
          { name: product.name, store: product.store },
          { price: updatedProduct.price, lastUpdated: new Date() },
          { new: true }
        );

        console.log(`:white_check_mark: Оновлено: ${product.name} → ${updatedProduct.price}₴`);
      }
    } catch (error) {
      console.error(`:x: Помилка оновлення ${product.name}:`, error);
    }
  }
  console.log(":white_check_mark: Оновлення цін завершено!");
};

// Запускаємо оновлення кожні 24 години
// setInterval(updateProductPrices, UPDATE_INTERVAL_HOURS * 60 * 60 * 1000);
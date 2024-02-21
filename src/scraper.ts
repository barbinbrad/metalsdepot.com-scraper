import playwright from "playwright";
import { partsTable } from "./db";
import { Categories, Product, ProductWithCategory } from "./types";

let debug = false;

(async () => {
  if (!debug) {
    await partsTable.createTable();
    await partsTable.clearTable();
  }

  const browser = await playwright["chromium"].launch({
    headless: debug ? false : true,
  });

  const context = await browser.newContext();

  const page = await context.newPage();
  /**
   * First get all the categories
   */
  console.log("🚀 Scraping metalsdepot.com...");
  await page.goto("https://www.metalsdepot.com/");

  const categoryIndex: Categories = await page.$$eval(
    ".category_list_nav_column",
    (_categories) => {
      const data: Categories = {};
      _categories.forEach((category) => {
        const name =
          category.querySelector<HTMLAnchorElement>("a.parent_name").innerText;

        const links = [
          ...category.querySelectorAll<HTMLAnchorElement>("a.sub_category"),
        ].map((link) => {
          return { name: link.innerText, url: link.href };
        });

        data[name] = links;
      });

      return data;
    }
  );

  /**
   * Now get all the products from each category
   */

  const categories = Object.keys(categoryIndex);

  for await (const category of categories) {
    const links = categoryIndex[category];

    for await (const link of links) {
      console.log(`🔬 Scraping ${link.name}...`);
      await page.goto(link.url);

      const products: Product[] = await page.$$eval(
        ".product-row",
        (_products) => {
          const data: Product[] = [];
          _products.forEach((product) => {
            const part = product.querySelector<HTMLDivElement>(
              ".product-stock-number"
            )?.innerText;

            const size = product.querySelector<HTMLDivElement>(".product-size");

            let description, material;
            if (size) {
              [description, material] = size.innerText.split("\n");
            }

            const weight = product.querySelector<HTMLAnchorElement>(
              ".product-base-weight"
            )?.innerText;

            data.push({
              part,
              description,
              material,
              weight,
            });
          });

          return data;
        }
      );

      const productsWithCategories: ProductWithCategory[] = products
        .filter((product) => product.part !== null)
        .map((product) => {
          return {
            ...product,
            category: category,
            subCategory: link.name,
          };
        });

      if (debug) {
        console.log(productsWithCategories);
      } else {
        for (const product of productsWithCategories) {
          partsTable.insert(
            product.category,
            product.subCategory,
            product.part,
            product.description,
            product.material,
            product.weight
          );
        }
      }
    }
  }

  console.log("✅ Done!");
  await browser.close();
})();

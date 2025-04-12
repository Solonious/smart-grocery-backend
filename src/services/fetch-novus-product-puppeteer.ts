import puppeteer from "puppeteer";

export const fetchNovusProductsWithPuppeteer = async (query: string) => {

  try {

    const browser = await puppeteer.launch({
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true, 
      args: ["--ignore-certificate-errors", "--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const url = `https://novus.zakaz.ua/uk/search/?q=${encodeURIComponent(query)}`;
    console.log(`:mag: Відкриваємо сторінку Novus: ${url}`);
  
    await page.goto(url, { waitUntil: "networkidle2" });
  
    const products = await page.evaluate(() => {
      const items: any = [];
      document.querySelectorAll(".ProductsBox__listItem").forEach((el) => {
        const name = (el.querySelector(".ProductTile__title") as HTMLElement)?.innerText.trim();
        const price = (el.querySelector(".Price__value_caption") as HTMLElement)?.innerText.trim();
        const image = (el.querySelector(".ProductTile__imageContainer img") as HTMLImageElement)?.src;

        if (name && price) {
          items.push({
            name,
            price: parseFloat(price.replace("₴", "").replace(",", ".")),
            image,
            store: "Novus",
          });
        }
      });
      return items;
    });
    console.log(`:white_check_mark: Знайдено товарів: ${products.length}`);
    await browser.close();
    return products;

  } catch (error) {
    console.error(":x: Помилка парсингу Novus:", error);
    return [];
  }
};
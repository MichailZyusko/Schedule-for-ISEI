export default async (page, selector, value) => {
  await page.select(selector, value);
  await page.waitForNavigation();
};

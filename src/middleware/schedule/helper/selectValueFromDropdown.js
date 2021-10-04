export default async (page, selector, value) => {
  try {
    await page.select(selector, value);
    await page.waitForNavigation();
  } catch (e) {
    console.log(e);
  }
};

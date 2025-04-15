const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
require('chromedriver');

describe('Eliminar publicación correctamente', function () {
  this.timeout(30000);
  let driver;

  const username = 'user_test2';
  const password = 'test123_#23121%_Q';
  const categoryName = 'Ciencia';
  const tituloPost = 'Descubrimiento en Marte';
  const contenidoPost = 'La NASA ha encontrado indicios de agua.';

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();

    // Registrar usuario
    await driver.get('http://localhost:3000/register');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#registerForm button[type="submit"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await (await driver.switchTo().alert()).accept();
    } catch (_) {}

    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#loginForm button[type="submit"]')).click();

    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería crear y luego eliminar una publicación', async function () {
    await driver.get('http://localhost:3000/dashboard');
    await driver.wait(until.elementLocated(By.css('h2.text-primary')), 5000);

    const categoriesBtn = await driver.findElement(By.css('a[href="/categories"]'));
    await categoriesBtn.click();
    await driver.wait(until.urlIs('http://localhost:3000/categories'), 5000);
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);

    // Crear categoría
    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(categoryName);
    await driver.findElement(By.css('#categoryForm button[type="submit"]')).click();
    await driver.sleep(1000);

    // Crear post
    await driver.get('http://localhost:3000/post/new');
    await driver.findElement(By.id('title')).sendKeys(tituloPost);
    await driver.findElement(By.id('content')).sendKeys(contenidoPost);

    await driver.wait(until.elementLocated(By.id('categorySelect')), 5000);
    const categoryOption = await driver.findElement(By.xpath(`//select[@id='categorySelect']/option[contains(., '${categoryName}')]`));
    await categoryOption.click();

    const submitBtn = await driver.findElement(By.css('#newPostForm button[type="submit"]'));
    await driver.executeScript("arguments[0].click();", submitBtn);

    try {
      await driver.wait(until.alertIsPresent(), 5000);
      await (await driver.switchTo().alert()).accept();
    } catch (_) {}

    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
    await driver.sleep(1000); 

    const postCard = await driver.findElement(By.xpath(`//h5[contains(text(), '${tituloPost}')]/ancestor::div[contains(@class, 'card')]`));
    const deleteBtn = await postCard.findElement(By.css('.btn-outline-danger'));
    await driver.executeScript("arguments[0].click();", deleteBtn);

    try {
      await driver.wait(until.alertIsPresent(), 5000);
      await (await driver.switchTo().alert()).accept();
    } catch (_) {}

    await driver.sleep(1000);
    const posts = await driver.findElements(By.xpath(`//h5[contains(text(), '${tituloPost}')]`));
    if (posts.length > 0) {
      throw new Error('El post no fue eliminado correctamente.');
    }

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/delete_post.png', screenshot, 'base64');
  });
});

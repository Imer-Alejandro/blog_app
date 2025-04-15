const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const assert = require('assert');
require('chromedriver');

describe('Eliminar categoría', function () {
  this.timeout(30000);
  let driver;
  const username = 'user_delete_test';
  const password = 'test123_Eliminar';
  const categoryName = 'Temporal';

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();

    // Registro
    await driver.get('http://localhost:3000/register');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#registerForm button[type="submit"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await (await driver.switchTo().alert()).accept();
    } catch (_) {}

    // Login
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

  it('debería registrar y luego eliminar una categoría', async function () {
    await driver.findElement(By.css('a[href="/categories"]')).click();
    await driver.wait(until.urlIs('http://localhost:3000/categories'), 5000);
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);

    // Crear categoría
    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(categoryName);
    await driver.findElement(By.css('#categoryForm button[type="submit"]')).click();

    await driver.sleep(1000); 
    const categoryList = await driver.findElement(By.id('categoryList'));
    const categoryItems = await categoryList.findElements(By.tagName('li'));

    assert.ok(categoryItems.length > 0, 'No se agregó ninguna categoría.');

    // Captura antes de eliminar
    const beforeScreenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/before_delete_category.png', beforeScreenshot, 'base64');

    const firstItem = categoryItems[0];
    const deleteBtn = await firstItem.findElement(By.css('.btn-outline-danger'));
    await deleteBtn.click();

    await driver.wait(until.alertIsPresent(), 3000);
    await (await driver.switchTo().alert()).accept();

    await driver.sleep(1000);

    const updatedItems = await driver.findElements(By.css('#categoryList li'));
    let categoryStillExists = false;
    for (let li of updatedItems) {
      const text = await li.getText();
      if (text.includes(categoryName)) {
        categoryStillExists = true;
        break;
      }
    }

    const afterScreenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/after_delete_category.png', afterScreenshot, 'base64');

    assert.strictEqual(categoryStillExists, false, `La categoría "${categoryName}" no fue eliminada correctamente.`);
  });
});

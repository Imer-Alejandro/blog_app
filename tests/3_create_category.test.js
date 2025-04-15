const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
require('chromedriver');

describe('Crear categoría', function () {
  this.timeout(20000);
  let driver;

  const username = 'user_test';
  const password = 'test123_#23121%_Q';
  const categoryName = 'Tecnología';

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

    // Iniciar sesión
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

  it('debería crear una nueva categoría correctamente', async function () {
    await driver.get('http://localhost:3000/dashboard');
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
    await driver.wait(until.elementLocated(By.css('h2.text-primary')), 5000);

    const categoriesBtn = await driver.findElement(By.css('a[href="/categories"]'));
    await categoriesBtn.click();

    await driver.wait(until.urlIs('http://localhost:3000/categories'), 5000);
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);

    // Ingresar y guardar la categoría
    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(categoryName);

    const saveBtn = await driver.findElement(By.css('#categoryForm button[type="submit"]'));
    await saveBtn.click();

    await driver.sleep(1000); 

    const categoryList = await driver.findElement(By.id('categoryList'));
    const categoryItems = await categoryList.findElements(By.tagName('li'));

    let categoryFound = false;
    for (let li of categoryItems) {
      const text = await li.getText();
      if (text.includes(categoryName)) {
        categoryFound = true;
        break;
      }
    }

    if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/create_category.png', screenshot, 'base64');

    if (!categoryFound) {
      throw new Error(`La categoría "${categoryName}" no se encontró en la lista.`);
    }
  });
});

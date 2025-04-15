const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
require('chromedriver');

describe('Crear categoría y publicación correctamente', function () {
  this.timeout(20000); 
  let driver;

  const username = 'user_test';
  const password = 'test123_#23121%_Q';
  const categoryName = 'Tecnología';
  const tituloPost = 'Nuevo avance en IA';
  const contenidoPost = 'Hoy se anunció un nuevo modelo de lenguaje.';

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();

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

  it('debería crear una nueva categoría y una publicación, luego mostrarla en el home', async function () {
    await driver.get('http://localhost:3000/dashboard');
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
    await driver.wait(until.elementLocated(By.css('h2.text-primary')), 5000);
  
    const categoriesBtn = await driver.findElement(By.css('a[href="/categories"]'));
    await categoriesBtn.click();
  
    await driver.wait(until.urlIs('http://localhost:3000/categories'), 5000);
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);
  
    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(categoryName);
  
    const saveBtn = await driver.findElement(By.css('#categoryForm button[type="submit"]'));
    await saveBtn.click();
  
    await driver.sleep(1000);
  
    await driver.get('http://localhost:3000/post/new');
    await driver.wait(until.urlIs('http://localhost:3000/post/new'), 5000);
  
    await driver.findElement(By.id('title')).sendKeys(tituloPost);
    await driver.findElement(By.id('content')).sendKeys(contenidoPost);
  
    await driver.wait(until.elementLocated(By.id('categorySelect')), 5000);
    const categorySelect = await driver.findElement(By.id('categorySelect'));
    await categorySelect.click();
    const categoryOption = await driver.findElement(By.xpath(`//select[@id='categorySelect']/option[contains(., '${categoryName}')]`));
    await categoryOption.click();
  
    const submitBtn = await driver.findElement(By.css('#newPostForm button[type="submit"]'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', submitBtn);
    await driver.executeScript("arguments[0].click();", submitBtn);
  
    try {
      await driver.wait(until.alertIsPresent(), 5000);
      const alert = await driver.switchTo().alert();
      await alert.accept(); 
    } catch (err) {
      console.log('No se encontró la alerta o ya fue manejada');
    }
  
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
  
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/create_post.png', screenshot, 'base64');
  });
});

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
require('chromedriver');

describe('Editar una publicación correctamente', function () {
  this.timeout(30000); 
  let driver;

  const username = 'user_edit_test';
  const password = 'test123_#23121%_Q';
  const categoryName = 'Ciencia';
  const tituloOriginal = 'Descubrimiento espacial';
  const contenidoOriginal = 'Se ha detectado un nuevo planeta habitable.';
  const tituloEditado = 'Descubrimiento espacial actualizado';
  const contenidoEditado = 'Se confirmó la existencia del nuevo planeta con más detalles.';

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

  it('debería editar una publicación existente y mostrar los cambios', async function () {
    await driver.get('http://localhost:3000/categories');
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);

    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(categoryName);
    const saveBtn = await driver.findElement(By.css('#categoryForm button[type="submit"]'));
    await saveBtn.click();
    await driver.sleep(1000);

    await driver.get('http://localhost:3000/post/new');
    await driver.wait(until.elementLocated(By.id('title')), 5000);
    await driver.findElement(By.id('title')).sendKeys(tituloOriginal);
    await driver.findElement(By.id('content')).sendKeys(contenidoOriginal);
    const categorySelect = await driver.findElement(By.id('categorySelect'));
    await categorySelect.click();
    const categoryOption = await driver.findElement(By.xpath(`//select[@id='categorySelect']/option[contains(., '${categoryName}')]`));
    await categoryOption.click();
    await driver.findElement(By.css('#newPostForm button[type="submit"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await driver.switchTo().alert().accept();
    } catch (_) {}

    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);

    const editBtn = await driver.findElement(By.css('button.btn-outline-primary'));
    await driver.executeScript("arguments[0].click();", editBtn);

    await driver.wait(until.urlContains('/post/edit/'), 5000);

    const titleInput = await driver.findElement(By.id('title'));
    await titleInput.clear();
    await titleInput.sendKeys(tituloEditado);

    const contentInput = await driver.findElement(By.id('content'));
    await contentInput.clear();
    await contentInput.sendKeys(contenidoEditado);

    await driver.findElement(By.css('#editPostForm button[type="submit"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await driver.switchTo().alert().accept();
    } catch (_) {}

    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/edit_post.png', screenshot, 'base64');
  });
});

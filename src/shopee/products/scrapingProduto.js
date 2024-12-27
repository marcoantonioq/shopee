import puppeteer from 'puppeteer'

const url = 'https://shopee.com.br/product/235221401/17565293197'

async function scrapeAndScreenshot() {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Localiza o elemento <h2> com texto específico e sua próxima <div>
  const divHandle = await page.evaluateHandle(() => {
    const h2Elements = Array.from(document.querySelectorAll('h2'))
    const targetH2 = h2Elements.find((el) =>
      el.textContent?.includes('Seção da imagem do produto')
    )
    return targetH2?.nextElementSibling || null
  })

  // Converte o JSHandle para um ElementHandle, se possível
  // const elementHandle = divHandle.asElement()

  // if (elementHandle) {
  //   // Faz o screenshot da div localizada
  //   await elementHandle.screenshot({ path: 'div_screenshot.png' })
  //   console.log('Screenshot capturada: div_screenshot.png')
  // } else {
  //   console.log('Elemento não encontrado ou próximo <div> não existe!')
  // }

  // await browser.close()
}

scrapeAndScreenshot().catch(console.error)

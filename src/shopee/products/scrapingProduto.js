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
}

scrapeAndScreenshot().catch(console.error)

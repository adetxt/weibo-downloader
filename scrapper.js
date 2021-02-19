const puppeteer = require("puppeteer")
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"

exports.getImageUrls = async function getImageUrls(target, headless) {
  let urls = []

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: headless,
  })

  // Open new page
  const page = await browser.newPage()

  // Set user agent
  page.setUserAgent(userAgent)
  page.goto(target)

  console.log("loaded")
  try {
    await page.waitForSelector("ul.m-auto-list", {
      timeout: 60000,
    })
    console.log("catched")
  } catch (error) {
    console.log("error catching", error)
    await browser.close()
  }

  const lists = await page.$$(".m-auto-list > li")

  for (const li of lists) {
    let url = await li.$eval("img", (img) => img.getAttribute("src"))
    console.log("url", url)

    let urlLarge = url.replace("orj360/", "large/")
    console.log("urlLarge", urlLarge)

    let fileName = url.split("/")
    console.log("name", fileName)

    urls.push({ url: headless ? urlLarge : url, name: fileName[4] })
  }

  await browser.close()
  return urls
}

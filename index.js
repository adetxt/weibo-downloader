const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const fetch = require("node-fetch")
const JSZip = require("jszip")

// Scrapper
const { getImageUrls } = require("./scrapper")

app.set("view engine", "pug")

app.get("/", function (req, res, next) {
  res.render("index", { title: "adetxt Weibo Downloader" })
})

app.get("/:key", async (req, res) => {
  // Begin scrapping
  let urls = await getImageUrls(
    "https://m.weibo.cn/status/" + req.params.key,
    !(port === 4000)
  )

  let zip = new JSZip()
  // Zipping
  const zipping = async () => {
    for (const { url, name } of urls) {
      const response = await fetch(url)
      const buffer = await response.buffer()
      zip.file(name, buffer)
    }
  }

  zipping()
    .then(() => {
      let d = new Date()
      let zipName = d.toISOString()

      // Set the name of the zip file in the download
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + zipName + '.zip"'
      )

      // Send the zip file
      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(res)
        .on("finish", function () {
          console.log("out.zip written.")
        })
    })
    .catch((e) => {
      console.log(e)
    })
  // res.json({ 'data':urls })
})

app.listen(port, () => console.log(`Listening on port ${port}`))

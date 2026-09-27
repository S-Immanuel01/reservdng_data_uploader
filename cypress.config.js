const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const XLSX = require('xlsx')
require('dotenv').config()

module.exports = defineConfig({
  allowCypressEnv: false,
  pageLoadTimeout: 90000,
  e2e: {
    baseUrl: "https://reservdng.com",
    env: {
      email: process.env.USERNAME,  
      password: process.env.PASSWORD
    },
    setupNodeEvents(on, config) {
      on('task', {

        async readRemoteExcel(url) {

          const buffer = await new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http

            client.get(url, (res) => {
              const chunks = []

              res.on('data', (chunk) => chunks.push(chunk))
              res.on('end', () => resolve(Buffer.concat(chunks)))
              res.on('error', reject)
            }).on('error', reject)
          })

          const workbook = XLSX.read(buffer, { type: 'buffer' })

          const result = workbook.SheetNames.map((sheetName) => ({
            name: sheetName,
            data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
          }))

          return result
        },


        findFixtureImages({ searchString, subfolder }) {
          const fixturesRoot = path.join(
            process.cwd(),        // project root
            'cypress',
            'fixtures',
            subfolder || ''
          )

          console.log('Looking in:', fixturesRoot)      // helps debug future path issues
          console.log('Search string:', searchString)

          const IMAGE_EXTS = ['.jpg', '.jpeg', '.png',]

          if (!fs.existsSync(fixturesRoot)) {
            throw new Error(`Fixtures subfolder does not exist: ${fixturesRoot}`)
          }

          const entries = fs.readdirSync(fixturesRoot)
          const match = entries.find(entry =>
            entry.toLowerCase().includes(searchString.toLowerCase())
          )

          if (!match) {
            return []   // return empty array instead of throwing so the test can skip gracefully
          }

          const matchPath = path.join(fixturesRoot, match)
          const stat = fs.statSync(matchPath)

          let imagePaths = []

          if (stat.isDirectory()) {
            imagePaths = fs.readdirSync(matchPath)
              .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
              .map(f => path.join('cypress', 'fixtures', subfolder, match, f).replace(/\\/g, '/'))
          } else if (IMAGE_EXTS.includes(path.extname(match).toLowerCase())) {
            imagePaths = [path.join('cypress', 'fixtures', subfolder, match).replace(/\\/g, '/')]
          }

          return imagePaths
        },

        saveFixture({ filename, data }) {
          const fs = require('fs')
          const path = require('path')
          const filePath = path.join(__dirname, 'cypress', 'fixtures', filename)
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
          return null
        }
      })
    },
  },
});

import { defineConfig } from "cypress";
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

// Define interfaces for your task arguments
interface ReadRemoteExcelArgs {
  url: string;
}

interface FindFixtureImagesArgs {
  searchString: string;
  subfolder?: string;
}

interface SaveFixtureArgs {
  filename: string;
  data: any;
}

export default defineConfig({
  allowCypressEnv: true,
  pageLoadTimeout: 90000,
  e2e: {
    baseUrl: "https://reservdng.com",
    env: {
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD
    },
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      on('task', {
        async readRemoteExcel(url: string) {
          const buffer = await new Promise<Buffer>((resolve, reject) => {
            const client = url.startsWith('https') ? https : http;

            client.get(url, (res) => {
              const chunks: Uint8Array[] = [];

              res.on('data', (chunk) => chunks.push(chunk));
              res.on('end', () => resolve(Buffer.concat(chunks)));
              res.on('error', reject);
            }).on('error', reject);
          });

          const workbook = XLSX.read(buffer, { type: 'buffer' });

          const result = workbook.SheetNames.map((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) {
              throw new Error(`Worksheet not found: ${sheetName}`);
            }

            return {
              name: sheetName,
              data: XLSX.utils.sheet_to_json(sheet, { header: 1 })
            };
          });

          return result;
        },

        findFixtureImages({ searchString, subfolder }: FindFixtureImagesArgs) {
          const fixturesRoot = path.join(
            process.cwd(),        // project root
            'cypress',
            'fixtures',
            subfolder || ''
          );

          console.log('Looking in:', fixturesRoot);      // helps debug future path issues
          console.log('Search string:', searchString);

          const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];

          if (!fs.existsSync(fixturesRoot)) {
            throw new Error(`Fixtures subfolder does not exist: ${fixturesRoot}`);
          }

          const entries = fs.readdirSync(fixturesRoot);
          const match = entries.find(entry =>
            entry.toLowerCase().includes(searchString.toLowerCase())
          );

          if (!match) {
            return [];   // return empty array instead of throwing so the test can skip gracefully
          }

          const matchPath = path.join(fixturesRoot, match);
          const stat = fs.statSync(matchPath);

          let imagePaths: string[] = [];

          if (stat.isDirectory()) {
            imagePaths = fs.readdirSync(matchPath)
              .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
              .map(f => path.join('cypress', 'fixtures', subfolder || '', match, f).replace(/\\/g, '/'));
          } else if (IMAGE_EXTS.includes(path.extname(match).toLowerCase())) {
            imagePaths = [path.join('cypress', 'fixtures', subfolder || '', match).replace(/\\/g, '/')];
          }

          return imagePaths;
        },

        saveFixture({ filename, data }: SaveFixtureArgs) {
          // Reuses the ES imports from the top of the file
          const filePath = path.join(__dirname, 'cypress', 'fixtures', filename);
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          return null;
        }
      });

      // Forward environment variables into Cypress
      if (config.env) {
        Object.keys(process.env).forEach((key) => {
          config.env[key] = process.env[key];
        });
      }

      return config;
    },
  },
});

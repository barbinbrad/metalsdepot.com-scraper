# Web scraper for metalsdepot.com

This is a web scraper that uses playwright and sqlite to scrape available parts from [metalsdepot.com](https://metalsdepot.com)

Because this relies on CSS selectors and relies certain page layouts, it extremely volatile. But as of today, it works.

## Running locally

```bash
npm i                   # install packages
npx playwright install  # download playwright
npm run scrape          # run the scraper
```

The result of the scraping is `output/parts.json`

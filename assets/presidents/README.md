# PRESIDENTIAL PORTRAITS

This folder contains one repo-local portrait for each individual who has served as president of the United States.

- `portraits.json` records the president, local filename, Wikidata record, Wikimedia Commons source page, original file, creator, license, and retrieval date.
- `president-facts.json` contains the student-ready key facts and quote choices used by Portrait Day.
- Every downloaded file is accepted only when its Wikimedia Commons metadata identifies it as public domain, PD-USGov, or CC0.
- Files are web-sized thumbnails with a maximum requested width of 900 pixels.
- Franklin D. Roosevelt uses a separately selected public-domain Smithsonian portrait because the colorized image on his Wikidata record uses a Creative Commons attribution license.

Regenerate and recheck the collection with:

```sh
node scripts/fetch-president-portraits.mjs
node scripts/build-president-facts.mjs
node scripts/validate-site.js
```

Review the linked Commons source page before using any portrait outside this course site.

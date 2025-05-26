# Paperback-GetComics

**Purpose:** This is a Paperback source extension for GetComics.org, allowing users to search, browse, and download comics from the GetComics website within the Paperback app.

## Installation

1. Create a GitHub repository named `paperback-getcomics` and include the files shown above.
2. In the Paperback iOS app, go to **Settings > External Sources** and add the URL of your GitHub repository.
3. In the list of extensions, enable the **GetComics** source.

## Usage

- **Home Screen:** The extension’s home page shows two sections: **Weekly Packs** (new comic collections) and **Latest Releases**. Each item links to its detail page on GetComics.
- **Search:** Use the search function in Paperback; the extension sends your query to `getcomics.org/?s=<query>` and displays matching comic issues.
- **Issue Details:** Selecting an issue shows the title, description ("The Story"), year, and file size (from the GetComics page). There is no cover image provided.
- **Chapters:** Each comic issue is treated as one chapter. (For example, “Batman #7” is one chapter.)
- **Download Links:** On the issue’s page, a list of download links (Terabox, Vikingfile, Pixeldrain, Mega) is provided. These are returned as the "pages" of the chapter.

## Files

- `GetComics.ts` – TypeScript source code implementing the extension (see code below).
- `icon.png` – Placeholder path for the extension icon (replace with an actual 256×256 icon image).

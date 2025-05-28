# Paperback-GetComics

**Purpose:** This is a Paperback source extension for GetComics.org, allowing users to search, browse, and download comics from the GetComics website within the Paperback app.

## Installation

1. Create a GitHub repository named `GetComicsPaperback` and include the files shown above.
2. In the Paperback iOS app, go to **Settings > External Sources** and add the URL:
   ```
   https://raw.githubusercontent.com/S1MV3R/GetComicsPaperback/main/
   ```
3. In the list of extensions, enable the **GetComics** source.

## Usage

- **Home Screen:** Shows **Latest Releases**.  
- **Search:** Sends queries to `getcomics.org/?s=<query>`.  
- **Issue Details:** Displays title, description, year, size.  
- **Chapters:** Each issue is one chapter.  
- **Download Links:** Lists download hosts (Terabox, Mega, etc.).

## Files

- `GetComics.ts` – TypeScript code for the extension.  
- `manifest.json` – Metadata for Paperback.  
- `icon.png` – 256×256 PNG icon for the extension.

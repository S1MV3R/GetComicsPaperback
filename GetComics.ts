import {
  Source,
  Manga,
  Chapter,
  Page,
  MangaTile,
  HomeSection,
  SearchRequest,
  PagedResults,
  SourceInfo,
  Language,
  ContentRating,
  MangaStatus,
  createRequestObject,
  createHomeSection,
  createMangaTile,
  createPagedResults,
  createIconText,
  createManga,
  createChapter,
  createPage
} from "paperback-extensions-common";

const BASE_URL = "https://getcomics.org";

export const GetComicsInfo: SourceInfo = {
  version: "1.0.0",
  name: "GetComics",
  description: "Scraper extension for getcomics.org free comic downloads",
  author: "S1MV3R",
  authorWebsite: "https://github.com/S1MV3R",
  icon: "icon.png",
  contentRating: ContentRating.EVERYONE,
  websiteBaseURL: BASE_URL,
  language: Language.ENGLISH,
  sourceTags: [
    { text: 'Comics', type: 'genre' },
    { text: 'English', type: 'content' }
  ]
};

export class GetComics extends Source {
  constructor() {
    super(GetComicsInfo);
  }

  /**
   * Home page sections: Latest Releases
   */
  public async getHomePageSections(): Promise<HomeSection[]> {
    const sections: HomeSection[] = [];
    const request = createRequestObject({ url: BASE_URL, method: 'GET' });
    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    const latestSection = createHomeSection({
      id: 'latest', title: 'Latest Releases', view_more: false
    });
    const tiles: MangaTile[] = [];

    $('article').each((_, el) => {
      const titleElem = $(el).find('h3.entry-title a');
      const title = titleElem.text().trim();
      const href = titleElem.attr('href') || '';
      if (!title || !href) return;
      const mangaId = href.replace(BASE_URL, '').split('/').filter(p => p).join('/');
      const imgElem = $(el).find('.entry-thumb img').first();
      const image = imgElem.attr('data-src') || imgElem.attr('src') || '';

      tiles.push(createMangaTile({
        id: mangaId,
        title: createIconText({ text: title }),
        image
      }));
    });

    latestSection.items = tiles;
    sections.push(latestSection);
    return sections;
  }

  /**
   * Search comics by title
   */
  public async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query.title)}`;
    const request = createRequestObject({ url, method: 'GET' });
    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);
    const tiles: MangaTile[] = [];

    $('article').each((_, el) => {
      const titleElem = $(el).find('h3.entry-title a');
      const title = titleElem.text().trim();
      const href = titleElem.attr('href') || '';
      if (!title || !href) return;
      const mangaId = href.replace(BASE_URL, '').split('/').filter(p => p).join('/');
      const imgElem = $(el).find('.entry-thumb img').first();
      const image = imgElem.attr('data-src') || imgElem.attr('src') || '';

      tiles.push(createMangaTile({
        id: mangaId,
        title: createIconText({ text: title }),
        image
      }));
    });

    return createPagedResults({ results: tiles, metadata: { hasMore: false } });
  }

  /**
   * Get details for a specific comic issue
   */
  public async getMangaDetails(mangaId: string): Promise<Manga> {
    const url = `${BASE_URL}/${mangaId}`;
    const request = createRequestObject({ url, method: 'GET' });
    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    const title = $('h1').first().text().trim() || mangaId;
    const storyHeader = $('h2').filter((i, el) => $(el).text().includes('The Story')).first();
    let desc = '';
    if (storyHeader.length) {
      desc = storyHeader.next('p').text().trim();
    }

    // Append metadata
    const metaText = $('div.entry-content p').filter((_, el) => $(el).text().includes('Year')).text().trim();
    if (metaText) desc += `\n\n**${metaText.replace(/\s*\|\s*/g, ' | ')}**`;

    const coverImg = $('div.entry-content img').first();
    const image = coverImg.attr('data-src') || coverImg.attr('src') || '';

    return createManga({
      id: mangaId,
      titles: [title],
      image,
      desc,
      status: MangaStatus.ONGOING
    });
  }

  /**
   * Each comic issue is a single chapter
   */
  public async getChapters(mangaId: string): Promise<Chapter[]> {
    const chapter: Chapter = createChapter({
      id: mangaId,
      mangaId,
      chapNum: 1,
      name: 'Download Links',
      langCode: 'en'
    });
    return [chapter];
  }

  /**
   * Return all download links as pages
   */
  public async getPages(mangaId: string, chapterId: string): Promise<Page[]> {
    const url = `${BASE_URL}/${mangaId}`;
    const request = createRequestObject({ url, method: 'GET' });
    const response = await this.requestManager.schedule(request, 1);
    const $ = this.cheerio.load(response.data);

    const pages: Page[] = [];
    $('div.entry-content a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();
      if (href && /^https?:\/\//.test(href) && text) {
        pages.push(createPage({ index: pages.length, url: href }));
      }
    });

    return pages;
  }
}

export const source = new GetComics();

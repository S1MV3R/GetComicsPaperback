import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    PagedResults,
    SearchRequest,
    SearchResult
} from "paperback-extensions-common";

const BASE_URL = "https://getcomics.org";

export class GetComics extends Source {
    override readonly id = "getcomics";
    override readonly name = "GetComics";
    override readonly icon = "icon.png";
    override readonly author = "YourName";
    override readonly version = "1.0.0";
    override readonly websiteBaseURL = BASE_URL;
    override readonly language = "en";

    async getHomePageSections(): Promise<HomeSection[]> {
        const sections: HomeSection[] = [];
        const homeRequest = createRequestObject({ url: this.websiteBaseURL });
        const homeResponse = await this.requestManager.schedule(homeRequest, 1);
        const homeData = await homeResponse.text();
        const doc = new DOMParser().parseFromString(homeData, "text/html");

        const weekly: HomeSection = {
            id: "weekly_packs",
            title: "Weekly Packs",
            items: []
        };
        const anchors = Array.from(doc.querySelectorAll("a"));
        for (const a of anchors) {
            const text = a.textContent?.trim() || "";
            if (text.includes("Weekly Pack")) {
                const mangaId = a.getAttribute("href")?.split("/").pop() || "";
                weekly.items.push({
                    id: mangaId,
                    title: text,
                    image: ""
                });
            }
        }
        if (weekly.items.length) {
            sections.push(weekly);
        }

        const latest: HomeSection = {
            id: "latest",
            title: "Latest Releases",
            items: []
        };
        for (const a of anchors) {
            const text = a.textContent?.trim() || "";
            if (/\(\d{4}\)/.test(text) && !text.includes("Weekly Pack") && !/Channel|News/i.test(text)) {
                const mangaId = a.getAttribute("href")?.split("/").pop() || "";
                latest.items.push({
                    id: mangaId,
                    title: text,
                    image: ""
                });
            }
        }
        if (latest.items.length) {
            sections.push(latest);
        }

        return sections;
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults<SearchResult>> {
        const searchUrl = `${this.websiteBaseURL}/?s=${encodeURIComponent(query.title)}`;
        const request = createRequestObject({ url: searchUrl });
        const response = await this.requestManager.schedule(request, 1);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const results: SearchResult[] = [];

        const anchors = Array.from(doc.querySelectorAll("a"));
        for (const a of anchors) {
            const text = a.textContent?.trim() || "";
            if (/\(\d{4}\)/.test(text) && !text.includes("Weekly Pack") && !/Channel|News/i.test(text)) {
                const mangaId = a.getAttribute("href")?.split("/").pop() || "";
                results.push({
                    id: mangaId,
                    title: text,
                    image: ""
                });
            }
        }

        return { results };
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const url = `${this.websiteBaseURL}/${mangaId}`;
        const request = createRequestObject({ url });
        const response = await this.requestManager.schedule(request, 1);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const title = doc.querySelector("h1")?.textContent?.trim() || mangaId;

        let description = "";
        const storyHeader = doc.querySelector("h2");
        if (storyHeader && storyHeader.textContent?.includes("The Story")) {
            const storyContent = storyHeader.nextElementSibling;
            if (storyContent) {
                description = storyContent.textContent?.trim() || "";
            }
        }

        const yearMatch = html.match(/Year\s*:\s*(\d{4})/i);
        const sizeMatch = html.match(/Size\s*:\s*([\d\.]+\s*MB)/i);
        if (yearMatch) {
            description += `\n\nYear: ${yearMatch[1]}`;
        }
        if (sizeMatch) {
            description += ` | Size: ${sizeMatch[1]}`;
        }

        return {
            id: mangaId,
            titles: [title],
            image: "",
            status: "ONGOING",
            author: "",
            genres: [],
            desc: description.trim()
        };
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        let chapNum = 1;
        const match = mangaId.match(/-(\d+)-\d{4}$/);
        if (match) chapNum = parseInt(match[1]);
        return [{
            id: mangaId,
            mangaId: mangaId,
            name: `Issue ${chapNum}`,
            chapNum: chapNum,
            time: new Date()
        }];
    }

    async getPages(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const url = `${this.websiteBaseURL}/${mangaId}`;
        const request = createRequestObject({ url });
        const response = await this.requestManager.schedule(request, 1);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const pages: string[] = [];
        const anchors = Array.from(doc.querySelectorAll("a"));
        for (const a of anchors) {
            const text = a.textContent?.trim().toLowerCase() || "";
            if (["terabox", "vikingfile", "pixeldrain", "mega"].includes(text)) {
                const href = a.getAttribute("href");
                if (href) pages.push(href);
            }
        }

        return { id: chapterId, mangaId: mangaId, pages };
    }
}

export const source = new GetComics();

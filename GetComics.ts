import {
    Source,
    HomeSection,
    createHomeSection
} from "paperback-extensions-common";

export class GetComics extends Source {
    override readonly id = "getcomics";
    override readonly name = "GetComics";
    override readonly icon = "icon.png";
    override readonly author = "S1MV3R";
    override readonly version = "1.0.1";
    override readonly websiteBaseURL = "https://getcomics.org";
    override readonly language = "en";

    async getHomePageSections(): Promise<HomeSection[]> {
        return [createHomeSection({ id: "test", title: "Test Section", items: [] })];
    }
}

export const source = new GetComics();
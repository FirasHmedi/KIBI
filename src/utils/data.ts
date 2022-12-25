export interface Story {
	id: string;
	summary: string;
	content: string;
	tags: string[];
	views: number;
	wrName: string;
	wrId: string;
}

export const INITIAL_VIEWS = 0;

const fakeSummary =
	"My story happened when I was 15, I went with my friends to our near forest. We started playing as usual and while discovering we found a body of...";

const fakeContent =
	"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.";

export enum Tags {
	SUCCESS = "success",
}

// 13 tags
export const TAGS = [
	"success",
	"failure",
	"regret",
	"lesson",
	"childhood",
	"pain",
	"love",
	"hope",
	"accident",
	"nostalgia",
	"joy",
	"sadness",
];

// export const stories: Story[] = [
// 	{
// 		id: 1,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[0], TAGS[2]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 2,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[1], TAGS[3]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 3,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[6], TAGS[4]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 4,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[7], TAGS[8]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 5,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[0], TAGS[2]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 6,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[9]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// 	{
// 		id: 7,
// 		summary: fakeSummary,
// 		content: fakeContent,
// 		tags: [TAGS[10]],
// 		views: INITIAL_VIEWS,
// 		wrName: "user1",
// 		wrId: 2,
// 	},
// ];

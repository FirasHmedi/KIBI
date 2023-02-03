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
export const MIN_LENGTH_CONTENT = 10; //150
export const MAX_LENGTH_CONTENT = 1500; //150

const fakeSummary =
  'My story happened when I was 15, I went with my friends to our near forest. We started playing as usual and while discovering we found a body of...';

const fakeContent =
  'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.';

export const TAGS_ENV = [
  'life',
  'work',
  'study',
  'childhood',
  'love',
  'family',
  'friends',
];

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';

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
// ];

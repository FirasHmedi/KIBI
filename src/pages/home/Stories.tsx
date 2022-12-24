import { Grid } from "@mui/material";
import React, { useState } from "react";
import { Story } from "../../utils/utils";
import { StoryModal } from "../story/StoryModal";
import { StoryItem } from "./StoryItem";

interface Props {
	stories: Story[];
}

const filterStories = (stories: Story[]) =>
	stories.filter(
		({ content, summary, tags }) =>
			!!content && !!summary && !!tags && tags.length > 0
	);

export const Stories = ({ stories }: Props) => {
	const filteredStories = filterStories(stories);
	const [open, setOpen] = useState(false);
	const [openedStory, setOpenedStory] = useState<Story>();

	const handleClose = () => setOpen(false);
	const openStory = (story: Story) => {
		setOpenedStory(story);
		setOpen(true);
	};

	return (
		<div
			style={{
				display: "flex",
				paddingLeft: "2%",
				paddingRight: "2%",
				overflowY: "auto",
			}}
		>
			<Grid
				container
				pt={3}
				pb={150}
				columnGap={8}
				rowGap={8}
				justifyContent="center"
				style={{}}
			>
				{filteredStories.map((story) => (
					<div onClick={() => openStory(story)}>
						<StoryItem story={story} />
					</div>
				))}
			</Grid>

			{openedStory && (
				<StoryModal story={openedStory} open={open} handleClose={handleClose} />
			)}
		</div>
	);
};

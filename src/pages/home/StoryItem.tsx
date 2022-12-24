import { Grid, Typography } from "@mui/material";
import React from "react";
import { black, coffee, primary, softGrey } from "../../styles/Style";
import { Tag } from "../../components/Tag";
import { ProfileItem } from "./ProfileItem";
import { Story } from "../../utils/utils";

interface Props {
	story: Story;
}

export const StoryItem = ({ story }: Props) => {
	return (
		<Grid
			item
			key={story.id}
			p={1.5}
			flexDirection="column"
			style={{
				backgroundColor: primary,
				color: softGrey,
				borderRadius: 5,
				display: "flex",
				width: "22vw",
			}}
		>
			<ProfileItem name={"SUB-ZERO"} />

			<Typography
				variant="h6"
				fontFamily={"Segoe UI"}
				fontWeight={"bold"}
				style={{
					display: "flex",
				}}
				p={1}
				pt={1.5}
				pb={1.5}
			>
				{story.summary}
			</Typography>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					gap: 10,
				}}
			>
				{story.tags.map((tag: string) => (
					<Tag tag={tag} />
				))}
			</div>
		</Grid>
	);
};

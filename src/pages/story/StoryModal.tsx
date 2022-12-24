import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { Tag } from "../../components/Tag";
import { primary, softGrey } from "../../styles/Style";
import { Story } from "../../utils/utils";
import { ProfileItem } from "../home/ProfileItem";

interface Props {
	story: Story;
	open: boolean;
	handleClose: () => void;
}

export const StoryModal = ({ story, open, handleClose }: Props) => {
	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				style={{
					outline: "none",
					backgroundColor: primary,
					color: softGrey,
					borderRadius: 5,
					display: "flex",
					width: "80%",
					height: "85%",
					flexDirection: "column",
					position: "absolute",
					top: "5%",
					left: "10%",
				}}
				p={3}
			>
				<ProfileItem name={"SUB-ZERO"} />

				<div style={{ flex: 5 }}>
					<Typography
						variant="h6"
						fontFamily={"Segoe UI"}
						style={{
							display: "flex",
						}}
						p={1}
						pt={1.5}
						pb={1.5}
					>
						{story.content}
					</Typography>
				</div>

				<div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
					{story.tags.map((tag: string) => (
						<Tag tag={tag} />
					))}
				</div>
			</Box>
		</Modal>
	);
};

import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { Tag } from "../../components/Tag";
import { primary, softGrey } from "../../styles/Style";

interface Props {
	open: boolean;
	handleClose: () => void;
}

export const AddStoryForm = ({ open, handleClose }: Props) => {
	const [content, setContent] = useState("");
	const [tags, setTags] = useState(["success", "failure"]);
	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				style={{
					outline: "none",
					backgroundColor: primary,
					color: softGrey,
					borderRadius: 5,
					display: "flex",
					width: "90%",
					height: "90%",
					flexDirection: "column",
					position: "absolute",
					top: "5%",
					left: "5%",
					overflowY: "auto",
				}}
			>
				<div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
					{tags.map((tag: string) => (
						<Tag tag={tag} />
					))}
				</div>

				<div style={{ flex: 5 }}>
					<Typography
						variant="subtitle1"
						fontFamily={"Segoe UI"}
						fontWeight={"400"}
						fontSize={"1.3vw"}
						lineHeight={1.8}
						p={10}
						pt={0}
						pb={3}
					>
						{content}
					</Typography>
				</div>
			</Box>
		</Modal>
	);
};

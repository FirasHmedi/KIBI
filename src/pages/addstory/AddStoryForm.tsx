import { Box, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Tag } from "../../components/Tag";
import { black, kaki, primary, softGrey, softKaki } from "../../styles/Style";
import { TAGS } from "../../utils/data";
import { addStory } from "../../utils/db";

interface Props {
	open: boolean;
	handleClose: () => void;
}

export const AddStoryForm = ({ open, handleClose }: Props) => {
	const [content, setContent] = useState("");
	const [tags, setTags] = useState(
		TAGS.map((tag) => ({ name: tag, selected: false }))
	);

	const getTagColor = (selected: boolean) => (selected ? kaki : softKaki);
	const toggleTag = (name: string) =>
		setTags((tags) =>
			tags.map((tag) => {
				return tag.name === name ? { ...tag, selected: !tag.selected } : tag;
			})
		);

	const submitStory = async () => {
		const story = {
			summary: content,
			content: content,
			tags: tags.filter((tag) => tag.selected).map((tag) => tag.name),
			wrName: "ZERO-ONE",
			wrId: Math.floor(Math.random() * 10000000).toString(),
		};
		await addStory(story);
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				style={{
					outline: "none",
					backgroundColor: primary,
					color: softGrey,
					borderRadius: 5,
					display: "flex",
					width: "76vw",
					height: "86vh",
					flexDirection: "column",
					position: "absolute",
					top: "5vh",
					left: "10vw",
					overflowY: "auto",
					paddingLeft: '2vw',
					paddingRight: '2vw',
					paddingTop: '2vh',
					paddingBottom: '2vh'
				}}
			>
				<div
					style={{
						width: "100%",
						display: "inline-block",
						gap: 10,
					}}
				>
					{tags.map((tag: any) => (
						<button
							style={{ marginRight: 10 }}
							key={tag.name}
							onClick={() => toggleTag(tag.name)}
						>
							<Tag tag={tag.name} bgColor={getTagColor(tag.selected)} />
						</button>
					))}
				</div>
				<Box
					style={{
						flex: 5,
						padding: 15,
						border: "2px solid",
						borderRadius: 5,
						borderColor: kaki,
					}}
					mt={3}
					mb={3}
				>
					<textarea
						value={content}
						onChange={(event: any) => setContent(event.target.value)}
						style={{
							width: "100%",
							height: "100%",
							outline: "none",
							fontWeight: 400,
							lineHeight: 1.8,
							fontSize: "1.2vw",
							fontFamily: "Segoe UI",
							color: softGrey,
							backgroundColor: "transparent",
							resize: "none",
							overflow: "hidden",
							borderWidth: 0,
						}}
						placeholder={
							"Once upon a time ? no just kidding, write whatever you like"
						}
					/>
				</Box>

				<button
					style={{
						backgroundColor: kaki,
						color: black,
						borderRadius: 5,
						width: "4vw",
						padding: 2,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontWeight: "bold",
						alignSelf: "flex-end",
					}}
					onClick={() => submitStory()}
				>
					SAVE
				</button>
			</Box>
		</Modal>
	);
};

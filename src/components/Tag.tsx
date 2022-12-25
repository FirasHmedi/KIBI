import React from "react";
import { Box, Typography } from "@mui/material";
import { black, coffee, kaki, primary, softGrey } from "../styles/Style";

interface Props {
	tag: string;
	bgColor?: string
}

export const Tag = ({ tag, bgColor = kaki }: Props) => {
	return (
		<Box
			style={{
				backgroundColor: bgColor,
				color: black,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 5,
			}}
			pt={0.5}
			pb={0.5}
			pl={1}
			pr={1}
		>
			<Typography
				variant="body2"
				fontFamily={"Segoe UI"}
				fontWeight={"600"}
			>
				{tag}
			</Typography>
		</Box>
	);
};

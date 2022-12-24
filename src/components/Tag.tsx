import React from "react";
import { Box, Typography } from "@mui/material";
import { black, coffee, kaki, primary, softGrey } from "../styles/Style";

interface Props {
	tag: string;
}

export const Tag = ({ tag }: Props) => {
	return (
		<Box
			style={{
				backgroundColor: kaki,
				color: black,
				width: "5vw",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 5,
				paddingTop: 7,
				paddingBottom: 7,
				marginRight: 10
			}}
		>
			<Typography
				variant="body2"
				fontFamily={"Segoe UI"}
				fontWeight={"bold"}
			>
				{tag}
			</Typography>
		</Box>
	);
};

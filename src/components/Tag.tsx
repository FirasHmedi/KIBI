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
				width: "4.6vw",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 5,
				paddingTop: 4,
				paddingBottom: 4,
				paddingLeft:"0.1vw",
				paddingRight: "0.1vw"
			}}
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

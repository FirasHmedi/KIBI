import React from "react";
import { Box } from "@mui/material";
import {black, kaki, primary, softGrey } from "../styles/Style";

export const Header = () => {
	return (
		<Box
			p={1}
			style={{
                display: 'flex',
				backgroundColor: black,
                color: kaki,
				height: '6vh',
				alignItems: "center",
			}}
		>
			<h2 style={{marginLeft: 15}} >KAWA</h2>
		</Box>
	);
};

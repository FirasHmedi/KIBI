import { Typography } from "@mui/material";
import React from "react";
import { kaki } from "../../styles/Style";

interface Props {
	name: string;
}

export const ProfileItem = ({ name }: Props) => {
	return (
		<div style={{ display: "flex" }}>
			<Typography
				variant="subtitle1"
				fontFamily={"Segoe UI"}
				fontWeight={"bold"}
				color={kaki}
			>
				{name}
			</Typography>
		</div>
	);
};

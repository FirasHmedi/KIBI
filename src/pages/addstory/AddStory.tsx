import React from "react";
import { black, coffee, kaki, primary, softGrey } from "../../styles/Style";
import KeyboardIcon from '@mui/icons-material/Keyboard';

export const AddStory = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: 8
			}}
		>
			<div
				style={{
					borderRadius: 10,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					color: softGrey,
					borderColor: kaki,
					paddingLeft: 18,
					paddingRight: 18,
					paddingTop: 12,
					paddingBottom: 12,
					width: "25vw",
					backgroundColor: primary,
				}}
			>
				<h3 style={{}}>Share with us your story...</h3>
				<KeyboardIcon style={{color: softGrey}} fontSize={"large"} />
			</div>
		</div>
	);
};

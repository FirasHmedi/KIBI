import React from "react";
import { softGrey } from "../../styles/Style";

export const SignUp = () => {
	return (
		<div
			style={{
				color: softGrey,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "green",
			}}
		>
			<h6>username: </h6>
			<h6>email: </h6>
			<h6>password: </h6>
		</div>
	);
};

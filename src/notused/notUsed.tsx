const AVATAR_COLORS = ["#2980b9", "#c0392b", "#d35400", "#2c3e50", "#8e44ad"];

const CustomAvatar = () => {
	const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
	return (
		<div
			style={{
				height: 27,
				width: 27,
				borderRadius: "50%",
				backgroundColor: color,
			}}
		/>
	);
};

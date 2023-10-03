export const primary = '#2c3e50'; //'#bdc3c7'; //#242422 232323
export const darkGrey = '#333230';
export const softGrey = '#FBFAF5'; // f4dcc0 c7bfaf
export const black = '#000000';
export const primaryBlue = '#2980b9';
export const violet: string = '#8e44ad';

export const greyBackground = '#ecf0f1';

export const waterColor = '#2980b9';
export const fireColor = '#c0392b';
export const airColor = '#2ecc71';
export const earthColor = '#f39c12';
export const neutralColor = '#95a5a6';
export const selectedColor = '#34495e';

export const flexRowStyle: React.CSSProperties = {
	display: 'flex',
	textAlign: 'center',
	width: 'auto',
	flexDirection: 'row',
};

export const flexColumnStyle: React.CSSProperties = {
	display: 'flex',
	textAlign: 'center',
	flexDirection: 'column',
	alignItems: 'center',
};

export const centerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
};

export const appStyle: React.CSSProperties = {
	backgroundColor: greyBackground,
	height: '100vh',
};

export const headerStyle: React.CSSProperties = {
	...centerStyle,
	height: '3vh',
	justifyContent: 'center',
	paddingLeft: 10,
	paddingRight: 10,
};

export const buttonStyle: React.CSSProperties = {
	backgroundColor: violet,
	color: 'white',
	borderRadius: 5,
	fontWeight: 'bold',
	padding: 3,
	paddingLeft: 5,
	paddingRight: 5,
	minWidth: '4vw',
};

export const boardSlotStyle: React.CSSProperties = {
	...flexColumnStyle,
	borderRadius: 5,
	color: 'white',
	fontSize: '0.85em',
	height: '18vh',
	width: '7.5vw',
	flexShrink: 0,
	border: 'solid 2px #95a5a6',
};

export const deckSlotStyle: React.CSSProperties = {
	...flexColumnStyle,
	borderRadius: 5,
	color: 'white',
	fontSize: '0.85em',
	height: '14.5vh',
	width: '6vw',
	flexShrink: 0,
	border: 'solid 3px #95a5a6',
};

export const signupContainerStyle: React.CSSProperties = {
	...centerStyle, // Retain existing centering styles
	backgroundColor: violet,
	borderRadius: 5,
	width: '20vw',
	flexDirection: 'column',
	gap: 30,
	padding: 10,
	paddingTop: 30,
	paddingBottom: 30,
	minHeight: '40vh',
};

export const signinContainerStyle: React.CSSProperties = {
	...centerStyle, // Retain existing centering styles
	backgroundColor: violet,
	borderRadius: 5,
	width: '20vw',
	flexDirection: 'column',
	gap: 30,
	padding: 10,
	paddingTop: 30,
	paddingBottom: 30,
	minHeight: '40vh',
};

export const signInputStyle = {
	height: '3vh',
	borderRadius: 5,
	padding: 3,
	width: '15vw',
	borderWidth: 0,
};

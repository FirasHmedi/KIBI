export const primary = '#2c3e50'; //'#bdc3c7'; //#242422 232323
export const darkGrey = '#333230';
export const softGrey = '#FBFAF5'; // f4dcc0 c7bfaf
export const black = '#000000';
export const primaryBlue = '#2980b9';
export const violet = '#8e44ad';

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
	backgroundColor: primary,
	height: '100vh',
};

export const headerStyle: React.CSSProperties = {
	...centerStyle,
	color: primaryBlue,
	height: '3vh',
	justifyContent: 'space-between',
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
	height: '19vh',
	width: '8vw',
	flexShrink: 0,
	border: 'solid 3px #95a5a6',
};

export const deckSlotStyle: React.CSSProperties = {
	...flexColumnStyle,
	borderRadius: 5,
	color: 'white',
	fontSize: '0.85em',
	height: '13vh',
	width: '5vw',
	flexShrink: 0,
	border: 'solid 3px #95a5a6',
};

export const signupContainerStyle: React.CSSProperties = {
	...centerStyle,
	backgroundColor: primary,
	borderRadius: 5,
	width: '20vw',
	alignSelf: 'center',
	flexDirection: 'column',
	gap: 30,
	marginTop: 100,
	padding: 10,
	paddingTop: 30,
	paddingBottom: 30,
	minHeight: '40vh',
};

export const signinContainerStyle: React.CSSProperties = {
	...signupContainerStyle,
};

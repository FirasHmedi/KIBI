
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
export const graveyardPopup2 : React.CSSProperties = {
	position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
}

export const graveyardPopup : React.CSSProperties = {
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
	width: '32vw',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: '1vw',
	backgroundColor: 'transparent',
	padding: '1vw',
	borderRadius: '1vw',
}

export const closeButtonStyle : React.CSSProperties  = {
    position: 'absolute',
    top: '0.5vw',
    right: '0.5vw',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '50%',
    width: '2.5vw',
    height: '2.5vw',
    textAlign: 'center',
    lineHeight: '2.5vw',
    cursor: 'pointer',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
};

export const   topCardStyle : React.CSSProperties = {
	boxShadow: '3px 3px 0px 0px gray, 6px 6px 0px 0px gray',  // Shadows are more pronounced
};

export  const alertStyle : React.CSSProperties = {
    position: "fixed",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "white",
    padding: "1rem",
    borderRadius: "5px",
    zIndex: 10,
  };
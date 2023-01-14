export const primary = '#232323'; //#242422 232323
export const coffee = '#2b1b03';
export const kaki = '#eba10e';
export const softKaki = '#f6c86e';
export const darkGrey = '#333230';
export const softGrey = '#FBFAF5'; // f4dcc0 c7bfaf
export const black = '#000000';

export const centerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const appStyle: React.CSSProperties = {
  backgroundColor: 'black',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export const headerStyle: React.CSSProperties = {
  ...centerStyle,
  color: kaki,
  height: '9vh',
  justifyContent: 'space-between',
  paddingLeft: 30,
  paddingRight: 30,
};

export const buttonStyle: React.CSSProperties = {
  backgroundColor: kaki,
  color: black,
  padding: 7,
  borderRadius: 5,
  fontWeight: 'bold',
  paddingLeft: 13,
  paddingRight: 13,
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
  minHeight: '40vh'
}

export const signinContainerStyle: React.CSSProperties = {...signupContainerStyle};
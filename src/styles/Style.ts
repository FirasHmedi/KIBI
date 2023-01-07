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

export const appStyle = {
  backgroundColor: 'black',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as 'column',
};

export const headerStyle = {
  ...centerStyle,
  color: kaki,
  height: '6vh',
  justifyContent: 'space-between',
  paddingLeft: 30,
  paddingRight: 30,
};

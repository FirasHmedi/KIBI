export const Seperator = ({ h }: { h?: string }) => {
  const height = h ?? '1vh';
  return <div style={{ height }} />;
};

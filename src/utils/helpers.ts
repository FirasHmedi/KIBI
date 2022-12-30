export const isNotEmpty = (input: string | Array<any>, minLength = 0) =>
  input.length > minLength;

interface IResponse {
  success: boolean;
  message: string;
}

export const response = (success: boolean, message: string): IResponse => {
  return { success, message };
};

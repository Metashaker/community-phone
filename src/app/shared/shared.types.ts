export type Response<T = any> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

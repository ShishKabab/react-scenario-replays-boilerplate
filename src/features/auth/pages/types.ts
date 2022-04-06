export interface AuthPageState {
  email: string;
  password: string;
}
export interface AuthPageMethods {
  changeEmail(data: { value: string }): void;
  changePassword(data: { value: string }): void;
}

type GeneratedUser = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  dob: string;
};
type GeneratedContactRequest = {
  userId: number;
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type { GeneratedUser, GeneratedContactRequest };

export interface Topic {
  _id: string,
  message: string,
  user: {
    email: string,
    image: string,
  },
}


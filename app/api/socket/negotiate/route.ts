type Message = {
  content: string;
  createdAt: Date;
  id: string;
};

const messages: Message[] = [
  {
    content: "Hello, welcome to our service!",
    createdAt: new Date(),
    id: "1",
  },
  {
    content: "Here's your second message.",
    createdAt: new Date(),
    id: "2",
  },
  {
    content: "Don't forget to check out our latest features.",
    createdAt: new Date(),
    id: "3",
  }
];

export async function POST(): Promise<Response> {
  // Create a new message object
  const newMessage: Message = {
    content: "New message content",
    createdAt: new Date(),
    id: "4" // This should ideally be a unique value
  };

  // Return the new message as a JSON response
  return new Response(JSON.stringify(newMessage), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200, // HTTP status code
  });
}

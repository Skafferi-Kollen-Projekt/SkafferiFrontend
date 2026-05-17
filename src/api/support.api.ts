export type SupportMessage = {
  id: number;
  message: string;
  created_at: string;
  user: {
    email: string;
  };
};

export const createSupportMessage = async (message: string) => {
  const res = await fetch("http://localhost:4000/api/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send support message");
  }

  return res.json();
};

export const getSupportMessagesForAdmin = async (): Promise<
  SupportMessage[]
> => {
  const res = await fetch("http://localhost:4000/api/support/admin", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch support messages");
  }
  return res.json();
};

type UpdateMePayload = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export const updateMe = async (data: UpdateMePayload) => {
  const res = await fetch("http://localhost:4000/api/users/me", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update user");
  }

  return res.json();
};

export const deleteMe = async (email: string) => {
  const res = await fetch("http://localhost:4000/api/users/me", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete account");
  }
};

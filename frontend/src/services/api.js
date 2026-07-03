const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(
  path,
  options = {}
) {
  const headers = {
    ...options.headers,
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
      credentials: "include",
    }
  );

  const data =
    response.status === 204
      ? null
      : await response
          .json()
          .catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;

    const message = Array.isArray(detail)
      ? detail
          .map((item) => item.msg)
          .join("، ")
      : detail || "خطایی رخ داده است";

    throw new ApiError(
      message,
      response.status,
      data
    );
  }

  return data;
}
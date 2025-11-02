import { baseUrl } from "@/constast";
import type { httpRequstType, UserRole } from "@/types/types";

const LoginUser = async (data: { email: string; password: string }) => {
  const response = await fetch(baseUrl + `auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const resData: httpRequstType = await response.json();
  if (!response.ok || response.status >= 300) {
    throw new Error("Failed to login user");
  }
  console.log("Login res", resData);
  return resData.user;
};

const RegisterUser = async (data: {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
}) => {
  let fcmToken;

  const response = await fetch(baseUrl + `auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, fcmToken }),
  });

  const resData: httpRequstType = await response.json();
  if (!response.ok || response.status >= 300) {
    throw new Error("Failed to register user");
  }
  return resData.user;
};

const checkAuth = async () => {
  const response = await fetch(baseUrl + `auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData: httpRequstType = await response.json();
  if (!response.ok || response.status >= 300) {
    throw new Error("user not authenticated, go to login");
  }
  return resData.token ? resData.user : null;
};

const logout = async () => {
  const response = await fetch(baseUrl + `auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData: httpRequstType = await response.json();
  if (!response.ok || response.status >= 300) {
    throw new Error("failed to logout user");
  }
  return resData.data;
};

const getOauthWindow = async () => {
  const response = await fetch(baseUrl + `auth/google`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData: httpRequstType = await response.json();
  console.log("The getOauth res", resData)
  if (!response.ok || response.status >= 300) {
    throw new Error("failed to get OAuth window");
  }
  return resData.data;
};

const getOauthLoginRegister = async (code: string, role: UserRole) => {
  try {
    const response = await fetch(
      baseUrl + `user/oauth/login-register?code=${code}&role=${role}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resData: httpRequstType = await response.json();
    if (!response.ok || response.status >= 300) {
      throw new Error(resData.message || "failed to get OAuth window");
    }
    return resData.data;
  } catch (error) {
    console.log("error:", error);
    throw new Error("Failed to login user, fcmToken is not provided");
  }
};

export {
  LoginUser,
  RegisterUser,
  checkAuth,
  logout,
  getOauthWindow,
  getOauthLoginRegister,
};

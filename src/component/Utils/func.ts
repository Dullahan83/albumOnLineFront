import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const uploadMultiple = async ({
  formData,
  param,
}: {
  formData: FormData;
  param: string;
}) => {
  try {
    const token = sessionStorage.getItem("authToken"); // Récupérer le token du sessionStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/createBatch/${param}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error('Échec de l"envoi');
    }
  } catch (error) {
    console.error('Erreur lors de l"envoi:', error);
    throw new Error(error);
  }
};

export const getPictures = async (albumId: string) => {
  // console.log(albumId, "id in fetch");

  const { signal } = new AbortController();
  try {
    const token = sessionStorage.getItem("authToken"); // Récupérer le token du sessionStorage
    if (!token) return;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/getAll/${albumId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal,
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Échec de la récuperation des images");
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récuperation des images:", error);
    throw new Error(error);
  }
};

export const deletePicture = async ({
  id,
  albumId,
}: {
  id: number;
  albumId: string;
}) => {
  try {
    const token = sessionStorage.getItem("authToken"); // Récupérer le token du sessionStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/deleteOne/${albumId}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error('Échec de l"envoi');
    }
  } catch (error) {
    console.error('Erreur lors de l"envoi:', error);
    throw new Error(error);
  }
};
type UpdatePictureProps = {
  albumId: string;
  body: {
    imageId: number;
    keywords: string;
    legend: string;
    date: string;
  };
};
export const updatePicture = async ({ albumId, body }: UpdatePictureProps) => {
  try {
    const token = sessionStorage.getItem("authToken"); // Récupérer le token du sessionStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/updateOne/${albumId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw new Error('Échec de l"envoi');
    }
  } catch (error) {
    console.error('Erreur lors de l"envoi:', error);
    throw new Error(error);
  }
};

export const getMonth = (date: Date) => {
  return Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
};

export const createAlbum = async (formData: FormData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/album/create`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Échec de la création de l'album");
    }
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    throw new Error(error);
  }
};

export const resetPasswordDemand = async (email: string) => {
  try {
    const body = { email };
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/askingReset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (response.status == 404) {
      throw new Error("Email not found");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la demande de modification de mot de passe:",
      error
    );
    throw new Error(error);
  }
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  const body = { password, token };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) throw new Error();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

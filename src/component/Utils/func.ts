import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const uploadSingle = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("authToken"); // Récupérer le token du localStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/createOne`,
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
  }
};

export const uploadMultiple = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("authToken"); // Récupérer le token du localStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/createBatch`,
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
  }
};

export const getPictures = async () => {
  const { signal } = new AbortController();
  try {
    const token = localStorage.getItem("authToken"); // Récupérer le token du localStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Échec de la récuperation des images");
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récuperation des images:", error);
  }
};

export const deletePicture = async (id: number) => {
  try {
    const token = localStorage.getItem("authToken"); // Récupérer le token du localStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/deleteOne/${id}`,
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
  }
};

export const updatePicture = async (body: {
  imageId: number;
  keywords: string;
  legend: string;
  date: string;
}) => {
  try {
    const token = localStorage.getItem("authToken"); // Récupérer le token du localStorage
    if (!token) throw new Error("Pas de token detecté");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/updateOne`,
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
  }
};

export const getMonth = (date: Date) => {
  return Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
};

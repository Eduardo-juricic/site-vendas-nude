// src/utils/firebaseUtils.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getProdutoDestaque = async () => {
  try {
    const produtosRef = collection(db, "produtos");
    const q = query(produtosRef, where("destaque", "==", true));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data();
      return {
        id: snapshot.docs[0].id,
        ...docData,
        destaque_curto: docData.destaque_curto || "",
      };
    } else {
      return null; // Nenhum produto em destaque encontrado
    }
  } catch (error) {
    console.error("Erro ao buscar produto em destaque:", error);
    return null;
  }
};

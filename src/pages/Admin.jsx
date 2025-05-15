import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../FirebaseConfig"; // Importe o Firestore

const Admin = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: null,
    destaque_curto: "",
    preco_promocional: "", // Novo campo para o preço promocional
  });
  const [editandoId, setEditandoId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [setCloudinaryConfig] = useState({
    cloud_name: "",
    upload_preset: "",
  });

  const produtosRef = collection(db, "produtos");

  const buscarProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProdutos(lista);
  };

  useEffect(() => {
    buscarProdutos();
    const configRef = doc(db, "config", "cloudinary");
    getDoc(configRef).then((docSnap) => {
      if (docSnap.exists()) {
        setCloudinaryConfig(docSnap.data());
      } else {
        console.log("No such document!");
      }
    });
  });

  const handleFileChange = (e) => {
    setForm({ ...form, imagem: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = "";

      if (form.imagem) {
        const formData = new FormData();
        formData.append("file", form.imagem);
        formData.append("upload_preset", "produtos_upload");
        formData.append("folder", "produtos");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dtbvkmxy9/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao enviar imagem para o Cloudinary");
        }

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        imagem: imageUrl,
        destaque_curto: form.destaque_curto,
        preco_promocional: Number(form.preco_promocional), // Salva o preço promocional
      };

      if (editandoId) {
        const ref = doc(db, "produtos", editandoId);
        await updateDoc(ref, produtoData);
        setEditandoId(null);
      } else {
        await addDoc(produtosRef, produtoData);
      }

      setForm({
        nome: "",
        descricao: "",
        preco: "",
        imagem: null,
        destaque_curto: "",
        preco_promocional: "",
      });
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao enviar produto:", error);
    } finally {
      setUploading(false);
    }
  };

  const deletar = async (id) => {
    const ref = doc(db, "produtos", id);
    await deleteDoc(ref);
    buscarProdutos();
  };

  const editar = (produto) => {
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagem: null,
      destaque_curto: produto.destaque_curto,
      preco_promocional: produto.preco_promocional || "", // Preenche o preço promocional
      id: produto.id,
    });
    setEditandoId(produto.id);
  };

  const definirDestaque = async (id) => {
    const produtoParaAtualizar = produtos.find((p) => p.id === id);
    const novoEstadoDestaque = !produtoParaAtualizar?.destaque;

    const snapshot = await getDocs(produtosRef);
    const updates = {};
    snapshot.docs.forEach((doc) => {
      if (doc.data().destaque === true && doc.id !== id) {
        updates[doc.id] = { destaque: false };
      }
    });

    updates[id] = { destaque: novoEstadoDestaque };

    await Promise.all(
      Object.keys(updates).map((docId) => {
        const ref = doc(db, "produtos", docId);
        return updateDoc(ref, updates[docId]);
      })
    );

    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) => ({
        ...produto,
        destaque: produto.id === id ? novoEstadoDestaque : false,
      }))
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Painel Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <textarea
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Preço Promocional (opcional)"
          value={form.preco_promocional}
          onChange={(e) =>
            setForm({ ...form, preco_promocional: e.target.value })
          }
          className="border p-2 w-full"
        />
        <textarea
          type="text"
          placeholder="Caracteristicas (Separe cada uma com ; )"
          value={form.destaque_curto}
          onChange={(e) => setForm({ ...form, destaque_curto: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full"
          required={!editandoId} // A imagem só é obrigatória ao adicionar
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={uploading}
        >
          {uploading
            ? "Enviando..."
            : editandoId
            ? "Atualizar Produto"
            : "Adicionar Produto"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Produtos cadastrados</h2>
      {produtos.map((produto) => (
        <div
          key={produto.id}
          className="border p-4 mb-2 rounded shadow flex items-center justify-between"
        >
          <div className="flex items-center">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="h-20 w-20 object-cover mr-4 rounded"
            />
            <div>
              <h3 className="font-bold">{produto.nome}</h3>
              {produto.destaque_curto && (
                <p className="text-sm text-gray-500 italic">
                  {produto.destaque_curto}
                </p>
              )}{" "}
              <p>{produto.descricao}</p>
              <p className="text-green-600 font-semibold">
                R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}
              </p>
              {produto.preco_promocional > 0 &&
                produto.preco_promocional < produto.preco && (
                  <p className="text-red-500 line-through text-sm">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                )}
              {produto.preco_promocional > 0 &&
                produto.preco_promocional < produto.preco && (
                  <p className="text-xl font-bold text-orange-500">
                    R$ {produto.preco_promocional.toFixed(2)}
                  </p>
                )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editar(produto)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => deletar(produto.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Excluir
            </button>
            <button
              onClick={() => definirDestaque(produto.id)}
              className={`px-3 py-1 rounded ${
                produto.destaque
                  ? "bg-indigo-700 text-white"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              {produto.destaque ? "Em Destaque" : "Definir Destaque"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;

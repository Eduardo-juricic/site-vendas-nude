// admin.jsx
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
import { db } from "../firebaseConfig"; // Importe o Firestore

const Admin = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: null, // Alterado para armazenar o arquivo
    destaque_curto: "", // Novo campo para a frase de destaque
  });
  const [editandoId, setEditandoId] = useState(null);
  const [uploading, setUploading] = useState(false); // Novo estado para controlar o upload
  const [setCloudinaryConfig] = useState({
    cloud_name: "",
    upload_preset: "",
  });

  const produtosRef = collection(db, "produtos");

  // Buscar todos os produtos
  const buscarProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProdutos(lista);
  };

  useEffect(() => {
    buscarProdutos();
    //get config cloudinary from firestore
    const configRef = doc(db, "config", "cloudinary");
    getDoc(configRef).then((docSnap) => {
      // Use getDoc
      if (docSnap.exists()) {
        setCloudinaryConfig(docSnap.data());
      } else {
        console.log("No such document!");
      }
    });
  });

  const handleFileChange = (e) => {
    // Atualiza o estado do formulário com o arquivo selecionado
    setForm({ ...form, imagem: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // Inicia o upload

    try {
      let imageUrl = ""; // Inicializa imageUrl

      if (form.imagem) {
        // Envia a imagem para o Cloudinary
        const formData = new FormData();
        formData.append("file", form.imagem);
        formData.append("upload_preset", "produtos_upload");
        formData.append("folder", "produtos"); // Opcional: Organiza no Cloudinary

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
        imageUrl = data.secure_url; // Obtém a URL da imagem
      }

      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        imagem: imageUrl,
        destaque_curto: form.destaque_curto, // Salva o novo campo
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
      });
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao enviar produto:", error);
      // Tratar o erro (exibir mensagem para o usuário)
    } finally {
      setUploading(false); // Finaliza o upload, independentemente do resultado
    }
  };

  const deletar = async (id) => {
    const ref = doc(db, "produtos", id);
    await deleteDoc(ref);
    buscarProdutos();
  };

  const editar = (produto) => {
    setForm(produto);
    setEditandoId(produto.id);
  };

  const definirDestaque = async (id) => {
    const produtoParaAtualizar = produtos.find((p) => p.id === id);
    const novoEstadoDestaque = !produtoParaAtualizar?.destaque; // Inverte o estado atual

    // Desmarca todos os outros produtos
    const snapshot = await getDocs(produtosRef);
    const updates = {};
    snapshot.docs.forEach((doc) => {
      if (doc.data().destaque === true && doc.id !== id) {
        updates[doc.id] = { destaque: false };
      }
    });

    // Marca/desmarca o produto selecionado
    updates[id] = { destaque: novoEstadoDestaque };

    // Aplica todas as atualizações
    await Promise.all(
      Object.keys(updates).map((docId) => {
        const ref = doc(db, "produtos", docId);
        return updateDoc(ref, updates[docId]);
      })
    );

    // Atualiza o estado local imediatamente
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) => ({
        ...produto,
        destaque: produto.id === id ? novoEstadoDestaque : false, // Define o clicado e desmarca os outros
      }))
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Painel Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
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
          type="text"
          placeholder="Destaque Curto (ex: Ingredientes)"
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
              {/* Exibe o destaque curto na lista */}
              <p>{produto.descricao}</p>
              <p className="text-green-600 font-semibold">
                R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}
              </p>
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

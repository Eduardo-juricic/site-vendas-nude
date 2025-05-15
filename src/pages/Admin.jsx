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
import { db, auth } from "../FirebaseConfig"; // Importe o 'auth'
import { signOut } from "firebase/auth"; // Importe o 'signOut' para a função de logout
import { useNavigate } from "react-router-dom"; // Importe o 'useNavigate' para redirecionar

const Admin = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: null,
    destaque_curto: "",
    preco_promocional: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloud_name: "",
    upload_preset: "",
  });

  const navigate = useNavigate();
  const produtosRef = collection(db, "produtos");

  const buscarProdutos = async () => {
    const snapshot = await getDocs(produtosRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProdutos(lista);
  };

  // Função de Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();

    const configRef = doc(db, "config", "cloudinary");
    getDoc(configRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setCloudinaryConfig(docSnap.data()); // Atualiza o estado com a configuração
        } else {
          console.log(
            "No such document! (config/cloudinary) - Por favor, crie este documento no Firestore."
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar config do Cloudinary:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    setForm({ ...form, imagem: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = "";

      // Verifica se há uma imagem para upload
      if (form.imagem) {
        const formData = new FormData();
        formData.append("file", form.imagem);
        formData.append(
          "upload_preset",
          cloudinaryConfig.upload_preset || "produtos_upload"
        ); // Usar a preset do estado
        formData.append("folder", "produtos"); // Definir uma pasta no Cloudinary

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            cloudinaryConfig.cloud_name || "dtbvkmxy9"
          }/image/upload`, // Usar o cloud_name do estado
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
      } else if (editandoId) {
        // Se estiver editando e não enviou uma nova imagem, mantém a URL da imagem existente
        const produtoExistente = produtos.find((p) => p.id === editandoId);
        imageUrl = produtoExistente ? produtoExistente.imagem : "";
      }

      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        imagem: imageUrl, // Salva a URL da imagem
        destaque_curto: form.destaque_curto,
        preco_promocional: Number(form.preco_promocional),
      };

      if (editandoId) {
        const ref = doc(db, "produtos", editandoId);
        await updateDoc(ref, produtoData);
        setEditandoId(null);
      } else {
        await addDoc(produtosRef, produtoData);
      }

      // Limpa o formulário após o envio/atualização
      setForm({
        nome: "",
        descricao: "",
        preco: "",
        imagem: null, // Limpa o arquivo selecionado
        destaque_curto: "",
        preco_promocional: "",
      });
      buscarProdutos(); // Recarrega a lista de produtos
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
      imagem: null, // Não pré-preenche o campo de arquivo, pois é um FileList
      destaque_curto: produto.destaque_curto,
      preco_promocional: produto.preco_promocional || "",
      id: produto.id, // Guarda o ID para a edição
    });
    setEditandoId(produto.id);
  };

  const definirDestaque = async (id) => {
    const produtoParaAtualizar = produtos.find((p) => p.id === id);
    const novoEstadoDestaque = !produtoParaAtualizar?.destaque;

    // Primeiro, desativa o destaque de todos os outros produtos
    const updates = {};
    produtos.forEach((p) => {
      if (p.destaque && p.id !== id) {
        updates[p.id] = { destaque: false };
      }
    });

    // Depois, define o novo estado de destaque para o produto clicado
    updates[id] = { destaque: novoEstadoDestaque };

    await Promise.all(
      Object.keys(updates).map((docId) => {
        const ref = doc(db, "produtos", docId);
        return updateDoc(ref, updates[docId]);
      })
    );

    // Atualiza o estado local para refletir as mudanças
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) => ({
        ...produto,
        destaque: produto.id === id ? novoEstadoDestaque : false, // Apenas um pode ser destaque
      }))
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Painel Admin</h1>

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mb-6 hover:bg-red-700 transition-colors duration-200"
      >
        Sair
      </button>

      {/* --- Formulário de Adição/Edição de Produto --- */}
      <form
        onSubmit={handleSubmit}
        className="space-y-2 mb-6 p-4 border rounded shadow-sm bg-white"
      >
        <h2 className="text-xl font-semibold mb-3">
          {editandoId ? "Editar Produto" : "Adicionar Novo Produto"}
        </h2>
        <textarea
          type="text"
          placeholder="Nome do Produto"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Descrição detalhada do produto"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className="border p-2 w-full rounded h-24 resize-y"
          required
        />
        <input
          type="number"
          placeholder="Preço (ex: 99.99)"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="border p-2 w-full rounded"
          step="0.01" // Permite números decimais
          required
        />
        <input
          type="number"
          placeholder="Preço Promocional (opcional, ex: 79.99)"
          value={form.preco_promocional}
          onChange={(e) =>
            setForm({ ...form, preco_promocional: e.target.value })
          }
          className="border p-2 w-full rounded"
          step="0.01" // Permite números decimais
        />
        <textarea
          type="text"
          placeholder="Características Principais (Separe cada uma com ;)"
          value={form.destaque_curto}
          onChange={(e) => setForm({ ...form, destaque_curto: e.target.value })}
          className="border p-2 w-full rounded h-20 resize-y"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">
          Imagem do Produto:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required={!editandoId && !form.imagem} // A imagem só é obrigatória ao adicionar ou se não houver imagem existente em edição
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          disabled={uploading}
        >
          {uploading
            ? "Enviando Imagem..."
            : editandoId
            ? "Atualizar Produto"
            : "Adicionar Produto"}
        </button>
        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setForm({
                nome: "",
                descricao: "",
                preco: "",
                imagem: null,
                destaque_curto: "",
                preco_promocional: "",
              });
            }}
            className="bg-gray-400 text-white w-full py-2 rounded mt-2 hover:bg-gray-500 transition-colors duration-200"
          >
            Cancelar Edição
          </button>
        )}
      </form>

      {/* --- Lista de Produtos Cadastrados --- */}
      <h2 className="text-xl font-semibold mb-3">Produtos Cadastrados</h2>
      {produtos.length === 0 && (
        <p className="text-gray-600">Nenhum produto cadastrado ainda.</p>
      )}
      <div className="space-y-4">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="border p-4 rounded shadow-md flex flex-col md:flex-row items-start md:items-center justify-between bg-white"
          >
            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
              {produto.imagem && (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-24 w-24 object-cover mr-4 rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{produto.nome}</h3>
                {produto.destaque_curto && (
                  <p className="text-sm text-gray-500 italic mb-1">
                    {produto.destaque_curto}
                  </p>
                )}
                <p className="text-gray-700 text-sm mb-1">
                  {produto.descricao}
                </p>
                {produto.preco_promocional > 0 &&
                produto.preco_promocional < produto.preco ? (
                  <div className="flex items-center">
                    <p className="text-red-500 line-through text-sm mr-2">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                    <p className="text-xl font-bold text-orange-600">
                      R$ {produto.preco_promocional.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-700 font-semibold text-lg">
                    R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
              <button
                onClick={() => editar(produto)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => deletar(produto.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Excluir
              </button>
              <button
                onClick={() => definirDestaque(produto.id)}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  produto.destaque
                    ? "bg-indigo-700 text-white hover:bg-indigo-800"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                {produto.destaque ? "Em Destaque" : "Definir Destaque"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

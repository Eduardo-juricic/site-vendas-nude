// functions/index.js

// TENTATIVA COM SDK /v2 explícito. Se der erro de módulo não encontrado,
// mude para const functions = require("firebase-functions");
const functions = require("firebase-functions/v2/https"); // Para https.onCall e https.onRequest da v2
const { setGlobalOptions } = require("firebase-functions/v2"); // Para definir opções globais como região
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions"); // Logger da v2

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Definir opções globais para todas as funções (região, etc.) para 2ª Geração
setGlobalOptions({
  region: "southamerica-east1",
  memory: "256MiB",
  timeoutSeconds: 60,
});

// --- Lógica de Configuração do Access Token (USANDO VALORES INJETADOS PELOS SECRETS) ---
const PROD_SECRET_NAME = "MERCADOPAGO_ACCESS_TOKEN_PROD";
const TEST_SECRET_NAME = "MERCADOPAGO_ACCESS_TOKEN_TEST";

const PROD_ACCESS_TOKEN_FROM_SECRET = process.env[PROD_SECRET_NAME];
const TEST_ACCESS_TOKEN_FROM_SECRET = process.env[TEST_SECRET_NAME];

const TEST_ACCESS_TOKEN_FALLBACK =
  "TEST-2041651583950402-051909-c6b895278dbff8c34731dd86d4c95c67-98506488";

let CHAVE_ACESSO_MP_A_SER_USADA;
let idempotencyKeyBase = Date.now().toString();

logger.info(
  `Tentando ler secrets: PROD_SECRET_NAME (${PROD_SECRET_NAME}) valor: ${
    PROD_ACCESS_TOKEN_FROM_SECRET ? "Definido" : "NÃO DEFINIDO"
  }`
);
logger.info(
  `Tentando ler secrets: TEST_SECRET_NAME (${TEST_SECRET_NAME}) valor: ${
    TEST_ACCESS_TOKEN_FROM_SECRET ? "Definido" : "NÃO DEFINIDO"
  }`
);

// ===== INÍCIO DA MODIFICAÇÃO TEMPORÁRIA PARA TESTE =====
// Forçar token de teste se o secret de teste estiver disponível, ou usar fallback.
if (TEST_ACCESS_TOKEN_FROM_SECRET && process.env.K_SERVICE) {
  // K_SERVICE indica ambiente Cloud Run
  CHAVE_ACESSO_MP_A_SER_USADA = TEST_ACCESS_TOKEN_FROM_SECRET;
  logger.info(
    "FORÇADO PARA TESTE: Usando Access Token de TESTE do Mercado Pago (via Secret Manager)."
  );
} else {
  // Se o secret de teste não for lido (ou se não estiver no Cloud Run, ex: emulador)
  CHAVE_ACESSO_MP_A_SER_USADA = TEST_ACCESS_TOKEN_FALLBACK;
  logger.info(
    "FORÇADO PARA TESTE: Usando Access Token de TESTE do Mercado Pago (fallback hardcoded)."
  );
  if (process.env.K_SERVICE && !TEST_ACCESS_TOKEN_FROM_SECRET) {
    logger.warn(
      "ATENÇÃO (TESTE): Rodando no Cloud Run, mas o SECRET de TESTE não foi lido. Usando fallback para teste."
    );
  } else if (!process.env.K_SERVICE) {
    // Se não estiver no Cloud Run, provavelmente é emulador local
    logger.info("Rodando localmente/emulador, usando fallback de teste.");
  }
}
// ===== FIM DA MODIFICAÇÃO TEMPORÁRIA PARA TESTE =====

if (!CHAVE_ACESSO_MP_A_SER_USADA) {
  const errorMsg =
    "ERRO CRÍTICO: NENHUM ACCESS TOKEN DO MERCADO PAGO FOI CONFIGURADO OU SELECIONADO.";
  logger.error(errorMsg);
  throw new Error(errorMsg);
} else {
  logger.info(
    "Access Token do Mercado Pago selecionado para uso (início):",
    CHAVE_ACESSO_MP_A_SER_USADA.substring(0, 8) + "..."
  );
}

const client = new MercadoPagoConfig({
  accessToken: CHAVE_ACESSO_MP_A_SER_USADA,
  options: { timeout: 7000 },
});
logger.info("Cliente MercadoPagoConfig inicializado.");
// --- Fim da Lógica de Configuração ---

// --- DEFINIÇÃO DAS FUNÇÕES ---
const commonFunctionOptions = {
  secrets: [PROD_SECRET_NAME, TEST_SECRET_NAME],
};

exports.createPaymentPreference = functions.onCall(
  commonFunctionOptions,
  async (request) => {
    const data = request.data;
    const auth = request.auth;
    logger.info(
      "Função createPaymentPreference (v2) chamada com dados:",
      data,
      { auth }
    );
    const { items, payerInfo, externalReference, backUrls, notificationUrl } =
      data;
    if (!items || !Array.isArray(items) || items.length === 0) {
      logger.error(
        "Erro em createPaymentPreference: Lista de itens vazia ou inválida."
      );
      throw new functions.HttpsError(
        "invalid-argument",
        "A lista de 'items' é obrigatória e não pode estar vazia."
      );
    }
    if (!payerInfo || !payerInfo.email) {
      logger.error("Erro em createPaymentPreference: payerInfo.email ausente.");
      throw new functions.HttpsError(
        "invalid-argument",
        "As 'payerInfo' com 'email' são obrigatórias."
      );
    }
    const preferenceRequest = {
      items: items.map((item) => ({
        id: String(item.id || "item-default-id"),
        title: String(item.title || "Produto"),
        description: String(item.description || item.title),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "BRL",
      })),
      payer: {
        name: String(payerInfo.name || "Comprador"),
        surname: String(payerInfo.surname || ""),
        email: String(payerInfo.email),
      },
      back_urls: {
        success: String(backUrls.success),
        failure: String(backUrls.failure),
        pending: String(backUrls.pending || backUrls.success),
      },
      auto_return: "approved",
      external_reference: String(externalReference),
      notification_url: String(notificationUrl),
    };
    logger.info(
      "Construindo preferência (v2) com:",
      JSON.stringify(preferenceRequest, null, 2)
    );
    try {
      const preference = new Preference(client);
      const requestOptions = {
        idempotencyKey: `${idempotencyKeyBase}-${externalReference}-${Date.now()}`,
      };
      const response = await preference.create({
        body: preferenceRequest,
        requestOptions,
      });
      logger.info("Preferência (v2) criada! ID:", response.id);
      return { id: response.id, init_point: response.init_point };
    } catch (error) {
      logger.error("Erro ao criar preferência MP (v2):", error);
      let errorMessage = "Falha ao criar preferência MP.";
      if (error.cause) {
        const causeError = error.cause;
        if (Array.isArray(causeError)) {
          errorMessage = causeError
            .map(
              (c) => `Code ${c.code || "N/A"}: ${c.description || c.message}`
            )
            .join("; ");
        } else if (causeError.message) {
          errorMessage = causeError.message;
        } else {
          errorMessage = JSON.stringify(causeError);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new functions.HttpsError("internal", errorMessage, error.message);
    }
  }
);

exports.processPaymentNotification = functions.onRequest(
  commonFunctionOptions,
  async (req, res) => {
    logger.info("Função processPaymentNotification (v2) chamada.");
    if (req.method !== "POST") {
      logger.warn("processPaymentNotification: Não é POST.");
      return res.status(405).send("Method Not Allowed.");
    }
    const type = req.body.type;
    const paymentIdFromBody = req.body.data ? req.body.data.id : null;
    let paymentIdToProcess = null;
    if (type === "payment" && paymentIdFromBody) {
      paymentIdToProcess = paymentIdFromBody;
    } else if (req.query.topic === "payment" && req.query.id) {
      paymentIdToProcess = req.query.id;
    } else if (req.query.type === "payment" && req.query.id) {
      paymentIdToProcess = req.query.id;
    }

    if (paymentIdToProcess) {
      try {
        const payment = new Payment(client);
        const paymentDetails = await payment.get({
          id: String(paymentIdToProcess),
        });
        if (paymentDetails) {
          const paymentData = paymentDetails;
          const status = paymentData.status;
          const externalReference = paymentData.external_reference;
          if (externalReference) {
            const pedidoRef = admin
              .firestore()
              .collection("pedidos")
              .doc(externalReference);
            await pedidoRef.update({
              statusPagamentoMP: status,
              paymentIdMP: String(paymentIdToProcess),
              dadosCompletosPagamentoMP: paymentData,
              ultimaAtualizacaoWebhook:
                admin.firestore.FieldValue.serverTimestamp(),
            });
            logger.info(
              `Pedido ${externalReference} (v2) atualizado para status: ${status}.`
            );
            if (status === "approved") {
              logger.info(
                `Pagamento APROVADO (v2) para o pedido ${externalReference}.`
              );
            }
          } else {
            logger.warn(
              `Pagamento ${paymentIdToProcess} (v2) sem external_reference.`
            );
          }
        } else {
          logger.error(
            `Não foi possível obter detalhes (v2) para o pagamento ID: ${paymentIdToProcess}.`
          );
        }
        return res.status(200).send("OK. Notificação (v2) processada.");
      } catch (error) {
        logger.error(
          `Erro ao processar notificação (v2) para ${paymentIdToProcess}. Erro:`,
          error
        );
        let errorMessage = "Erro interno.";
        if (error.cause) {
          const causeError = error.cause;
          if (Array.isArray(causeError)) {
            errorMessage = causeError
              .map(
                (c) => `Code ${c.code || "N/A"}: ${c.description || c.message}`
              )
              .join("; ");
          } else if (causeError.message) {
            errorMessage = causeError.message;
          } else {
            errorMessage = JSON.stringify(causeError);
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        return res.status(500).send(errorMessage);
      }
    } else {
      logger.info(
        "Notificação (v2) recebida, mas não processada (tipo/id inválido). Query:",
        req.query,
        "Body:",
        req.body
      );
      return res
        .status(200)
        .send("Notificação (v2) recebida, mas não processada.");
    }
  }
);
logger.info(
  "Arquivo functions/index.js (v2 com secrets) carregado e funções exportadas."
);

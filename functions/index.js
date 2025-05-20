// functions/index.js

const functions = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

setGlobalOptions({
  region: "southamerica-east1",
  memory: "256MiB",
  timeoutSeconds: 60,
});

// --- INÍCIO DA LÓGICA DE CONFIGURAÇÃO DO ACCESS TOKEN ATUALIZADA ---
const PROD_SECRET_NAME = "MERCADOPAGO_ACCESS_TOKEN_PROD";
const TEST_SECRET_NAME = "MERCADOPAGO_ACCESS_TOKEN_TEST";

const PROD_ACCESS_TOKEN_FROM_SECRET = process.env[PROD_SECRET_NAME];
const TEST_ACCESS_TOKEN_FROM_SECRET = process.env[TEST_SECRET_NAME];

// Seu Access Token de TESTE fornecido, usado como fallback para o emulador local se o secret não estiver configurado
const YOUR_PROVIDED_TEST_ACCESS_TOKEN =
  "TEST-2041651583950402-051909-c6b895278dbff8c34731dd86d4c95c67-98506488";

let CHAVE_ACESSO_MP_A_SER_USADA;
let idempotencyKeyBase = Date.now().toString();

// Verifica se está rodando no ambiente de produção do Google Cloud (2ª Geração usa K_SERVICE)
const isProductionEnvironment = !!process.env.K_SERVICE; // `!!` converte para booleano
// Verifica se está rodando no Emulador do Firebase
const isEmulatorEnvironment = process.env.FUNCTIONS_EMULATOR === "true";

logger.info(
  `DETECÇÃO DE AMBIENTE: isProductionEnvironment=${isProductionEnvironment}, isEmulatorEnvironment=${isEmulatorEnvironment}`
);
logger.info(
  `Leitura do Secret PROD (${PROD_SECRET_NAME}): ${
    PROD_ACCESS_TOKEN_FROM_SECRET
      ? "Definido (" + PROD_ACCESS_TOKEN_FROM_SECRET.substring(0, 8) + "...)"
      : "NÃO DEFINIDO OU NÃO ACESSÍVEL NESTE MOMENTO (normal durante deploy inicial do secret)"
  }`
);
logger.info(
  `Leitura do Secret TEST (${TEST_SECRET_NAME}): ${
    TEST_ACCESS_TOKEN_FROM_SECRET
      ? "Definido (" + TEST_ACCESS_TOKEN_FROM_SECRET.substring(0, 8) + "...)"
      : "NÃO DEFINIDO OU NÃO ACESSÍVEL NESTE MOMENTO"
  }`
);

if (isProductionEnvironment) {
  if (PROD_ACCESS_TOKEN_FROM_SECRET) {
    CHAVE_ACESSO_MP_A_SER_USADA = PROD_ACCESS_TOKEN_FROM_SECRET;
    logger.info(
      "MODO PRODUÇÃO: Usando Access Token de PRODUÇÃO do Mercado Pago (via Secret Manager)."
    );
  } else {
    const errorMsg = `ERRO CRÍTICO: Rodando em AMBIENTE DE PRODUÇÃO (K_SERVICE=${process.env.K_SERVICE}) mas o ACCESS TOKEN DE PRODUÇÃO ('${PROD_SECRET_NAME}') não foi lido do Secret Manager. VERIFIQUE SE O SECRET EXISTE, TEM O NOME CORRETO E SE A FUNÇÃO TEM PERMISSÃO PARA ACESSÁ-LO.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
} else if (isEmulatorEnvironment) {
  if (TEST_ACCESS_TOKEN_FROM_SECRET) {
    CHAVE_ACESSO_MP_A_SER_USADA = TEST_ACCESS_TOKEN_FROM_SECRET;
    logger.info(
      "MODO EMULADOR LOCAL: Usando Access Token de TESTE do Mercado Pago (via Secret Manager)."
    );
  } else {
    CHAVE_ACESSO_MP_A_SER_USADA = YOUR_PROVIDED_TEST_ACCESS_TOKEN; // Usa o seu token de teste fornecido
    logger.warn(
      `AVISO (EMULADOR LOCAL): Secret ('${TEST_SECRET_NAME}') não lido ou não configurado para o emulador. Usando Access Token de TESTE hardcoded. Para melhor prática, configure o secret de teste se desejar.`
    );
  }
} else {
  // Fallback para outros ambientes locais não claramente identificados (ex: 'node index.js' diretamente)
  logger.warn(
    "AVISO: Ambiente não identificado como Produção (sem K_SERVICE) ou Emulador Firebase (sem FUNCTIONS_EMULATOR=true). Usando Access Token de TESTE hardcoded como fallback. Verifique a configuração do ambiente se isso não for o esperado."
  );
  CHAVE_ACESSO_MP_A_SER_USADA = YOUR_PROVIDED_TEST_ACCESS_TOKEN; // Usa o seu token de teste fornecido
}

if (!CHAVE_ACESSO_MP_A_SER_USADA) {
  const errorMsg =
    "ERRO CRÍTICO: NENHUM ACCESS TOKEN DO MERCADO PAGO FOI CONFIGURADO ADEQUADAMENTE PARA O AMBIENTE ATUAL APÓS A LÓGICA DE SELEÇÃO.";
  logger.error(errorMsg);
  throw new Error(errorMsg);
} else {
  logger.info(
    "Access Token do Mercado Pago FINALMENTE selecionado para uso (início):",
    CHAVE_ACESSO_MP_A_SER_USADA.substring(0, 8) + "..."
  );
}

const client = new MercadoPagoConfig({
  accessToken: CHAVE_ACESSO_MP_A_SER_USADA,
  options: { timeout: 7000 },
});
logger.info("Cliente MercadoPagoConfig inicializado com o token selecionado.");
// --- FIM DA LÓGICA DE CONFIGURAÇÃO DO ACCESS TOKEN ATUALIZADA ---

// --- DEFINIÇÃO DAS FUNÇÕES ---
const commonFunctionOptions = {
  secrets: [PROD_SECRET_NAME, TEST_SECRET_NAME], // Garante que as funções têm acesso aos secrets
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
      logger.info(
        "Preferência (v2) criada! ID:",
        response.id,
        "Init Point:",
        response.init_point
          ? response.init_point.substring(0, 30) + "..."
          : "N/A"
      );
      return { id: response.id, init_point: response.init_point };
    } catch (error) {
      logger.error(
        "Erro ao criar preferência MP (v2):",
        error.message,
        error.cause ? error.cause : error.stack
      );
      let errorMessage = "Falha ao criar preferência MP.";
      if (error.cause && Array.isArray(error.cause)) {
        // Mercado Pago SDK v3 costuma ter 'cause' como array
        errorMessage = error.cause
          .map(
            (c) =>
              `Code ${c.code || "N/A"}: ${
                c.description || c.message || JSON.stringify(c)
              }`
          )
          .join("; ");
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new functions.HttpsError(
        "internal",
        errorMessage,
        error.cause || error.message
      );
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
      // Formato de notificação antigo ou alternativo
      paymentIdToProcess = req.query.id;
    } else if (req.query.type === "payment" && req.query.data?.id) {
      // Outro formato possível
      paymentIdToProcess = req.query.data.id;
    }

    logger.info(
      "Notificação Recebida - Tipo:",
      type,
      "ID do Body:",
      paymentIdFromBody,
      "Query:",
      req.query,
      "ID a Processar:",
      paymentIdToProcess
    );

    if (paymentIdToProcess) {
      try {
        const payment = new Payment(client); // USA O MESMO 'client' CONFIGURADO ACIMA
        const paymentDetails = await payment.get({
          id: String(paymentIdToProcess),
        });

        logger.info(
          "Detalhes do pagamento obtidos:",
          paymentDetails
            ? `Status: ${paymentDetails.status}, Ref Ext: ${paymentDetails.external_reference}`
            : "Não foi possível obter detalhes."
        );

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
              dadosCompletosPagamentoMP: paymentData, // Salva todos os dados do pagamento
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
              // AQUI VOCÊ PODERIA ADICIONAR LÓGICAS ADICIONAIS PARA PAGAMENTO APROVADO
              // Ex: Enviar email de confirmação, liberar acesso a conteúdo digital, etc.
            }
          } else {
            logger.warn(
              `Pagamento ${paymentIdToProcess} (v2) sem external_reference nos detalhes obtidos. Body original:`,
              req.body
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
          error.message,
          error.cause ? error.cause : error.stack
        );
        let errorMessage = "Erro interno ao processar notificação.";
        if (error.cause && Array.isArray(error.cause)) {
          errorMessage = error.cause
            .map(
              (c) =>
                `Code ${c.code || "N/A"}: ${
                  c.description || c.message || JSON.stringify(c)
                }`
            )
            .join("; ");
        } else if (error.message) {
          errorMessage = error.message;
        }
        return res.status(500).send(errorMessage);
      }
    } else {
      logger.info(
        "Notificação (v2) recebida, mas não foi possível determinar o ID do pagamento para processamento. Query:",
        req.query,
        "Body:",
        req.body
      );
      return res
        .status(200) // Mercado Pago espera 200 para não reenviar, mesmo que não processemos
        .send(
          "Notificação (v2) recebida, mas ID do pagamento não identificado para processamento."
        );
    }
  }
);
logger.info(
  "Arquivo functions/index.js (v2 com secrets) carregado e funções exportadas."
);

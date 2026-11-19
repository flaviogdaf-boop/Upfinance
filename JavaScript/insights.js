
/*
  UPFINANCE — PROTÓTIPO INTERATIVO

  Funciona no navegador, sem servidor ou API.

  O professor financeiro usa respostas programadas.
  A conexão bancária é uma simulação.
  Os dados de demonstração são fictícios.
*/

(() => {
  "use strict";

  const DB = "upfinance_db";
  const BACKUP = "upfinance_demo_backup_v1";

  const $ = id => document.getElementById(id);

  const money = n =>
    Number(n || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  const create = (tag, cls, content) => {
    const e = document.createElement(tag);

    if (cls) e.className = cls;
    if (content !== undefined) e.textContent = content;

    return e;
  };

  const clean = text =>
    String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const todayMonth = () => {
    const d = new Date();

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const backMonth = ym => {
    const [y, m] = ym.split("-").map(Number);

    return `${m === 1 ? y - 1 : y}-${
      String(m === 1 ? 12 : m - 1).padStart(2, "0")
    }`;
  };

  const dateOf = (ym, day) =>
    `${ym}-${String(day).padStart(2, "0")}`;

  const getState = () => {
    try {
      return JSON.parse(
        localStorage.getItem(DB)
      ) || {};
    } catch {
      return {};
    }
  };

  const demoEnabled = () =>
    localStorage.getItem(BACKUP) !== null;

  // DADOS FINANCEIROS FICTÍCIOS

  function sampleTransactions() {
    const now = todayMonth();
    const before = backMonth(now);

    const data = [
      [now, 2, "Salário de exemplo", 3500, "in", "Geral"],
      [now, 3, "Moradia", 1200, "out", "Geral"],
      [now, 6, "Supermercado", 450, "out", "Alimentação"],
      [now, 8, "Transporte", 280, "out", "Transporte"],
      [now, 12, "Restaurante", 230, "out", "Alimentação"],
      [now, 16, "Lazer", 200, "out", "Lazer"],
      [now, 18, "Curso", 300, "out", "Educação"],
      [now, 20, "Outros gastos", 120, "out", "Geral"],

      [before, 2, "Salário de exemplo", 3400, "in", "Geral"],
      [before, 3, "Moradia", 1150, "out", "Geral"],
      [before, 6, "Supermercado", 380, "out", "Alimentação"],
      [before, 8, "Transporte", 300, "out", "Transporte"],
      [before, 11, "Restaurante", 140, "out", "Alimentação"],
      [before, 16, "Lazer", 400, "out", "Lazer"],
      [before, 18, "Curso", 250, "out", "Educação"],
      [before, 20, "Outros gastos", 180, "out", "Geral"]
    ];

    return data.map(
      ([m, d, desc, amount, kind, category], i) => ({
        id: 810000 + i,
        date: dateOf(m, d),
        desc,
        amount,
        kind,
        category
      })
    );
  }

  // ATIVAR E DESATIVAR DEMONSTRAÇÃO

  function toggleDemo() {
    if (demoEnabled()) {
      const original = localStorage.getItem(BACKUP);

      if (original === "__EMPTY__") {
        localStorage.removeItem(DB);
      } else {
        localStorage.setItem(DB, original);
      }

      localStorage.removeItem(BACKUP);
      location.reload();
      return;
    }

    const confirmDemo = confirm(
      "Carregar dados fictícios para a apresentação? " +
      "Seus dados atuais serão guardados e poderão ser restaurados."
    );

    if (!confirmDemo) return;

    const raw = localStorage.getItem(DB);

    localStorage.setItem(
      BACKUP,
      raw === null ? "__EMPTY__" : raw
    );

    const s = getState();

    s.transactions = sampleTransactions();

    s.goal = {
      name: "Reserva para estudos",
      value: 2000
    };

    s.user = {
      ...(s.user || {}),
      name: "Visitante",
      track: "teens"
    };

    s.lessonsRead = [
      "teens-1",
      "teens-2",
      "teens-3"
    ];

    s.points = 120;

    s.completedMissions = {
      register: true,
      goal: true,
      invest: true
    };

    s.simulated = true;

    localStorage.setItem(DB, JSON.stringify(s));

    location.reload();
  }

  // ESTILOS DO PROTÓTIPO

  function installStyles() {
    if ($("upProtoStyles")) return;

    const sheet = create("style");
    sheet.id = "upProtoStyles";

    sheet.textContent = `
      .updemo-banner {
        background: #fff8e6;
        border: 1px solid #ead397;
        padding: 16px 19px;
        border-radius: 14px;
        margin: 16px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .updemo-banner strong {
        display: block;
        color: #7a5416;
        margin-bottom: 3px;
      }

      .updemo-banner p {
        margin: 0;
        color: #725c37;
        font-size: 12px;
      }

      .updemo-btn,
      .upproto-btn {
        border: 1px solid #b7d3c9;
        border-radius: 10px;
        background: #fff;
        color: #195d49;
        padding: 10px 13px;
        cursor: pointer;
        font: 700 13px 'DM Sans', sans-serif;
      }

      .updemo-btn:hover,
      .upproto-btn:hover {
        background: #e5f5ed;
      }

      .upproto-primary {
        background: #17664e;
        color: white;
        border-color: #17664e;
      }

      .upproto-primary:hover {
        background: #124d3b;
      }

      .upproto {
        margin: 22px 0;
        padding: 23px;
        border: 1px solid #d4e7e1;
        border-radius: 17px;
        background: white;
        box-shadow: 0 8px 24px #15394b0a;
      }

      .upproto h3 {
        margin: 6px 0 10px;
        font-size: 22px;
      }

      .upproto p {
        color: #536879;
        line-height: 1.7;
      }

      .upproto small {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1px;
        color: #167a5d;
      }

      .upproto-note {
        font-size: 12px !important;
        color: #657b8a !important;
      }

      .upproto-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .upproto-chat {
        background: linear-gradient(
          120deg,
          #eefaf5,
          #fff 78%
        );
      }

      .upproto-messages {
        height: 270px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 11px;
        padding: 13px;
        background: white;
        border: 1px solid #e4ebe9;
        border-radius: 12px;
      }

      .upproto-bubble {
        max-width: 93%;
        padding: 12px 14px;
        line-height: 1.65;
        white-space: pre-line;
        overflow-wrap: anywhere;
        border-radius: 12px;
        background: #eff7f3;
        color: #164437;
        align-self: flex-start;
      }

      .upproto-bubble.user {
        align-self: flex-end;
        background: #e4f0fc;
        color: #183c5e;
      }

      .upproto-form {
        display: flex;
        gap: 9px;
        margin: 13px 0;
      }

      .upproto-form input {
        flex: 1;
        min-width: 0;
        padding: 12px;
        border: 1px solid #c6d9d4;
        border-radius: 9px;
      }

      .upproto-chips,
      .upproto-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 12px 0;
      }

      .upproto-chips button {
        border: 1px solid #bfded1;
        border-radius: 999px;
        padding: 8px 11px;
        background: white;
        color: #1c614a;
        cursor: pointer;
      }

      .upproto-meter {
        height: 9px;
        background: #e1e9e9;
        border-radius: 9px;
        overflow: hidden;
        margin-top: 6px;
      }

      .upproto-meter i {
        height: 100%;
        display: block;
        background: linear-gradient(
          90deg,
          #238668,
          #51c5a0
        );
      }

      .upproto-progress {
        display: grid;
        gap: 13px;
      }

      .upproto-progress label {
        display: block;
        font-weight: 700;
        color: #3b5268;
      }

      .upproto-mission {
        border: 1px solid #e1ece7;
        border-radius: 11px;
        padding: 13px;
        margin: 10px 0;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .upproto-mission b {
        display: block;
        color: #143949;
      }

      .upproto-mission span {
        font-size: 12px;
        color: #567084;
      }

      .upproto-fields {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin: 15px 0;
      }

      .upproto-fields label {
        display: grid;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        color: #3b5165;
      }

      .upproto-fields input {
        width: 100%;
        padding: 10px;
        border: 1px solid #cddce2;
        border-radius: 9px;
      }

      .upproto-callout {
        background: #eef9f4;
        padding: 13px;
        border-radius: 11px;
        margin: 12px 0;
        line-height: 1.65;
      }

      .upproto-preview {
        border: 1px solid #e1eae8;
        padding: 11px;
        margin: 12px 0;
        border-radius: 11px;
        max-height: 190px;
        overflow: auto;
      }

      .upproto-preview div {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        padding: 7px;
        border-bottom: 1px solid #edf1f1;
      }

      @media(max-width:700px) {
        .upproto {
          padding: 16px;
        }

        .upproto-grid,
        .upproto-fields {
          grid-template-columns: 1fr;
        }

        .upproto-form {
          flex-direction: column;
        }

        .upproto-form button {
          width: 100%;
        }

        .upproto-messages {
          height: 290px;
        }
      }
    `;

    document.head.append(sheet);
  }

  // BOTÃO DA VISÃO GERAL

  function initBanner() {
    const home = $("home");
    if (!home) return;

    const banner = create("div", "updemo-banner");
    const info = create("div");

    info.append(
      create(
        "strong",
        "",
        demoEnabled()
          ? "🎬 MODO DEMONSTRAÇÃO ATIVO"
          : "🎬 Apresente o UpFinance com dados fictícios"
      ),
      create(
        "p",
        "",
        demoEnabled()
          ? "Os valores exibidos são fictícios."
          : "Veja relatórios, missões e análises preenchidos."
      )
    );

    const button = create(
      "button",
      "updemo-btn",
      demoEnabled()
        ? "Sair da demonstração"
        : "Ativar demonstração"
    );

    button.type = "button";
    button.addEventListener("click", toggleDemo);

    banner.append(info, button);

    const stats = home.querySelector(".stats");

    if (stats) stats.before(banner);
    else home.prepend(banner);
  }

  // ANÁLISE FINANCEIRA MENSAL

  function totals(month) {
    const arr = (getState().transactions || [])
      .filter(t =>
        typeof t.date === "string" &&
        t.date.startsWith(month) &&
        (t.kind === "in" || t.kind === "out") &&
        Number(t.amount) > 0
      );

    const categories = {};

    let income = 0;
    let expense = 0;

    arr.forEach(t => {
      const n = Number(t.amount);

      if (t.kind === "in") {
        income += n;
      } else {
        expense += n;

        const category = String(t.category || "Geral");

        categories[category] =
          (categories[category] || 0) + n;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      categories,
      count: arr.length
    };
  }

  function financeAnswer(topic) {
    const month =
      $("aiMonth")?.value || todayMonth();

    const a = totals(month);
    const b = totals(backMonth(month));

    const groups = Object.entries(a.categories)
      .sort((x, y) => y[1] - x[1]);

    if (!a.count) {
      return "Ainda não existem movimentações nesse mês. " +
        "Ative a demonstração na Visão geral para ver um exemplo.";
    }

    if (topic === "gastos") {
      if (!groups.length) {
        return "Ainda não há despesas registradas.";
      }

      return `Sua maior categoria foi ${groups[0][0]}, ` +
        `com ${money(groups[0][1])}. ` +
        `Ela representa ${Math.round(
          groups[0][1] / a.expense * 100
        )}% das despesas registradas.`;
    }

    if (topic === "comparacao") {
      if (!b.count) {
        return "Não existem dados do mês anterior para comparar.";
      }

      const difference = a.expense - b.expense;

      return `Você gastou ${money(a.expense)} neste mês ` +
        `e ${money(b.expense)} no anterior. ` +
        `A diferença foi de ${money(Math.abs(difference))}. ` +
        (
          difference > 0
            ? "Houve um aumento."
            : difference < 0
              ? "Houve uma redução."
              : "Os valores foram iguais."
        );
    }

    if (topic === "meta") {
      const goal = getState().goal;

      if (!goal) {
        return "Você ainda não cadastrou uma meta financeira.";
      }

      return `Sua meta atual é "${goal.name}", ` +
        `de ${money(goal.value)}. ` +
        `O resultado registrado neste mês é ${money(a.balance)}. ` +
        "Esse valor não representa necessariamente dinheiro guardado.";
    }

    if (topic === "proximos") {
      if (a.balance < 0) {
        return `As despesas superaram as receitas em ` +
          `${money(-a.balance)}. ` +
          "Verifique se faltam registros e analise " +
          "quais gastos podem ser planejados.";
      }

      return `O resultado registrado foi ${money(a.balance)}. ` +
        "Confira se todos os gastos foram registrados " +
        "e considere definir uma meta realista.";
    }

    return `Neste mês, você registrou ` +
      `${money(a.income)} de entradas e ` +
      `${money(a.expense)} de saídas. ` +
      `Resultado: ${money(a.balance)}. ` +
      "Esse é o resultado dos registros, não o saldo bancário.";
  }

  function financeTopic(text) {
    const q = clean(text);

    if (/meta|objetivo|guardar/.test(q)) return "meta";

    if (/anterior|compar|mudou|aument|dimin/.test(q)) {
      return "comparacao";
    }

    if (/melhor|fazer|proxim|dica/.test(q)) {
      return "proximos";
    }

    if (/onde|categoria|mais gastei|maior gasto/.test(q)) {
      return "gastos";
    }

    return "resumo";
  }

  function showFinanceAnswer(topic) {
    const target = $("aiAnswer");
    if (!target) return;

    target.replaceChildren(
      create("strong", "", "✦ UpFinance explica\n"),
      create("span", "", financeAnswer(topic))
    );
  }

  function refreshFinance() {
    if (!$("aiMonth")) return;

    const a = totals(
      $("aiMonth").value || todayMonth()
    );

    const kpis = $("aiKPIs");
    const insights = $("aiInsights");

    if (kpis) {
      kpis.replaceChildren();

      [
        ["Entradas", a.income],
        ["Saídas", a.expense],
        ["Resultado", a.balance]
      ].forEach(([label, value]) => {
        const card = create("div", "ai-kpi");

        card.append(
          create("small", "", label),
          create("strong", "", money(value))
        );

        kpis.append(card);
      });
    }

    if (insights) {
      insights.replaceChildren();

      [
        ["Resumo", financeAnswer("resumo")],
        ["Mudanças", financeAnswer("comparacao")],
        ["Próximo passo", financeAnswer("proximos")]
      ].forEach(([label, text]) => {
        const block = create("div", "ai-insight");

        block.append(
          create("strong", "", label),
          create("span", "", text)
        );

        insights.append(block);
      });
    }

    showFinanceAnswer("resumo");

    if ($("aiLegacyNotice")) {
      $("aiLegacyNotice").textContent = demoEnabled()
        ? "Modo demonstração: movimentações fictícias."
        : "Análise baseada nos registros do navegador.";
    }
  }

  function initFinance() {
    if (!$("aiMonth")) return;

    $("aiMonth").value = todayMonth();

    $("aiMonth").addEventListener(
      "change",
      refreshFinance
    );

    document
      .querySelectorAll("[data-ai-question]")
      .forEach(button => {
        button.addEventListener("click", () => {
          showFinanceAnswer(
            button.dataset.aiQuestion
          );
        });
      });

    $("aiQuestionForm")?.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        showFinanceAnswer(
          financeTopic($("aiQuestion")?.value)
        );
      }
    );

    window.addEventListener("storage", event => {
      if (event.key === DB) refreshFinance();
    });

    window.UpFinanceInsights = {
      refresh: refreshFinance
    };

    refreshFinance();
  }

  // PROFESSOR FINANCEIRO

  const subjects = [
    {
      keys: ["juros", "rendimento"],
      name: "Juros compostos",
      text:
        "São juros calculados sobre o valor acumulado, " +
        "incluindo juros anteriores. Isso pode acontecer " +
        "em investimentos e também em dívidas.",
      example:
        "R$ 100 com taxa hipotética de 1% ao mês " +
        "viram R$ 101 depois de um mês e R$ 102,01 " +
        "depois de dois meses.",
      practice:
        "Se R$ 200 rendem 1% em um mês, " +
        "qual o resultado? R$ 202."
    },
    {
      keys: ["orcamento", "gasto", "organizar", "despesa"],
      name: "Orçamento financeiro",
      text:
        "É um planejamento das entradas e saídas " +
        "de dinheiro. Ajuda a definir prioridades " +
        "e organizar despesas.",
      example:
        "Se entram R$ 500 e saem R$ 420, " +
        "o resultado registrado é R$ 80.",
      practice:
        "Anote três gastos essenciais e duas " +
        "despesas flexíveis. Como você organizaria " +
        "essas despesas?"
    },
    {
      keys: ["reserva", "emergencia", "imprevisto"],
      name: "Reserva de emergência",
      text:
        "É uma quantia separada para enfrentar " +
        "gastos inesperados. O valor adequado " +
        "varia para cada pessoa.",
      example:
        "Se os gastos essenciais são R$ 800, " +
        "três meses correspondem a R$ 2.400, " +
        "apenas como exemplo.",
      practice:
        "Liste despesas que continuariam " +
        "importantes mesmo num mês com renda menor."
    },
    {
      keys: ["meta", "economizar", "poupar", "guardar"],
      name: "Metas financeiras",
      text:
        "Uma meta reúne um objetivo, um valor " +
        "e um prazo. Ela deve ser compatível " +
        "com o orçamento.",
      example:
        "Para juntar R$ 240 em seis meses, " +
        "sem juros, seria necessário guardar R$ 40 por mês.",
      practice:
        "Escolha um objetivo fictício, " +
        "defina quanto custa e um prazo possível."
    },
    {
      keys: [
        "invest",
        "risco",
        "liquidez",
        "tesouro",
        "acoes",
        "acao"
      ],
      name: "Investimentos",
      text:
        "Antes de investir, é importante entender " +
        "risco, liquidez, custos e prazo. " +
        "Os retornos não são garantidos.",
      example:
        "Dinheiro para um objetivo próximo " +
        "pode exigir características diferentes " +
        "de dinheiro destinado ao longo prazo.",
      practice:
        "Compare dois objetivos: um em três meses " +
        "e outro em cinco anos. " +
        "Qual exige maior liquidez?"
    },
    {
      keys: ["inflacao", "precos", "poder de compra"],
      name: "Inflação",
      text:
        "Inflação é o aumento generalizado " +
        "dos preços. Com o tempo, o mesmo valor " +
        "pode comprar menos produtos.",
      example:
        "Se produtos que custavam R$ 100 " +
        "passam a custar R$ 105, " +
        "a diferença é R$ 5.",
      practice:
        "Compare os preços de dois produtos " +
        "em períodos diferentes."
    },
    {
      keys: ["cartao", "credito", "fatura", "parcel"],
      name: "Cartão de crédito",
      text:
        "É uma forma de pagar compras posteriormente. " +
        "O orçamento precisa considerar parcelas " +
        "futuras e eventuais juros.",
      example:
        "Uma compra de R$ 200 em quatro parcelas " +
        "sem juros representa R$ 50 em cada fatura.",
      practice:
        "Some as parcelas de uma fatura hipotética " +
        "e descubra quanto já está comprometido."
    },
    {
      keys: ["golpe", "fraude", "seguranca", "senha"],
      name: "Segurança financeira",
      text:
        "Desconfie de pedidos de senhas, " +
        "promessas de lucro garantido e mensagens " +
        "com pressão para decidir imediatamente.",
      example:
        "Uma mensagem pedindo um código de " +
        "verificação para liberar um prêmio " +
        "pode ser um golpe.",
      practice:
        "Cite dois sinais que fariam você " +
        "confirmar uma mensagem por um canal oficial."
    }
  ];

  function findSubject(text) {
    const q = clean(text);

    return subjects.find(s =>
      s.keys.some(key => q.includes(key))
    ) || null;
  }

  function initTutor() {
    const learn = $("learn");
    if (!learn) return;

    const old = $("eduAssistant");
    if (old) old.remove();

    const panel = create(
      "div",
      "upproto upproto-chat"
    );

    panel.id = "eduAssistant";

    panel.append(
      create(
        "small",
        "",
        "✦ PROFESSOR FINANCEIRO — DEMONSTRAÇÃO"
      ),
      create(
        "h3",
        "",
        "Ficou com dúvidas? Pergunte aqui."
      ),
      create(
        "p",
        "",
        "Escreva uma pergunta sobre dinheiro, " +
        "veja exemplos e pratique. " +
        "As respostas são programadas neste protótipo."
      )
    );

    const messages = create(
      "div",
      "upproto-messages"
    );

    messages.setAttribute(
      "aria-live",
      "polite"
    );

    const form = create(
      "form",
      "upproto-form"
    );

    const input = create("input");

    input.type = "search";
    input.required = true;
    input.maxLength = 220;

    input.placeholder =
      "Ex.: como funcionam os juros compostos?";

    input.setAttribute(
      "aria-label",
      "Pergunta financeira"
    );

    const send = create(
      "button",
      "upproto-btn upproto-primary",
      "Perguntar"
    );

    send.type = "submit";

    form.append(input, send);

    const chips = create(
      "div",
      "upproto-chips"
    );

    const actions = create(
      "div",
      "upproto-actions"
    );

    let activeSubject = null;

    function bubble(role, text) {
      const b = create(
        "div",
        `upproto-bubble ${role}`,
        text
      );

      messages.append(b);
      messages.scrollTop = messages.scrollHeight;
    }

    function ask(text) {
      const question = text.trim();
      if (!question) return;

      bubble("user", question);

      activeSubject = findSubject(question);

      if (!activeSubject) {
        bubble(
          "assistant",
          "Ainda não tenho uma resposta pronta " +
          "para esse assunto nesta demonstração. " +
          "Pergunte sobre juros, orçamento, reserva, " +
          "metas, inflação, cartão ou investimentos."
        );
      } else {
        bubble(
          "assistant",
          `${activeSubject.name}\n\n` +
          `${activeSubject.text}\n\n` +
          `Exemplo: ${activeSubject.example}`
        );
      }
    }

    [
      "O que são juros compostos?",
      "Como organizar meus gastos?",
      "O que é reserva de emergência?"
    ].forEach(question => {
      const btn = create(
        "button",
        "",
        question
      );

      btn.type = "button";

      btn.addEventListener("click", () => {
        ask(question);
      });

      chips.append(btn);
    });

    [
      ["Explica mais fácil", "simple"],
      ["Me dá um exemplo", "example"],
      ["Quero praticar", "practice"]
    ].forEach(([label, mode]) => {
      const btn = create(
        "button",
        "upproto-btn",
        label
      );

      btn.type = "button";

      btn.addEventListener("click", () => {
        if (!activeSubject) {
          bubble(
            "assistant",
            "Escolha um assunto primeiro " +
            "para eu continuar."
          );

          return;
        }

        if (mode === "simple") {
          bubble(
            "assistant",
            `${activeSubject.name}: ${activeSubject.text}`
          );
        }

        if (mode === "example") {
          bubble(
            "assistant",
            `Exemplo: ${activeSubject.example}`
          );
        }

        if (mode === "practice") {
          bubble(
            "assistant",
            `Exercício: ${activeSubject.practice}`
          );
        }
      });

      actions.append(btn);
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      ask(input.value);
      input.value = "";
    });

    bubble(
      "assistant",
      "Olá! 👋 Sou o professor financeiro do UpFinance. " +
      "Posso explicar conceitos e dar exemplos. " +
      "O que você gostaria de aprender?"
    );

    panel.append(
      messages,
      form,
      chips,
      actions,
      create(
        "p",
        "upproto-note",
        "Protótipo educativo: respostas simuladas, " +
        "sem IA externa. Não digite senhas " +
        "ou dados bancários."
      )
    );

    const intro = learn.querySelector(":scope > p");

    if (intro) intro.after(panel);
    else learn.prepend(panel);
  }

  // MAPA DE EVOLUÇÃO

  function initProgress() {
    const learn = $("learn");
    if (!learn) return;

    const s = getState();

    const lessons = Array.isArray(s.lessonsRead)
      ? s.lessonsRead.length
      : 0;

    const tx = Array.isArray(s.transactions)
      ? s.transactions.length
      : 0;

    const quiz = s.quiz?.answers
      ? Object.keys(s.quiz.answers).length
      : 0;

    const values = [
      [
        "Exploração de aulas",
        Math.min(100, lessons * 16)
      ],
      [
        "Prática de organização",
        Math.min(100, tx * 7)
      ],
      [
        "Atividades de conhecimento",
        Math.min(100, quiz * 4)
      ],
      [
        "Planejamento de metas",
        s.goal ? 75 : 5
      ]
    ];

    const panel = create(
      "div",
      "upproto"
    );

    panel.append(
      create(
        "small",
        "",
        "MAPA DE EVOLUÇÃO"
      ),
      create(
        "h3",
        "",
        "Sua jornada de aprendizado"
      ),
      create(
        "p",
        "",
        "Veja sua participação nas atividades do UpFinance."
      )
    );

    const grid = create(
      "div",
      "upproto-progress"
    );

    values.forEach(([name, value]) => {
      const item = create("div");

      const label = create(
        "label",
        "",
        `${name} — ${value}%`
      );

      const bar = create(
        "div",
        "upproto-meter"
      );

      const fill = create("i");
      fill.style.width = `${value}%`;

      bar.append(fill);
      item.append(label, bar);
      grid.append(item);
    });

    panel.append(
      grid,
      create(
        "p",
        "upproto-note",
        "Indicadores ilustrativos de participação, " +
        "não de saúde financeira."
      )
    );

    learn.append(panel);
  }

  // MISSÕES PERSONALIZADAS

  function initMissions() {
    const learn = $("learn");
    if (!learn) return;

    const s = getState();

    const tx = Array.isArray(s.transactions)
      ? s.transactions
      : [];

    const lessons = Array.isArray(s.lessonsRead)
      ? s.lessonsRead
      : [];

    const panel = create(
      "div",
      "upproto"
    );

    panel.append(
      create(
        "small",
        "",
        "MISSÕES PERSONALIZADAS"
      ),
      create(
        "h3",
        "",
        "Seus próximos passos"
      ),
      create(
        "p",
        "",
        "Missões educativas sugeridas de acordo " +
        "com suas atividades no UpFinance."
      )
    );

    const missions = [
      [
        "Registrar três despesas",
        "Conheça seu padrão de gastos.",
        tx.filter(t => t.kind === "out").length >= 3
      ],
      [
        "Definir uma meta",
        "Planeje uma conquista possível.",
        Boolean(s.goal)
      ],
      [
        "Concluir uma aula",
        "Aprenda um conceito novo.",
        lessons.length >= 1
      ]
    ];

    missions.forEach(
      ([name, description, complete]) => {
        const line = create(
          "div",
          "upproto-mission"
        );

        const mark = create(
          "span",
          "",
          complete ? "✅" : "○"
        );

        mark.style.fontSize = "21px";

        const text = create("div");

        text.append(
          create("b", "", name),
          create(
            "span",
            "",
            `${description} ${
              complete
                ? "Concluída."
                : "Pendente."
            }`
          )
        );

        line.append(mark, text);
        panel.append(line);
      }
    );

    panel.append(
      create(
        "div",
        "upproto-callout",
        "Dica: ao ativar a demonstração, " +
        "as missões aparecem concluídas " +
        "com base nos dados fictícios."
      )
    );

    learn.append(panel);
  }

  // SIMULADOR DE DECISÕES

  function initSimulator() {
    const learn = $("learn");
    if (!learn) return;

    const panel = create(
      "div",
      "upproto"
    );

    panel.append(
      create(
        "small",
        "",
        "SIMULADOR DE DECISÕES"
      ),
      create(
        "h3",
        "",
        "E se eu tivesse um gasto extra?"
      ),
      create(
        "p",
        "",
        "Mude os números para ver como uma decisão " +
        "altera o resultado do mês."
      )
    );

    const fields = create(
      "div",
      "upproto-fields"
    );

    const inputs = [];

    [
      ["Receita mensal (R$)", 2500],
      ["Despesas previstas (R$)", 1800],
      ["Gasto extra (R$)", 300]
    ].forEach(([label, value]) => {
      const wrap = create(
        "label",
        "",
        label
      );

      const input = create("input");

      input.type = "number";
      input.min = "0";
      input.step = "10";
      input.value = value;

      wrap.append(input);
      fields.append(wrap);

      inputs.push(input);
    });

    const result = create(
      "div",
      "upproto-callout"
    );

    const update = () => {
      const [income, expense, extra] =
        inputs.map(input =>
          Math.max(0, Number(input.value) || 0)
        );

      const balance = income - expense - extra;

      result.textContent =
        `Resultado simulado: ${money(balance)}. ` +
        (
          balance < 0
            ? "Nesse cenário, as despesas " +
              "ultrapassariam as receitas. " +
              "Revise o planejamento."
            : "Nesse cenário, ainda restaria " +
              "esse valor após as despesas previstas."
        );
    };

    inputs.forEach(input => {
      input.addEventListener(
        "input",
        update
      );
    });

    panel.append(
      fields,
      result,
      create(
        "p",
        "upproto-note",
        "Simulação educativa, " +
        "sem movimentar dinheiro real."
      )
    );

    learn.append(panel);
    update();
  }

  // CONEXÃO BANCÁRIA SIMULADA

  function initBankDemo() {
    const section = $("money");
    if (!section) return;

    const panel = create(
      "div",
      "upproto"
    );

    panel.append(
      create(
        "small",
        "",
        "VISUALIZAÇÃO DE CONEXÃO BANCÁRIA"
      ),
      create(
        "h3",
        "",
        "Seu extrato, explicado"
      ),
      create(
        "p",
        "",
        "Veja como uma conexão pelo Open Finance " +
        "poderia funcionar no futuro. " +
        "Esta demonstração não acessa nenhum banco."
      )
    );

    const status = create(
      "div",
      "upproto-callout",
      "🏦 Nenhum banco real conectado. " +
      "Clique para visualizar uma conexão simulada."
    );

    const actions = create(
      "div",
      "upproto-actions"
    );

    const connect = create(
      "button",
      "upproto-btn upproto-primary",
      "Simular conexão com banco"
    );

    connect.type = "button";

    const dataButton = create(
      "button",
      "upproto-btn",
      "Carregar extrato fictício"
    );

    dataButton.type = "button";

    const preview = create(
      "div",
      "upproto-preview"
    );

    preview.hidden = true;

    connect.addEventListener("click", () => {
      status.textContent =
        "✅ Banco Exemplo conectado (SIMULAÇÃO). " +
        "Nenhuma conta, senha ou API foi utilizada.";

      connect.textContent =
        "Demonstração conectada ✓";

      connect.disabled = true;

      preview.hidden = false;
      preview.replaceChildren();

      sampleTransactions()
        .slice(0, 6)
        .forEach(t => {
          const row = create("div");

          row.append(
            create(
              "span",
              "",
              `${t.date} • ${t.desc}`
            ),
            create(
              "strong",
              "",
              `${t.kind === "out" ? "−" : "+"} ${money(t.amount)}`
            )
          );

          preview.append(row);
        });
    });

    dataButton.addEventListener("click", () => {
      if (demoEnabled()) {
        status.textContent =
          "Os dados de demonstração já estão ativos no painel.";

        return;
      }

      toggleDemo();
    });

    const label = create(
      "label",
      "",
      "Ver prévia de arquivo CSV ou OFX " +
      "(opcional, sem importar)"
    );

    label.style.marginTop = "10px";

    const fileInput = create("input");

    fileInput.type = "file";
    fileInput.accept = ".csv,.ofx,.qfx,.txt";

    label.append(fileInput);

    fileInput.addEventListener(
      "change",
      async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
          status.textContent =
            "Escolha um arquivo de até 1 MB.";

          return;
        }

        const text = await file.text();

        const lines = text
          .replace(/\r/g, "")
          .split("\n")
          .filter(Boolean);

        status.textContent =
          `Prévia local de "${file.name}": ` +
          `${lines.length} linha(s) encontradas. ` +
          "Nada foi importado ao painel.";

        preview.hidden = false;
        preview.replaceChildren();

        lines.slice(0, 5).forEach(line => {
          preview.append(
            create(
              "div",
              "",
              line.slice(0, 110)
            )
          );
        });
      }
    );

    actions.append(
      connect,
      dataButton
    );

    panel.append(
      status,
      actions,
      preview,
      label,
      create(
        "p",
        "upproto-note",
        "Conexão bancária real não implementada. " +
        "Não informe credenciais. " +
        "Use dados fictícios na apresentação."
      )
    );

    const ai = $("upfinanceAI");

    if (ai) ai.after(panel);
    else section.append(panel);
  }

  // INICIALIZAÇÃO

  function start() {
    installStyles();
    initBanner();
    initFinance();
    initTutor();
    initProgress();
    initMissions();
    initSimulator();
    initBankDemo();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start
    );
  } else {
    start();
  }

})();

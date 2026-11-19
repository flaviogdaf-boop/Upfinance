
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "upfinance_db";
  const $ = id => document.getElementById(id);

  const money = value =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  // 30 PERGUNTAS DE EDUCAÇÃO FINANCEIRA
  // answer indica a posição da resposta correta: 0, 1 ou 2.

  const questions = [
    {
      question: "Você recebe R$ 50 e quer comprar algo de R$ 80. O que fazer?",
      options: [
        "Comprar imediatamente e ficar devendo.",
        "Planejar como juntar os R$ 30 que faltam.",
        "Pedir um empréstimo sem avaliar os custos."
      ],
      answer: 1,
      explanation: "Planejar permite atingir objetivos sem assumir dívidas desnecessárias."
    },
    {
      question: "Qual é a principal função de um orçamento?",
      options: [
        "Organizar receitas e despesas.",
        "Impedir qualquer tipo de compra.",
        "Garantir que você sempre tenha dinheiro."
      ],
      answer: 0,
      explanation: "O orçamento permite acompanhar entradas, saídas e objetivos financeiros."
    },
    {
      question: "O que são juros compostos?",
      options: [
        "Juros calculados apenas sobre o valor inicial.",
        "Um desconto aplicado nas compras.",
        "Juros calculados sobre o valor acumulado, incluindo juros anteriores."
      ],
      answer: 2,
      explanation: "Nos juros compostos, os juros anteriores também integram a base de cálculo."
    },
    {
      question: "O que significa economizar dinheiro?",
      options: [
        "Nunca comprar nada.",
        "Separar parte dos recursos para utilizar no futuro.",
        "Gastar toda a renda disponível."
      ],
      answer: 1,
      explanation: "Economizar ajuda a alcançar metas e enfrentar imprevistos."
    },
    {
      question: "Qual destas situações representa uma necessidade básica?",
      options: [
        "Comprar um novo videogame.",
        "Trocar um celular que ainda funciona.",
        "Comprar alimentos para a família."
      ],
      answer: 2,
      explanation: "Alimentação é uma necessidade essencial."
    },
    {
      question: "Você recebe R$ 200 e gasta R$ 150. Quanto sobra?",
      options: [
        "R$ 50.",
        "R$ 100.",
        "R$ 150."
      ],
      answer: 0,
      explanation: "200 menos 150 é igual a 50 reais."
    },
    {
      question: "O que é uma reserva de emergência?",
      options: [
        "Dinheiro para compras por impulso.",
        "Um valor guardado para despesas inesperadas.",
        "Dinheiro destinado exclusivamente a viagens."
      ],
      answer: 1,
      explanation: "A reserva ajuda a lidar com imprevistos financeiros."
    },
    {
      question: "Qual atitude ajuda a evitar compras por impulso?",
      options: [
        "Comprar antes de comparar preços.",
        "Aceitar qualquer promoção.",
        "Avaliar se a compra é realmente necessária."
      ],
      answer: 2,
      explanation: "Refletir antes de comprar reduz gastos desnecessários."
    },
    {
      question: "O que significa investir?",
      options: [
        "Aplicar recursos buscando resultados futuros, assumindo riscos.",
        "Guardar dinheiro sem nenhum objetivo.",
        "Garantir ganhos sem possibilidade de perdas."
      ],
      answer: 0,
      explanation: "Investimentos buscam retornos, mas envolvem diferentes níveis de risco."
    },
    {
      question: "O que é inflação?",
      options: [
        "A redução de todos os preços.",
        "O aumento generalizado dos preços ao longo do tempo.",
        "O aumento automático dos salários."
      ],
      answer: 1,
      explanation: "A inflação reduz o poder de compra quando os preços aumentam."
    },
    {
      question: "Um produto custa R$ 100 e recebe 20% de desconto. Qual é o preço final?",
      options: [
        "R$ 90.",
        "R$ 70.",
        "R$ 80."
      ],
      answer: 2,
      explanation: "20% de R$ 100 são R$ 20. O valor final é R$ 80."
    },
    {
      question: "O que significa liquidez em um investimento?",
      options: [
        "A facilidade de transformar o investimento em dinheiro disponível.",
        "A garantia de que nunca haverá perdas.",
        "A quantidade de juros pagos mensalmente."
      ],
      answer: 0,
      explanation: "Liquidez está relacionada à facilidade de resgatar ou vender um ativo."
    },
    {
      question: "Qual é uma boa atitude antes de contratar um empréstimo?",
      options: [
        "Observar apenas o valor da parcela.",
        "Comparar juros, custos e capacidade de pagamento.",
        "Escolher a oferta com aprovação mais rápida."
      ],
      answer: 1,
      explanation: "É importante entender o custo total da dívida e seu impacto no orçamento."
    },
    {
      question: "O que significa diversificar investimentos?",
      options: [
        "Comprar somente um tipo de ativo.",
        "Investir sempre no ativo mais popular.",
        "Distribuir recursos entre diferentes investimentos."
      ],
      answer: 2,
      explanation: "A diversificação pode reduzir a concentração de riscos, mas não elimina perdas."
    },
    {
      question: "Você guarda R$ 25 por mês durante 4 meses, sem juros. Quanto terá?",
      options: [
        "R$ 100.",
        "R$ 75.",
        "R$ 125."
      ],
      answer: 0,
      explanation: "25 multiplicado por 4 é igual a R$ 100."
    },
    {
      question: "Qual é a principal diferença entre receita e despesa?",
      options: [
        "As duas representam dinheiro recebido.",
        "Receita é entrada de dinheiro; despesa é saída.",
        "Despesa representa somente dinheiro investido."
      ],
      answer: 1,
      explanation: "Receitas aumentam os recursos disponíveis e despesas representam gastos."
    },
    {
      question: "O que é uma ação de uma empresa?",
      options: [
        "Um empréstimo pessoal.",
        "Uma conta bancária.",
        "Uma participação no capital da empresa."
      ],
      answer: 2,
      explanation: "Ações representam pequenas participações em empresas."
    },
    {
      question: "O que caracteriza uma criptomoeda?",
      options: [
        "Ser um ativo digital que pode utilizar redes blockchain.",
        "Ter seu preço sempre estável.",
        "Garantir valorização ao longo dos anos."
      ],
      answer: 0,
      explanation: "Criptomoedas são ativos digitais e podem apresentar grandes oscilações."
    },
    {
      question: "Por que comparar preços antes de comprar?",
      options: [
        "Porque o produto mais caro é sempre melhor.",
        "Porque isso ajuda a avaliar o custo-benefício.",
        "Porque todas as lojas cobram o mesmo valor."
      ],
      answer: 1,
      explanation: "Comparar preços, qualidade e quantidade ajuda a decidir melhor."
    },
    {
      question: "O que é risco financeiro em um investimento?",
      options: [
        "A certeza de receber juros.",
        "Uma garantia de valorização.",
        "A possibilidade de resultados diferentes do esperado, incluindo perdas."
      ],
      answer: 2,
      explanation: "Todo investimento envolve riscos que precisam ser compreendidos."
    },
    {
      question: "Uma pessoa recebe R$ 1.500 e gasta R$ 1.200. Qual é seu saldo?",
      options: [
        "R$ 300.",
        "R$ 200.",
        "R$ 400."
      ],
      answer: 0,
      explanation: "1.500 menos 1.200 é igual a R$ 300."
    },
    {
      question: "Qual destas atitudes ajuda a proteger uma conta financeira?",
      options: [
        "Compartilhar senhas com colegas.",
        "Usar senhas fortes e autenticação adicional.",
        "Enviar códigos de segurança para desconhecidos."
      ],
      answer: 1,
      explanation: "Senhas fortes e autenticação em duas etapas aumentam a segurança."
    },
    {
      question: "O que significa patrimônio líquido pessoal?",
      options: [
        "O total de todas as compras feitas.",
        "A soma das despesas mensais.",
        "O valor dos bens e direitos menos as dívidas."
      ],
      answer: 2,
      explanation: "O patrimônio líquido considera ativos menos obrigações financeiras."
    },
    {
      question: "O que é uma meta financeira?",
      options: [
        "Um objetivo definido para utilizar ou acumular recursos.",
        "Uma compra realizada sem planejamento.",
        "Uma dívida que não precisa ser paga."
      ],
      answer: 0,
      explanation: "Metas financeiras ajudam a organizar prioridades e acompanhar avanços."
    },
    {
      question: "O que pode acontecer ao pagar apenas parte da fatura de um cartão?",
      options: [
        "A dívida desaparece automaticamente.",
        "O saldo restante pode gerar juros e encargos.",
        "O limite de crédito aumenta sem custos."
      ],
      answer: 1,
      explanation: "O pagamento parcial pode gerar juros elevados sobre o saldo devedor."
    },
    {
      question: "O que significa rentabilidade?",
      options: [
        "O prazo máximo para realizar uma compra.",
        "A quantidade de dinheiro depositada em uma conta.",
        "O retorno de um investimento em determinado período."
      ],
      answer: 2,
      explanation: "Rentabilidade indica o resultado financeiro de um investimento."
    },
    {
      question: "Por que definir prioridades financeiras?",
      options: [
        "Para direcionar recursos aos objetivos mais importantes.",
        "Para gastar mais em todas as categorias.",
        "Para evitar qualquer forma de planejamento."
      ],
      answer: 0,
      explanation: "As prioridades ajudam a distribuir melhor os recursos limitados."
    },
    {
      question: "O que é o Tesouro Direto?",
      options: [
        "Uma modalidade de compra de criptomoedas.",
        "Um programa de acesso de pessoas físicas a títulos públicos federais.",
        "Uma conta de pagamento sem rendimento."
      ],
      answer: 1,
      explanation: "O Tesouro Direto permite investir em títulos públicos federais."
    },
    {
      question: "Qual afirmação sobre investimentos é mais adequada?",
      options: [
        "Retornos elevados são sempre garantidos.",
        "Investimentos não precisam ser estudados.",
        "É importante considerar riscos, custos, prazos e objetivos."
      ],
      answer: 2,
      explanation: "Uma decisão financeira responsável exige avaliar diferentes fatores."
    },
    {
      question: "Uma pessoa deseja comprar algo de R$ 240 em 6 meses. Quanto precisa guardar por mês, sem juros?",
      options: [
        "R$ 40.",
        "R$ 50.",
        "R$ 60."
      ],
      answer: 0,
      explanation: "240 dividido por 6 é igual a R$ 40 por mês."
    }
  ];

  const ROUND_SIZE = 5;
  const ROUND_REWARD = 10;
  const TOTAL_ROUNDS = questions.length / ROUND_SIZE;

  const tips = [
    "Antes de comprar, pergunte: isso é necessidade ou vontade?",
    "Anote seus gastos para conhecer seus hábitos.",
    "Guardar dinheiro pode ajudar a realizar objetivos.",
    "Compare preços antes de comprar.",
    "Evite decisões financeiras por impulso."
  ];

  function createQuizState() {
    return {
      order: shuffle([...questions.keys()]),
      position: 0,
      answers: {},
      rewardedRounds: []
    };
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function defaultState() {
    return {
      user: { name: "Estudante", track: "teens", email: "", phone: "" },
      points: 0,
      transactions: [],
      goal: null,
      completedMissions: {
        register: false,
        goal: false,
        invest: false
      },
      simulated: false,
      lessonsRead: [],
      redeemed: [],
      quiz: createQuizState()
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const base = defaultState();

      if (!saved) return base;

      const loaded = {
        ...base,
        ...saved,
        user: { ...base.user, ...(saved.user || {}) },
        completedMissions: {
          ...base.completedMissions,
          ...(saved.completedMissions || {})
        },
        transactions: Array.isArray(saved.transactions)
          ? saved.transactions : [],
        lessonsRead: Array.isArray(saved.lessonsRead)
          ? saved.lessonsRead : [],
        redeemed: Array.isArray(saved.redeemed)
          ? saved.redeemed : []
      };

      // Mantém as perguntas e o progresso ao atualizar a página.
      const q = saved.quiz;

      const validOrder =
        q &&
        Array.isArray(q.order) &&
        q.order.length === questions.length &&
        new Set(q.order).size === questions.length &&
        q.order.every(id =>
          Number.isInteger(id) &&
          id >= 0 &&
          id < questions.length
        );

      if (validOrder) {
        loaded.quiz = {
          order: q.order,
          position: Number.isInteger(q.position)
            ? Math.max(0, Math.min(questions.length - 1, q.position))
            : 0,
          answers: q.answers && typeof q.answers === "object"
            ? q.answers : {},
          rewardedRounds: Array.isArray(q.rewardedRounds)
            ? q.rewardedRounds : []
        };
      }

      return loaded;
    } catch {
      return defaultState();
    }
  }

  let state = loadState();

  function toast(message) {
    const item = document.createElement("div");
    item.className = "toast-item";
    item.textContent = message;
    $("toast").appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }

  function addPoints(amount, reason) {
    state.points += amount;
    toast(`+${amount} pontos! ${reason}`);
  }

  function evaluateMissions() {
    const m = state.completedMissions;

    const hasIncome = state.transactions.some(
      item => item.kind === "in"
    );

    const hasExpense = state.transactions.some(
      item => item.kind === "out"
    );

    if (!m.register && hasIncome && hasExpense) {
      m.register = true;
      addPoints(30, "Detetive dos gastos");
    }

    if (!m.goal && state.goal) {
      m.goal = true;
      addPoints(30, "Meta de economia");
    }

    if (
      !m.invest &&
      state.simulated &&
      state.lessonsRead.length > 0
    ) {
      m.invest = true;
      addPoints(40, "Primeiro passo nos investimentos");
    }
  }

  function commit() {
    evaluateMissions();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("Não foi possível salvar os dados.");
    }

    render();
  }

  function render() {
    const name = state.user.name || "Estudante";

    $("sideName").textContent = name;
    $("hello").textContent = `Olá, ${name}!`;

    if ($("name") && document.activeElement !== $("name")) {
      $("name").value =
        name === "Estudante" ? "" : name;
    }

    if ($("age")) $("age").value = state.user.track;
    if ($("profileEmail") && document.activeElement !== $("profileEmail")) {
      $("profileEmail").value = sessionStorage.getItem("upfinance_email") || state.user.email || "";
      $("profileEmail").readOnly = Boolean(sessionStorage.getItem("upfinance_email"));
    }
    if ($("profilePhone") && document.activeElement !== $("profilePhone")) {
      $("profilePhone").value = state.user.phone || "";
    }
    $("pointsTop").textContent = state.points;
    if ($("profileDisplayName")) {
      $("profileDisplayName").textContent = name;
      $("profileInitial").textContent = Array.from(name.trim())[0]?.toLocaleUpperCase("pt-BR") || "E";
      $("profileTrack").textContent = { kids: "Crianças", teens: "Jovens", adults: "Adultos" }[state.user.track] || "Adultos";
      $("profilePoints").textContent = `${state.points} ${state.points === 1 ? "ponto" : "pontos"}`;
    }
    if ($("points")) $("points").textContent = `${state.points} pts`;

    const income = state.transactions
      .filter(item => item.kind === "in")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = state.transactions
      .filter(item => item.kind === "out")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const balance = income - expense;

    if ($("balance")) {
      $("balance").textContent = money(balance);
      $("income").textContent = money(income);
      $("expense").textContent = money(expense);
      $("balance").classList.toggle("out", balance < 0);
    }

    renderHistory();
    renderCategories(expense);
    renderGoal(balance);
    renderMissions();
    renderRewards();
    renderQuiz();
    if (window.UpFinanceInsights) window.UpFinanceInsights.refresh();
  }

  // HISTÓRICO FINANCEIRO

  function renderHistory() {
    const box = $("history");
    if (!box) return;

    if (!state.transactions.length) {
      box.innerHTML =
        '<p class="empty">Suas movimentações aparecerão aqui.</p>';
      return;
    }

    box.innerHTML = state.transactions
      .slice().reverse().slice(0, 8)
      .map(item => `
        <div class="entry">
          <div>
            <strong>${escapeHTML(item.desc)}</strong>
            <small>${escapeHTML(item.category)}</small>
          </div>
          <div class="entry-right">
            <span class="${item.kind}">
              ${item.kind === "in" ? "+" : "−"}
              ${money(item.amount)}
            </span>
            <button class="icon-btn"
                    data-delete="${item.id}"
                    aria-label="Excluir movimentação">
              ✕
            </button>
          </div>
        </div>
      `).join("");
  }

  function renderCategories(totalOut) {
    const box = $("categories");
    if (!box) return;
    const categories = {};

    state.transactions
      .filter(item => item.kind === "out")
      .forEach(item => {
        categories[item.category] =
          (categories[item.category] || 0) + Number(item.amount);
      });

    const entries = Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);

    if (!entries.length) {
      box.innerHTML =
        '<p class="empty">Registre despesas para visualizar seus gastos.</p>';
      return;
    }

    box.innerHTML = entries.map(([name, value]) => {
      const percent = Math.round(value / totalOut * 100);
      return `
        <div class="cat">
          <div class="cat-head">
            <strong>${escapeHTML(name)}</strong>
            <span>${money(value)} • ${percent}%</span>
          </div>
          <div class="bar small">
            <i style="width:${percent}%"></i>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderGoal(balance) {
    if (!$("goalStatus")) return;
    if (!state.goal) {
      $("goalStatus").innerHTML =
        '<p class="empty">Defina uma meta para começar.</p>';
      return;
    }

    const percent = Math.max(
      0,
      Math.min(100, Math.round(balance / state.goal.value * 100))
    );

    const missing = Math.max(0, state.goal.value - balance);

    $("goalStatus").innerHTML = `
      <div class="cat-head">
        <strong>${escapeHTML(state.goal.name)}</strong>
        <span>${percent}%</span>
      </div>
      <div class="bar">
        <i style="width:${percent}%"></i>
      </div>
      <p>
        ${percent >= 100
          ? "Parabéns! Você alcançou sua meta!"
          : `Faltam ${money(missing)} para alcançar sua meta.`}
      </p>
    `;
  }

  // MISSÕES

  function renderMissions() {
    const missions = state.completedMissions;

    const done = Object.values(missions)
      .filter(Boolean).length;

    if ($("progress")) {
      $("progress").style.width = `${done / 3 * 100}%`;
      $("progressWrap").setAttribute("aria-valuenow", done);
      $("progressText").textContent =
        `${done} de 3 missões concluídas`;
    }

    Object.keys(missions).forEach(key => {
      const card = document.querySelector(
        `[data-mission-card="${key}"]`
      );
      if (!card) return;
      const button = card.querySelector("button");

      card.classList.toggle("done", missions[key]);
      button.textContent = missions[key]
        ? "Concluída ✓" : "Ver tarefa";
      button.disabled = missions[key];
    });
  }

  function renderRewards() {
    document.querySelectorAll(".redeem").forEach(button => {
      const cost = Number(button.dataset.cost);
      const redeemed = state.redeemed.includes(button.dataset.id);

      button.disabled = redeemed;
      button.textContent = redeemed
        ? "Resgatado ✓"
        : state.points >= cost
          ? "Resgatar"
          : `Faltam ${cost - state.points} pontos`;
    });
  }

  // NOVO QUIZ: 30 QUESTÕES, 5 POR RODADA

  function renderQuiz() {
    if (!$("quiz")) return;
    const quiz = state.quiz;
    const position = quiz.position;
    const questionId = quiz.order[position];
    const item = questions[questionId];

    const round = Math.floor(position / ROUND_SIZE);
    const questionInRound = position % ROUND_SIZE;

    const answered = Object.prototype.hasOwnProperty.call(
      quiz.answers, position
    );

    const selected = answered
      ? quiz.answers[position]
      : null;

    $("quizCounter").textContent =
      `Pergunta ${position + 1} de ${questions.length}`;

    $("quizRound").textContent =
      `Rodada ${round + 1} de ${TOTAL_ROUNDS} • ` +
      `${questionInRound + 1} de ${ROUND_SIZE}`;

    $("quizQuestion").textContent = item.question;

    const completedCount =
      Object.keys(quiz.answers).length;

    $("quizProgressBar").style.width =
      `${completedCount / questions.length * 100}%`;

    $("quizProgress").setAttribute(
      "aria-valuenow", completedCount
    );

    const optionLetters = ["A", "B", "C"];

    $("quiz").innerHTML = item.options.map((option, index) => {
      let className = "";

      if (answered) {
        if (index === item.answer) {
          className = "good";
        } else if (index === selected) {
          className = "bad";
        }
      }

      return `
        <button
          type="button"
          class="${className}"
          data-option="${index}"
          ${answered ? "disabled" : ""}
          style="width:100%;margin-bottom:8px;text-align:left;
                 opacity:1;cursor:${answered ? "default" : "pointer"}">
          <strong>${optionLetters[index]}.</strong>
          ${escapeHTML(option)}
        </button>
      `;
    }).join("");

    const message = $("quizMsg");

    if (!answered) {
      message.textContent = "";
      message.className = "";
    } else {
      const correct = selected === item.answer;

      message.className = correct ? "in" : "out";
      message.textContent =
        (correct ? "Resposta correta. " : "Resposta incorreta. ") +
        item.explanation;
    }

    const nextButton = $("quizNext");
    nextButton.disabled = !answered;

    if (position === questions.length - 1) {
      nextButton.textContent = "Refazer as perguntas →";
    } else if (questionInRound === ROUND_SIZE - 1) {
      nextButton.textContent = "Próxima rodada →";
    } else {
      nextButton.textContent = "Próxima pergunta →";
    }

    const awarded = quiz.rewardedRounds.includes(round);

    $("quizNote").textContent = awarded
      ? "Rodada concluída. Os 10 pontos desta rodada já foram creditados."
      : "Cada rodada de 5 perguntas concluídas vale 10 pontos, " +
        "uma única vez. São 60 pontos possíveis nas 6 rodadas.";
  }

  $("quiz")?.addEventListener("click", event => {
    const button = event.target.closest("[data-option]");
    if (!button) return;

    const quiz = state.quiz;
    const position = quiz.position;

    if (
      Object.prototype.hasOwnProperty.call(quiz.answers, position)
    ) return;

    const selected = Number(button.dataset.option);
    const item = questions[quiz.order[position]];

    if (!Number.isInteger(selected) ||
        selected < 0 ||
        selected >= item.options.length) return;

    quiz.answers[position] = selected;

    // Crédito somente ao concluir a quinta questão da rodada.
    // Cada uma das seis rodadas pode render apenas 10 pontos.

    const isRoundEnd =
      (position + 1) % ROUND_SIZE === 0;

    if (isRoundEnd) {
      const round = Math.floor(position / ROUND_SIZE);

      if (!quiz.rewardedRounds.includes(round)) {
        quiz.rewardedRounds.push(round);
        addPoints(ROUND_REWARD, "Rodada do quiz concluída");
      }
    }

    commit();
  });

  $("quizNext")?.addEventListener("click", () => {
    const quiz = state.quiz;
    const position = quiz.position;

    if (
      !Object.prototype.hasOwnProperty.call(
        quiz.answers, position
      )
    ) return;

    if (position === questions.length - 1) {
      // Reorganiza as 30 perguntas para uma nova tentativa.
      // As rodadas antigas não geram pontos novamente.
      quiz.order = shuffle([...questions.keys()]);
      quiz.position = 0;
      quiz.answers = {};
    } else {
      quiz.position++;
    }

    commit();
  });

  // FORMULÁRIOS

  $("transaction")?.addEventListener("submit", event => {
    event.preventDefault();

    const desc = $("desc").value.trim();
    const amount = Number($("amount").value);

    if (!desc || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    state.transactions.push({
      id: Date.now(),
      date: $("transactionDate").value,
      desc,
      amount: Math.round(amount * 100) / 100,
      kind: $("kind").value,
      category: $("category").value
    });

    event.target.reset();
    $("transactionDate").value = [new Date().getFullYear(), String(new Date().getMonth()+1).padStart(2,"0"), String(new Date().getDate()).padStart(2,"0")].join("-");
    toast("Movimentação registrada!");
    commit();
  });

  $("history")?.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    state.transactions = state.transactions.filter(
      item => item.id !== Number(button.dataset.delete)
    );

    toast("Movimentação excluída.");
    commit();
  });

  $("goal")?.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("goalName").value.trim();
    const value = Number($("goalValue").value);

    if (!name || !Number.isFinite(value) || value <= 0) {
      return;
    }

    state.goal = { name, value };
    event.target.reset();

    toast("Meta salva com sucesso!");
    commit();
  });

  $("profileForm")?.addEventListener("submit", event => {
    event.preventDefault();

    state.user.name =
      $("name").value.trim() || "Estudante";
    state.user.track = $("age").value;
    state.user.email = $("profileEmail").value.trim();
    state.user.phone = $("profilePhone").value.trim();

    toast("Perfil atualizado!");
    commit();
  });

  $("resetData")?.addEventListener("click", () => {
    if (!confirm(
      "Tem certeza? Todos os seus dados, pontos e progresso serão apagados."
    )) return;

    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();

    toast("Dados apagados!");
    commit();
  });

  // SIMULADOR

  $("simForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const initial = Number($("initial").value);
    const monthly = Number($("monthly").value);
    const rate = Number($("rate").value) / 100;
    const months = Number($("months").value);

    if (
      !Number.isFinite(initial) ||
      !Number.isFinite(monthly) ||
      !Number.isFinite(rate) ||
      !Number.isInteger(months) ||
      initial <= 0 ||
      monthly < 0 ||
      rate < 0 ||
      rate > 0.1 ||
      months < 1 ||
      months > 120
    ) return;

    let total = initial;

    for (let i = 0; i < months; i++) {
      total = total * (1 + rate) + monthly;
    }

    const invested = initial + monthly * months;

    $("result").textContent = money(total);
    $("invested").textContent = money(invested);
    $("interest").textContent = money(total - invested);

    $("explain").textContent =
      `Resultado de ${months} meses com taxa hipotética de ` +
      `${(rate * 100).toLocaleString("pt-BR")}% ao mês. ` +
      "Não é uma promessa de rendimento.";

    state.simulated = true;
    toast("Simulação concluída!");
    commit();
  });

  // NAVEGAÇÃO DAS MISSÕES

  document.querySelectorAll("[data-mission]")
    .forEach(button => {
      button.addEventListener("click", () => {
        const destinations = {
          register: "financas.html",
          goal: "financas.html",
          invest: "aprender.html"
        };

        location.href =
          destinations[button.dataset.mission];
      });
    });

  // RECOMPENSAS

  document.querySelectorAll(".redeem")
    .forEach(button => {
      button.addEventListener("click", () => {
        const cost = Number(button.dataset.cost);
        const id = button.dataset.id;

        if (state.redeemed.includes(id)) return;

        if (state.points < cost) {
          toast("Pontos insuficientes.");
          return;
        }

        state.points -= cost;
        state.redeemed.push(id);

        toast("Recompensa resgatada!");
        commit();
      });
    });

  // MENU LATERAL

  $("tipText").textContent =
    tips[new Date().getDate() % tips.length];

  // INICIAR SITE

  if ($("transactionDate")) $("transactionDate").value = [new Date().getFullYear(), String(new Date().getMonth()+1).padStart(2,"0"), String(new Date().getDate()).padStart(2,"0")].join("-");
  render();
});

(async () => {
  const config = window.UPFINANCE_CONFIG;

  const authPage =
    location.pathname.endsWith("/login.html");

  const showError = message => {
    const target =
      document.getElementById("authMessage");

    if (target) {
      target.textContent = message;
      return;
    }

    document.body.innerHTML = "";

    const paragraph = document.createElement("p");

    paragraph.style.cssText =
      "padding:2rem;font:16px sans-serif";

    paragraph.textContent = message;

    document.body.appendChild(paragraph);
  };

  if (!config?.url || !config?.anonKey) {
    showError(
      "Configure a URL e a chave pública do Supabase em config.js."
    );

    return;
  }

  let client;

  try {
    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );

    client = createClient(
      config.url,
      config.anonKey
    );
  } catch {
    showError(
      "Não foi possível carregar a autenticação. " +
      "Verifique sua conexão."
    );

    return;
  }

  const {
    data: { session },
    error
  } = await client.auth.getSession();

  if (error) {
    showError(
      "Não foi possível verificar sua sessão."
    );

    return;
  }

  if (authPage) {
    const form =
      document.getElementById("authForm");

    const title =
      document.getElementById("authTitle");

    const submit =
      document.getElementById("authSubmit");

    let mode =
      new URLSearchParams(location.search)
        .get("mode") === "reset"
        ? "reset"
        : "login";

    const setMode = value => {
      mode = value;

      title.textContent = {
        login: "Boas-vindas de volta",
        signup: "Comece sua jornada",
        reset: "Crie uma nova senha"
      }[mode];

      submit.textContent = {
        login: "Entrar",
        signup: "Criar conta",
        reset: "Salvar senha"
      }[mode];

      const email =
        document.getElementById("authEmail");

      email.hidden = mode === "reset";
      email.required = mode !== "reset";

      showError("");
    };

    setMode(mode);

    if (session && mode !== "reset") {
      location.replace("index.html");
      return;
    }

    document
      .querySelectorAll("[data-mode]")
      .forEach(button => {
        button.addEventListener("click", () => {
          setMode(button.dataset.mode);
        });
      });

    form.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        submit.disabled = true;

        const email = document
          .getElementById("authEmail")
          .value
          .trim();

        const password = document
          .getElementById("authPassword")
          .value;

        let result;

        if (mode === "signup") {
          result = await client.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: new URL(
                "login.html",
                location.href
              ).href
            }
          });
        } else if (mode === "reset") {
          result = await client.auth.updateUser({
            password
          });
        } else {
          result =
            await client.auth.signInWithPassword({
              email,
              password
            });
        }

        submit.disabled = false;

        if (result.error) {
          showError(result.error.message);
          return;
        }

        if (
          mode === "signup" &&
          !result.data.session
        ) {
          showError(
            "Confira seu e-mail para confirmar a conta."
          );

          return;
        }

        location.replace("index.html");
      }
    );

    document
      .getElementById("forgot")
      .addEventListener("click", async () => {
        const email = document
          .getElementById("authEmail")
          .value
          .trim();

        if (!email) {
          showError(
            "Informe seu e-mail para recuperar a senha."
          );

          return;
        }

        const { error } =
          await client.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: new URL(
                "login.html?mode=reset",
                location.href
              ).href
            }
          );

        showError(
          error
            ? error.message
            : "Se o e-mail estiver cadastrado, " +
              "enviaremos um link de recuperação."
        );
      });

    document
      .getElementById("google")
      .addEventListener("click", async () => {
        const { error } =
          await client.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: new URL(
                "index.html",
                location.href
              ).href
            }
          });

        if (error) {
          showError(error.message);
        }
      });

    return;
  }

  if (!session) {
    location.replace("login.html");
    return;
  }

  const uid = session.user.id;

  window.UPFINANCE_KEY =
    `upfinance_db_${uid}`;

  window.UPFINANCE_BACKUP =
    `upfinance_demo_backup_v1_${uid}`;

  const {
    data,
    error: loadError
  } = await client
    .from("app_states")
    .select("data")
    .eq("user_id", uid)
    .maybeSingle();

  if (loadError) {
    showError(
      "Não foi possível carregar seus dados. " +
      "Verifique a conexão e tente novamente."
    );

    return;
  }

  const {
    data: transactions,
    error: transactionError
  } = await client
    .from("transactions")
    .select(
      "legacy_id,date,description,amount,kind,category"
    )
    .eq("user_id", uid)
    .order("created_at");

  if (transactionError) {
    showError(
      "Não foi possível carregar as movimentações. " +
      "Verifique a conexão e tente novamente."
    );

    return;
  }

  const state = data?.data || {};

  state.transactions = (transactions || []).map(
    transaction => ({
      id: transaction.legacy_id,
      date: transaction.date,
      desc: transaction.description,
      amount: Number(transaction.amount),
      kind: transaction.kind,
      category: transaction.category
    })
  );

  // A demonstração é local e não é enviada ao banco.
  if (
    !localStorage.getItem(
      window.UPFINANCE_BACKUP
    )
  ) {
    localStorage.setItem(
      window.UPFINANCE_KEY,
      JSON.stringify(state)
    );
  }

  let queue = Promise.resolve();

  window.upfinanceSave = value => {
    if (
      localStorage.getItem(
        window.UPFINANCE_BACKUP
      )
    ) {
      return Promise.resolve();
    }

    const snapshot =
      JSON.parse(JSON.stringify(value));

    queue = queue
      .catch(() => {})
      .then(async () => {
        const { error } = await client.rpc(
          "save_upfinance_state",
          {
            payload: snapshot
          }
        );

        const status =
          document.getElementById("syncStatus");

        if (error) {
          if (status) {
            status.textContent =
              "Erro ao salvar. Confira a conexão " +
              "e tente novamente.";
          }

          throw error;
        }

        if (status) {
          status.textContent =
            "Alterações salvas";
        }
      });

    queue.catch(() => {});

    return queue;
  };

  client.auth.onAuthStateChange(event => {
    if (event === "SIGNED_OUT") {
      location.replace("login.html");
    }
  });

  const logout =
    document.getElementById("logout");

  if (logout) {
    logout.addEventListener(
      "click",
      async () => {
        try {
          await queue;
        } catch {
          alert(
            "Há alterações não salvas. " +
            "Verifique sua conexão antes de sair."
          );

          return;
        }

        await client.auth.signOut();
      }
    );
  }

  const scripts = (
    document.body.dataset.scripts || ""
  )
    .split(",")
    .filter(Boolean);

  for (const source of scripts) {
    await new Promise((resolve, reject) => {
      const script =
        document.createElement("script");

      script.src = source;
      script.onload = resolve;
      script.onerror = reject;

      document.body.appendChild(script);
    });
  }
})().catch(() => {
  document.body.textContent =
    "Não foi possível iniciar o UpFinance. " +
    "Recarregue a página.";
});

(() => {
  const params = new URLSearchParams(window.location.search);

  const requestedTrack = params.get("tipo");

  const track = ["kids", "teens", "adults"].includes(requestedTrack)
    ? requestedTrack
    : "teens";

  const names = {
    kids: "Crianças",
    teens: "Jovens",
    adults: "Adultos"
  };

  const descriptions = {
    kids:
      "Um espaço para descobrir o valor do dinheiro, " +
      "fazer escolhas e aprender com vídeos.",

    teens:
      "Uma jornada de organização financeira, " +
      "investimentos e pensamento crítico.",

    adults:
      "Aulas aprofundadas sobre planejamento, investimentos, " +
      "avaliação de ativos e gestão de riscos."
  };

  const lessons = window.UP_CURSOS?.[track] || [];

  const videos =
    (window.UP_VIDEOS && window.UP_VIDEOS[track]) || [];

  const stateKey = "upfinance_db";

  const $ = id => document.getElementById(id);

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  function lessonLink(index) {
    return `aula.html?tipo=${track}&aula=${index + 1}`;
  }

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(stateKey)) || {};
    } catch {
      return {};
    }
  }

  function isRead(index) {
    const state = getState();

    return (state.lessonsRead || []).includes(
      `${track}-${index + 1}`
    );
  }

  // GERAR PLAYER DE VÍDEO

  function youtubeEmbedURL(video) {
    const input = video?.incorporacao || video?.youtube;
    if (typeof input !== "string" || !input.trim()) return null;

    let source = input.trim();
    if (source.startsWith("<")) {
      const parsed = new DOMParser().parseFromString(source, "text/html");
      source = parsed.querySelector("iframe")?.getAttribute("src") || "";
    }

    try {
      const url = new URL(source);
      const hosts = ["www.youtube.com", "www.youtube-nocookie.com"];
      if (url.protocol !== "https:" || !hosts.includes(url.hostname) ||
          url.port || url.username || url.password ||
          !/^\/embed\/[A-Za-z0-9_-]{11}$/.test(url.pathname)) return null;

      // Reconstrói o endereço: nenhum atributo ou HTML colado é inserido na página.
      const safeURL = new URL(`https://${url.hostname}${url.pathname}`);
      for (const key of ["start", "end"]) {
        const value = url.searchParams.get(key);
        if (value && /^\d{1,8}$/.test(value)) safeURL.searchParams.set(key, value);
      }
      return safeURL.href;
    } catch {
      return null;
    }
  }

  function videoHTML(video) {
    if (!video) {
      return `
        <div class="video-placeholder">
          <span>Videoaula</span>
          <p>Seu vídeo aparecerá aqui</p>
        </div>
      `;
    }

    if (video.arquivo) {
      return `
        <video
          controls
          playsinline
          preload="metadata"
          src="${escapeHTML(video.arquivo)}"
        ></video>
      `;
    }

    const youtubeURL = youtubeEmbedURL(video);
    if (youtubeURL) {
      return `
        <iframe
          src="${escapeHTML(youtubeURL)}"
          title="${escapeHTML(video.titulo || "Videoaula")}"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      `;
    }

    return `
      <div class="video-placeholder">
        Vídeo não configurado
      </div>
    `;
  }

  // SISTEMA DE VÍDEO AMPLIADO

  let activeModal = null;
  let previousFocus = null;

  function openVideo(videoElement) {
    if (!videoElement || activeModal) return;

    previousFocus = document.activeElement;

    const isLocalVideo =
      videoElement.tagName.toLowerCase() === "video";

    // Pausa o vídeo original antes de ampliar.
    if (isLocalVideo) {
      videoElement.pause();
    }

    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Videoaula ampliada");
    modal.tabIndex = -1;

    const container = document.createElement("div");
    container.className = "video-modal-container";

    const header = document.createElement("div");
    header.className = "video-modal-header";

    const title = document.createElement("h2");
    title.textContent = "Videoaula";

    const closeButton = document.createElement("button");
    closeButton.className = "video-modal-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Fechar vídeo ampliado");
    closeButton.textContent = "Fechar ×";

    const playerArea = document.createElement("div");
    playerArea.className = "video-modal-player";

    let expandedPlayer;

    if (isLocalVideo) {
      expandedPlayer = document.createElement("video");
      expandedPlayer.src = videoElement.currentSrc || videoElement.src;
      expandedPlayer.controls = true;
      expandedPlayer.playsInline = true;
      expandedPlayer.autoplay = false;
      expandedPlayer.preload = "metadata";

      // Mantém o ponto em que a pessoa parou.
      const currentTime = videoElement.currentTime;

      expandedPlayer.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(currentTime) && currentTime > 0) {
          expandedPlayer.currentTime = currentTime;
        }
      }, { once: true });

    } else {
      expandedPlayer = document.createElement("iframe");

      expandedPlayer.src = videoElement.src;
      expandedPlayer.title = videoElement.title || "Videoaula";
      expandedPlayer.allow =
        "autoplay; encrypted-media; picture-in-picture";
      expandedPlayer.referrerPolicy =
        "strict-origin-when-cross-origin";
      expandedPlayer.allowFullscreen = true;
    }

    function closeVideo() {
      if (!activeModal) return;

      if (isLocalVideo) {
        videoElement.currentTime =
          expandedPlayer.currentTime || videoElement.currentTime;

        expandedPlayer.pause();
        expandedPlayer.removeAttribute("src");
        expandedPlayer.load();
      } else {
        expandedPlayer.src = "about:blank";
      }

      document.removeEventListener("keydown", onKeyDown);

      modal.remove();
      activeModal = null;

      document.body.classList.remove("video-modal-open");

      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus();
      }

      previousFocus = null;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        closeVideo();
      }

      if (event.key === "Tab") {
        const focusable = modal.querySelectorAll(
          'button, video[controls], iframe, [tabindex="0"]'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    closeButton.addEventListener("click", closeVideo);

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeVideo();
      }
    });

    header.appendChild(title);
    header.appendChild(closeButton);

    playerArea.appendChild(expandedPlayer);

    container.appendChild(header);
    container.appendChild(playerArea);

    modal.appendChild(container);

    document.body.appendChild(modal);
    document.body.classList.add("video-modal-open");

    activeModal = modal;

    document.addEventListener("keydown", onKeyDown);

    closeButton.focus();
  }

  // ADICIONAR BOTÕES PARA AMPLIAR OS VÍDEOS

  function setupExpandableVideos() {
    document.querySelectorAll(
      ".video-card video, " +
      ".video-card iframe, " +
      ".reading-aside video, " +
      ".reading-aside iframe, " +
      ".lesson-inline-video video, " +
      ".lesson-inline-video iframe"
    ).forEach(player => {
      const wrapper = player.parentElement;

      if (wrapper.querySelector(".expand-video-btn")) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "expand-video-btn";

      button.innerHTML = `
        <span class="expand-icon" aria-hidden="true">⛶</span>
        Ampliar vídeo
      `;

      button.addEventListener("click", () => {
        openVideo(player);
      });

      player.insertAdjacentElement("afterend", button);
    });
  }

  // PÁGINA DA TRILHA

  if ($("courseList")) {
    document.title = `${names[track]} • UpFinance`;

    $("trackTitle").textContent =
      `Trilha para ${names[track]}`;

    $("trackDesc").textContent = descriptions[track];

    $("courseCount").textContent =
      `${lessons.length} aulas completas`;

    document.querySelectorAll(".track-switch a")
      .forEach(link => {
        link.classList.toggle(
          "current",
          link.href.includes(`tipo=${track}`)
        );
      });

    $("courseList").innerHTML = lessons
      .map((lesson, index) => `
        <a class="course-tile" href="${lessonLink(index)}">
          <div class="course-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div>
            <small>
              ${
                isRead(index)
                  ? "✓ AULA CONCLUÍDA"
                  : `AULA ${index + 1} • +10 PONTOS`
              }
            </small>

            <h3>${escapeHTML(lesson[0])}</h3>
            <p>${escapeHTML(lesson[1])}</p>
          </div>

          <span class="course-arrow">→</span>
        </a>
      `)
      .join("");

    $("videos").innerHTML = videos.length
      ? videos.map(video => `
          <article class="video-card">
            ${videoHTML(video)}
            <h3>${escapeHTML(video.titulo || "Videoaula")}</h3>
          </article>
        `).join("")
      : `
          <div class="video-card">
            ${videoHTML(null)}
            <h3>Espaço para suas videoaulas</h3>
            <p>
              Edite videos.js para adicionar vídeos a esta trilha.
            </p>
          </div>
        `;

    setupExpandableVideos();
  }

  // PÁGINA INDIVIDUAL DA AULA

  if ($("lessonContent")) {
    const number = Number(params.get("aula"));

    if (
      !Number.isInteger(number) ||
      number < 1 ||
      number > lessons.length
    ) {
      window.location.replace(
        `trilha.html?tipo=${track}`
      );
      return;
    }

    const lesson = lessons[number - 1];

    if (track === "teens" || track === "adults") {
      document.querySelector(".reading-aside").hidden = true;
      document.querySelector(".reading-layout").classList.add("reading-layout-full");
    }

    document.title = `${lesson[0]} • UpFinance`;

    $("backTrack").href = `trilha.html?tipo=${track}`;

    $("lessonMeta").textContent =
      `${names[track].toUpperCase()} • ` +
      `AULA ${String(number).padStart(2, "0")}`;

    $("lessonTitle").textContent = lesson[0];
    $("lessonDesc").textContent = lesson[1];

    const sectionTitles = [
      "Entenda o assunto",
      "Vamos aprofundar",
      "Exemplo e contexto",
      "Coloque em prática"
    ];

    $("lessonContent").innerHTML = lesson[2]
      .map((paragraph, index) => `
        <section class="reading-section">
          <h2>
            ${sectionTitles[index] || "Saiba mais"}
          </h2>

          <p>${escapeHTML(paragraph)}</p>
        </section>
      `)
      .join("");

    const lessonVideo = videos.find(
      video => video.aula === number
    );

    if (track === "kids") {
      $("lessonVideo").innerHTML = videoHTML(lessonVideo);
    } else if (lessonVideo && (lessonVideo.arquivo || youtubeEmbedURL(lessonVideo))) {
      const videoSection = document.createElement("section");
      videoSection.className = "lesson-inline-video";
      const heading = document.createElement("h2");
      heading.textContent = "Videoaula";
      videoSection.appendChild(heading);
      const player = document.createElement("div");
      player.innerHTML = videoHTML(lessonVideo);
      videoSection.appendChild(player);
      $("lessonContent").after(videoSection);
    }

    setupExpandableVideos();

    const nextButton = $("nextLesson");

    nextButton.href =
      number < lessons.length
        ? lessonLink(number)
        : `trilha.html?tipo=${track}`;

    nextButton.textContent =
      number < lessons.length
        ? "Próxima aula →"
        : "Voltar à trilha →";

    function refresh() {
      const completed = isRead(number - 1);

      $("finishLesson").textContent = completed
        ? "✓ Aula concluída"
        : "Concluir aula • +10 pontos";

      $("finishLesson").disabled = completed;

      const total = lessons.filter(
        (_, index) => isRead(index)
      ).length;

      $("readingProgress").textContent =
        `${total} de ${lessons.length} aulas concluídas nesta trilha.`;
    }

    $("finishLesson").addEventListener("click", () => {
      const state = getState();

      state.lessonsRead = Array.isArray(state.lessonsRead)
        ? state.lessonsRead
        : [];

      const key = `${track}-${number}`;

      if (state.lessonsRead.includes(key)) return;

      state.lessonsRead.push(key);

      state.points = (Number(state.points) || 0) + 10;

      state.completedMissions =
        state.completedMissions || {
          register: false,
          goal: false,
          invest: false
        };

      if (
        state.simulated &&
        !state.completedMissions.invest
      ) {
        state.completedMissions.invest = true;
        state.points += 40;
      }

      try {
        localStorage.setItem(
          stateKey,
          JSON.stringify(state)
        );
      } catch {
        alert(
          "Não foi possível salvar seu progresso neste navegador."
        );
        return;
      }

      refresh();
    });

    refresh();
  }
})();


// ADICIONE OU TROQUE OS VÍDEOS AQUI.
// Escolha a trilha: kids (crianças), teens (jovens) ou adults (adultos).
// Informe o número da aula e cole o código de incorporação do YouTube
// entre crases, como no exemplo comentado abaixo. Também é possível usar
// apenas a URL https://www.youtube.com/embed/ID_DO_VIDEO em `youtube`.
// São aceitas incorporações HTTPS de www.youtube.com e www.youtube-nocookie.com.
// Os arquivos locais já configurados continuam funcionando.

window.UP_VIDEOS = {

  // VÍDEOS DAS CRIANÇAS
  kids: [
    {
      titulo: "De onde vem o dinheiro?",
      aula: 1,
      incorporacao: `<iframe width="560" height="315" src="https://www.youtube.com/embed/9MxfeSA5X0Q?si=N-eR1qzXcKLGCElg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    },

    {
      titulo: "Necessidade ou vontade?",
      aula: 2,
      incorporacao: `<iframe width="560" height="315" src="https://www.youtube.com/embed/CDv3-gDDl0g?si=GbJy2Y7yYeduP4gP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    },

    {
      titulo: "Meu primeiro cofrinho",
      aula: 3,
      incorporacao: `<iframe width="560" height="315" src="https://www.youtube.com/embed/5Iy7Xoi1cRc?si=favsBF6YZuLwNFwF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    },

    {
      titulo: "Comparando preços",
      aula: 4,
      incorporacao: `<iframe width="560" height="315" src="https://www.youtube.com/embed/o0BUo2-qddc?si=2K5RT2FN6km7MIXe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    }
  ],

  teens: [
    // Exemplo:
    // {
    //   titulo: "Minha primeira videoaula",
    //   aula: 1,
    //   incorporacao: `<iframe width="560" height="315" src="https://www.youtube.com/embed/ID_DO_VIDEO" title="YouTube video player" frameborder="0" allowfullscreen></iframe>`
    // }
  ],

  adults: [
    // Exemplo:
    // {
    //   titulo: "Aula sobre renda fixa",
    //   aula: 1,
    //   incorporacao: `<iframe src="https://www.youtube.com/embed/ID_DO_VIDEO" title="Videoaula" allowfullscreen></iframe>`
    // }
  ]
};

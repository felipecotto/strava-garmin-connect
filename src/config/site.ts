export const siteConfig = {
  name: "CTT",
  tagline: "Arquivo de Performance",
  description:
    "Sem feed. Sem ranking. Sem frase de efeito. Só o histórico — pace, volume, frequência — do jeito que aconteceu.",
  author: {
    name: "Felipe Oliveira",
    handle: "felipecotto",
    role: "Product Designer & Front-end Developer",
    bio: "O CTT começou porque um designer queria ver o que já tinha treinado.",
    location: "São Paulo, SP",
    links: {
      github: "https://github.com/felipecotto",
      linkedin: "https://www.linkedin.com/in/felipecotto/",
      instagram: "https://www.instagram.com/felipe.cotto",
    },
  },
  domain: "usectt.com.br",
  connectStravaPath: "/connect/strava" as const,
  settingsPath: "/perfil" as const,
  exampleProfilePath: "/felipe-oliveira" as const,
  exampleProfileSlug: "felipe-oliveira",
  stravaActivityUrl: "https://www.strava.com/activities",
} as const

export type SiteConfig = typeof siteConfig

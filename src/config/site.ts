export const siteConfig = {
  name: "CTT.",
  tagline: "CTT. A inteligência de dados que sua corrida precisa.",
  description:
    "CTT conecta com sua conta Strava e transforma suas corridas em decisões claras — volume, ritmo, fadiga e objetivo em um só lugar.",
  author: {
    name: "Felipe Oliveira",
    handle: "felipecotto",
    role: "Product Designer & Front-end Developer",
    bio: "Designers que constroem: conectei produto, design system e front-end para criar uma ferramenta que uso toda semana. O CTT é open source e está em produção real.",
    location: "São Paulo, SP",
    links: {
      github: "https://github.com/felipecotto",
      linkedin: "https://www.linkedin.com/in/felipecotto/",
      instagram: "https://www.instagram.com/felipe.cotto",
    },
  },
  connectStravaPath: "/connect/strava" as const,
} as const

export type SiteConfig = typeof siteConfig

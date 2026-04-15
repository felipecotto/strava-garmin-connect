export const siteConfig = {
  name: "CTT.",
  tagline: "CTT. A inteligência de dados que sua corrida precisa.",
  description:
    "Case de portfólio: product design, design system em shadcn/ui e front-end Next.js para conectar dados da API do Strava e transformar volume, ritmo e consistência em decisões de treino.",
  author: {
    name: "Felipe Oliveira",
    handle: "felipecotto",
    role: "Product Designer & Front-end Developer",
    bio: "Conecto pesquisa, interface e código: deste case à entrega em produção, com foco em clareza para o usuário e consistência de componentes documentados no Storybook.",
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

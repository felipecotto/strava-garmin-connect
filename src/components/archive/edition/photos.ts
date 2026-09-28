/**
 * Fotos da edição, por perfil. Só o arquivo de exemplo tem fotos por enquanto;
 * os capítulos funcionam sem elas (o layout troca a foto pelo dado).
 */
export type EditionPhoto = { src: string; alt: string; width: number; height: number }

export type EditionPhotos = Partial<
  Record<"largada" | "habito" | "volume" | "muro" | "chegada" | "suaVez", EditionPhoto>
>

const FELIPE: EditionPhotos = {
  largada: {
    src: "/edition/felipe-oliveira/largada.jpg",
    alt: "Felipe correndo de lado, em movimento borrado, entre as árvores do Ibirapuera",
    width: 1240,
    height: 1320,
  },
  habito: {
    src: "/edition/felipe-oliveira/habito.jpg",
    alt: "Felipe correndo de frente na faixa central de uma pista do parque, em preto e branco",
    width: 1120,
    height: 1520,
  },
  volume: {
    src: "/edition/felipe-oliveira/volume.jpg",
    alt: "Felipe pequeno no meio de árvores retorcidas, correndo numa pista do parque",
    width: 2400,
    height: 800,
  },
  muro: {
    src: "/edition/felipe-oliveira/muro.jpg",
    alt: "Pernas e tênis parados no asfalto rachado, em preto e branco",
    width: 880,
    height: 1160,
  },
  chegada: {
    src: "/edition/felipe-oliveira/chegada.jpg",
    alt: "Felipe sorrindo para a câmera depois do treino, em preto e branco",
    width: 880,
    height: 1120,
  },
  suaVez: {
    src: "/edition/felipe-oliveira/sua-vez.jpg",
    alt: "Corredor em movimento intenso entre as árvores",
    width: 1000,
    height: 1440,
  },
}

const PHOTOS_BY_SLUG: Record<string, EditionPhotos> = {
  "felipe-oliveira": FELIPE,
}

export function editionPhotos(slug: string): EditionPhotos {
  return PHOTOS_BY_SLUG[slug] ?? {}
}

/** Coordenadas do lugar das fotos, mostradas como metadado técnico. */
export const PHOTO_COORDINATES: Record<string, string> = {
  "felipe-oliveira": "−23,5874 / −46,6576 · Ibirapuera",
}

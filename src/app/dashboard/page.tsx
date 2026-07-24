import { redirect } from "next/navigation"

export default async function DashboardRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") qs.set(key, value)
  }
  const suffix = qs.toString()
  redirect(suffix ? `/?${suffix}` : "/")
}

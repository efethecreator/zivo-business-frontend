import { redirect } from "next/navigation"

export default function Home() {
  // Ana sayfa doğrudan dashboard'a yönlendirir
  redirect("/dashboard")
  return null
}

import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/admin" className="font-medium">
          Panel de administración
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin/settings" className="text-muted hover:text-foreground">
            Personalización
          </Link>
          <Link href="/" target="_blank" className="text-muted hover:text-foreground">
            Ver sitio
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="text-muted hover:text-foreground">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

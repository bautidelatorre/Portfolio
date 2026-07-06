import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border p-8 text-center">
        <h1 className="text-xl font-semibold">Panel de administración</h1>
        <p className="mt-2 text-sm text-muted">
          Iniciá sesión con tu cuenta de Google para gestionar los proyectos.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="w-full rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
          >
            Iniciar sesión con Google
          </button>
        </form>
      </div>
    </div>
  );
}

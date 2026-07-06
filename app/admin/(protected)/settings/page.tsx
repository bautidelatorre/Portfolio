import { getSiteSettings } from "@/lib/actions/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Personalización</h1>
      <p className="mt-1 text-sm text-muted">
        Cambiá el estilo visual y la organización del sitio.
      </p>
      <div className="mt-6">
        <SiteSettingsForm defaultValues={settings} />
      </div>
    </div>
  );
}

import { getSiteSettings } from "@/lib/actions/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { FloatingRendersEditor } from "@/components/admin/FloatingRendersEditor";

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

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Imágenes de fondo flotantes</h2>
        <p className="mt-1 text-sm text-muted">
          Subí renders para que floten de fondo en cada sección. Elegí si van
          detrás o encima del contenido, y arrastralas para acomodarlas.
        </p>
        <div className="mt-6">
          <FloatingRendersEditor initialRenders={settings.floatingRenders} />
        </div>
      </div>
    </div>
  );
}

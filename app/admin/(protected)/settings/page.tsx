import { getSiteSettings } from "@/lib/actions/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { FloatingRendersEditor } from "@/components/admin/FloatingRendersEditor";
import { GlowsEditor } from "@/components/admin/GlowsEditor";
import { SiteCopyForm } from "@/components/admin/SiteCopyForm";
import { ContentOffsetsEditor } from "@/components/admin/ContentOffsetsEditor";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Personalización</h1>
          <p className="mt-1 text-sm text-muted">
            Cambiá el estilo visual y la organización del sitio.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium whitespace-nowrap hover:bg-muted-bg"
        >
          Ver sitio ↗
        </a>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Textos del sitio</h2>
        <p className="mt-1 text-sm text-muted">
          Todo el texto visible del sitio: nav, hero, bio, títulos de
          sección y botones. Los colores y la tipografía se manejan en
          &quot;Estilo&quot;, debajo.
        </p>
        <div className="mt-6">
          <SiteCopyForm defaultValues={settings.siteCopy} />
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Estilo</h2>
        <p className="mt-1 text-sm text-muted">
          Colores, tipografía, orden de secciones y otras opciones visuales.
        </p>
        <div className="mt-6">
          <SiteSettingsForm defaultValues={settings} />
        </div>
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

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Manchas de luz</h2>
        <p className="mt-1 text-sm text-muted">
          Los brillos difuminados de fondo. Movelos, cambiales el color, el
          difuminado y la opacidad por sección.
        </p>
        <div className="mt-6">
          <GlowsEditor initialGlows={settings.glows} />
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold">Posición de textos (mobile)</h2>
        <p className="mt-1 text-sm text-muted">
          Ajustá qué tan arriba o abajo aparece el título, texto y botón de
          cada sección en celulares, sin tocar la versión de escritorio.
        </p>
        <div className="mt-6">
          <ContentOffsetsEditor initialOffsets={settings.mobileContentOffsets} />
        </div>
      </div>
    </div>
  );
}

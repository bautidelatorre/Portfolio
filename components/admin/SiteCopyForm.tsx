"use client";

import { useState, useTransition } from "react";
import { updateSiteCopy } from "@/lib/actions/site-copy";
import type { SiteCopy } from "@/lib/db/schema";

const FIELDS: {
  key: keyof SiteCopy;
  label: string;
  group: string;
  multiline?: boolean;
}[] = [
  { key: "navProjects", label: "\"Projects\" link", group: "Navigation" },
  { key: "navAbout", label: "\"About\" link", group: "Navigation" },
  { key: "navContact", label: "\"Contact\" link", group: "Navigation" },
  { key: "heroKicker", label: "Kicker (small label above headline)", group: "Hero" },
  { key: "heroHeadline", label: "Headline", group: "Hero", multiline: true },
  { key: "heroSubtext", label: "Subtext", group: "Hero", multiline: true },
  { key: "heroPrimaryCta", label: "Primary button", group: "Hero" },
  { key: "heroSecondaryCta", label: "Secondary button", group: "Hero" },
  { key: "aboutLabel", label: "Section label", group: "About" },
  { key: "aboutHeadline", label: "Headline", group: "About", multiline: true },
  { key: "aboutBio", label: "Bio paragraph", group: "About", multiline: true },
  { key: "projectsLabel", label: "Section label", group: "Projects" },
  { key: "contactLabel", label: "Section label", group: "Contact" },
  { key: "contactHeadline", label: "Headline", group: "Contact", multiline: true },
  { key: "footerName", label: "Name in copyright line", group: "Footer" },
];

export function SiteCopyForm({ defaultValues }: { defaultValues: SiteCopy }) {
  const [values, setValues] = useState<SiteCopy>(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function setField(key: keyof SiteCopy, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateSiteCopy(values);
        setSuccess(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  const groups = Array.from(new Set(FIELDS.map((f) => f.group)));

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Saved. Check the site in another tab to see the changes.
        </p>
      )}

      {groups.map((group) => (
        <div key={group} className="space-y-4">
          <h3 className="text-sm font-semibold">{group}</h3>
          {FIELDS.filter((f) => f.group === group).map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-muted">{field.label}</label>
              {field.multiline ? (
                <textarea
                  value={values[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              ) : (
                <input
                  value={values[field.key]}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-dark px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save texts"}
      </button>
    </form>
  );
}

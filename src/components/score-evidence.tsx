import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { OrgRow } from "@/lib/orgs.functions";
import { evidenceDate, profileEvidence } from "@/lib/score-evidence";

type Props = { organization: OrgRow; ranking?: string; retrievedAt?: string | null };

export function ScoreEvidence({ organization: o, ranking, retrievedAt }: Props) {
  const evidence = profileEvidence(o);
  const matches = o.trust_score === evidence.calculatedScore && o.completeness === evidence.completeness;
  return (
    <section className="min-w-0 space-y-5 text-sm text-ink-mid">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div><dt className="text-xs font-semibold uppercase text-ink-muted">Source</dt><dd className="mt-1">M2 organization record · <span className="break-all">{o.slug}</span></dd></div>
        <div><dt className="text-xs font-semibold uppercase text-ink-muted">Stored score</dt><dd className="mt-1 font-semibold">{o.trust_score}/100 · {o.completeness}% stored completeness</dd></div>
        <div><dt className="text-xs font-semibold uppercase text-ink-muted">Profile last changed</dt><dd className="mt-1">{evidenceDate(o.updated_at)}</dd></div>
        <div><dt className="text-xs font-semibold uppercase text-ink-muted">Records retrieved</dt><dd className="mt-1">{evidenceDate(retrievedAt)}</dd></div>
      </dl>
      <div className="border-y border-border py-4">
        <h3 className="font-semibold text-ink">Scoring method · Profile completeness v1</h3>
        <p className="mt-2">{evidence.filled}/11 fields present → {evidence.completeness}% calculated completeness.</p>
        <p className="mt-1">40 + round(completeness × 0.5), capped at 100 → <strong>{evidence.calculatedScore}/100</strong>.</p>
        <p className={`mt-2 ${matches ? "text-primary" : "text-destructive"}`}>{matches ? "Stored values match the current formula. This does not establish how or when this score was originally assigned." : "Stored values do not match the current formula. Original score methodology is undocumented; this score is not a reproducible measurement."}</p>
        <p className="mt-2 text-xs text-ink-muted">Score calculation time, original publisher, and external check date: not recorded. A profile edit or retrieval time is not an independent verification date.</p>
      </div>
      {ranking && <div><h3 className="font-semibold text-ink">Ranking evidence</h3><p className="mt-1">{ranking}</p><p className="mt-1 text-xs text-ink-muted">Rank = 1 + number of records with a higher stored score. Equal scores share a rank; these comparisons inherit each score’s evidence limitations.</p></div>}
      <div>
        <h3 className="mb-2 font-semibold text-ink">Supporting profile fields</h3>
        <dl className="divide-y divide-border">
          {evidence.fields.map((f) => <div key={f.key} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2"><dt className="text-ink-muted">{f.label}</dt><dd className="max-h-24 overflow-auto whitespace-pre-line break-words">{f.present ? f.value : "Not provided"}</dd></div>)}
        </dl>
      </div>
      <div className="border-t border-border pt-4 text-xs text-ink-muted">
        <p>Verification status on record: <strong>{o.verification_status}</strong>. Reviewer, review date, and supporting documents are not recorded.</p>
        <p className="mt-2">Profile fields are stored claims, not proof of accuracy. Website and contact presence do not prove reachability. SEO, backlinks, traffic, AI visibility, and engagement measurements are unavailable and are not inputs to this formula.</p>
      </div>
    </section>
  );
}

export function ScoreEvidenceButton(props: Props) {
  return <Dialog><DialogTrigger asChild><Button variant="outline" size="sm" aria-label={`Score evidence for ${props.organization.name}`}><FileSearch className="h-4 w-4" /> Evidence</Button></DialogTrigger><DialogContent className="max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{props.organization.name} · Score evidence</DialogTitle><DialogDescription>Sources, freshness, and supporting records behind this score.</DialogDescription></DialogHeader><ScoreEvidence {...props} /></DialogContent></Dialog>;
}
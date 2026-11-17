import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, Package, Save, Search, Settings2, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { trpc } from "@/lib/trpc";
import { applyPageMetadata, operationsMetadata } from "@/pageMetadata";
import { useEditableSampleRecords } from "@/hooks/useSampleContent";
import type { SampleRecordSeed } from "@shared/sample-content";

type RecordFilter = "all" | "page" | "product" | "operation";

const filterLabels: { key: RecordFilter; label: string }[] = [
  { key: "all", label: "All sample data" },
  { key: "page", label: "Page content" },
  { key: "product", label: "Products" },
  { key: "operation", label: "Operations" },
];

function recordTypeLabel(type: SampleRecordSeed["recordType"]) {
  return type === "page" ? "Page content" : type === "product" ? "Product" : type === "operation" ? "Operations record" : "Business information";
}

function errorMessage(error: unknown) {
  const code = (error as { data?: { code?: string } } | undefined)?.data?.code;
  if (code === "FORBIDDEN") return "This editor is restricted to administrators. Your account does not have the required role.";
  if (code === "UNAUTHORIZED") return "Sign in with an administrator account to edit sample records.";
  return "The editor could not load sample records. Check that Development Neon staging has been migrated and seeded.";
}

export default function Operations() {
  const recordsQuery = useEditableSampleRecords();
  const update = trpc.sampleContent.update.useMutation();
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState<RecordFilter>("all");
  const [selectedIdentity, setSelectedIdentity] = useState("operation:overview");
  const [labelDraft, setLabelDraft] = useState("");
  const [jsonDraft, setJsonDraft] = useState("");
  const [status, setStatus] = useState("");

  const records = recordsQuery.data ?? [];
  const editableRecords = useMemo(
    () => records.filter((record) => record.isSample && record.recordType !== "business"),
    [records],
  );
  const filteredRecords = filter === "all" ? editableRecords : editableRecords.filter((record) => record.recordType === filter);
  const selectedRecord = editableRecords.find((record) => `${record.recordType}:${record.recordKey}` === selectedIdentity) ?? filteredRecords[0];

  useEffect(() => {
    applyPageMetadata({ ...operationsMetadata, title: "Sample data editor — PRINCE BENJA DESIGNS", description: "Administrator editor for sample storefront and operations content.", noindex: true });
  }, []);

  useEffect(() => {
    if (!selectedRecord) return;
    setSelectedIdentity(`${selectedRecord.recordType}:${selectedRecord.recordKey}`);
    setLabelDraft(selectedRecord.label);
    setJsonDraft(JSON.stringify(selectedRecord.data, null, 2));
    setStatus("");
  }, [selectedRecord]);

  const handleSave = async () => {
    if (!selectedRecord || selectedRecord.recordType === "business") return;
    let data: unknown;
    try {
      data = JSON.parse(jsonDraft);
    } catch {
      setStatus("The JSON is not valid. Fix the syntax before saving.");
      return;
    }

    setStatus("");
    try {
      await update.mutateAsync({
        recordType: selectedRecord.recordType,
        recordKey: selectedRecord.recordKey,
        label: labelDraft,
        data,
      });
      await utils.sampleContent.editorRecords.invalidate();
      await utils.sampleContent.publicRecords.invalidate();
      setStatus("Sample record saved to Development Neon staging.");
    } catch (error) {
      const message = (error as { message?: string } | undefined)?.message;
      setStatus(message && !message.includes("Development staging") ? message : "The sample record could not be saved. Check the Development Neon staging connection and the record fields.");
    }
  };

  const chooseRecord = (record: SampleRecordSeed) => {
    setSelectedIdentity(`${record.recordType}:${record.recordKey}`);
    setLabelDraft(record.label);
    setJsonDraft(JSON.stringify(record.data, null, 2));
    setStatus("");
  };

  return (
    <main className="sample-editor-page">
      <a className="skip-link" href="#sample-editor-main">Skip to sample editor</a>
      <aside className="sample-editor-sidebar">
        <Link href="/" className="sample-editor-brand"><BrandLogo className="brand-logo-ops" /><span><strong>PRINCE BENJA</strong><small>SAMPLE CONTENT</small></span></Link>
        <div className="sample-editor-security"><ShieldCheck size={18} aria-hidden="true" /><div><strong>Administrator access</strong><small>Editing is protected on the server</small></div></div>
        <nav className="sample-editor-filters" aria-label="Filter editable sample records">
          {filterLabels.map(({ key, label }) => <button type="button" key={key} className={filter === key ? "sample-editor-filter-active" : ""} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}
        </nav>
        <div className="sample-editor-records" aria-label="Sample records">
          {filteredRecords.map((record) => {
            const identity = `${record.recordType}:${record.recordKey}`;
            const Icon = record.recordType === "page" ? FileText : record.recordType === "product" ? Package : Settings2;
            return <button type="button" key={identity} className={selectedRecord && identity === `${selectedRecord.recordType}:${selectedRecord.recordKey}` ? "sample-editor-record sample-editor-record-active" : "sample-editor-record"} onClick={() => chooseRecord(record)}><Icon size={17} aria-hidden="true" /><span><strong>{record.label}</strong><small>{recordTypeLabel(record.recordType)}</small></span></button>;
          })}
          {!recordsQuery.isLoading && filteredRecords.length === 0 && !recordsQuery.isError && <p className="sample-editor-empty">No sample records in this group.</p>}
        </div>
        <Link className="button button-outline sample-editor-home" href="/"><ArrowLeft size={16} aria-hidden="true" /> Return to storefront</Link>
      </aside>

      <section className="sample-editor-main" id="sample-editor-main" aria-labelledby="sample-editor-title">
        <header className="sample-editor-topbar"><div><span className="eyebrow">PRINCE BENJA DESIGNS / STORED SAMPLE DATA</span><h1 id="sample-editor-title">Sample data editor</h1></div><div className="sample-editor-badge"><ShieldCheck size={17} aria-hidden="true" /> Admin-only editing</div></header>
        <div className="sample-editor-content">
          <div className="sample-editor-notice" role="note"><FileText size={20} aria-hidden="true" /><div><strong>Only sample records are editable here.</strong><p>Updates are validated by the server and saved to the Development Neon staging database. Confirm business facts, prices and stock before using them as customer-facing offers.</p></div></div>
          {recordsQuery.isLoading && <p role="status" className="sample-editor-state">Loading sample records…</p>}
          {recordsQuery.isError && <div role="alert" className="sample-editor-error"><strong>Access or database issue</strong><p>{errorMessage(recordsQuery.error)}</p></div>}
          {!recordsQuery.isLoading && !recordsQuery.isError && selectedRecord && <>
            <div className="sample-editor-record-heading"><div><span className="eyebrow">{recordTypeLabel(selectedRecord.recordType).toUpperCase()}</span><h2>{selectedRecord.label}</h2><p>Record key: <code>{selectedRecord.recordKey}</code></p></div><span className="sample-editor-sample-tag">SAMPLE RECORD</span></div>
            <label className="sample-editor-label" htmlFor="sample-record-label">Record label<input id="sample-record-label" className="form-control" maxLength={180} value={labelDraft} onChange={(event) => setLabelDraft(event.target.value)} /></label>
            <label className="sample-editor-label" htmlFor="sample-record-json">Sample record data <span>Edit the JSON fields below. The server checks each record type before saving.</span></label>
            <textarea id="sample-record-json" className="sample-editor-json" spellCheck={false} value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} aria-describedby="sample-editor-json-help" />
            <p id="sample-editor-json-help" className="sample-editor-help">Page paths and product slugs are fixed to their stored keys. Business contact and location records are read-only here.</p>
            <div className="sample-editor-actions"><button type="button" className="button button-dark" disabled={update.isPending} onClick={handleSave}>{update.isPending ? <span className="loading-spinner" aria-hidden="true" /> : <Save size={17} aria-hidden="true" />} {update.isPending ? "Saving…" : "Save sample record"}</button><button type="button" className="button button-outline" disabled={update.isPending} onClick={() => chooseRecord(selectedRecord)}>Discard edits</button></div>
            <p role="status" aria-live="polite" className={status.startsWith("Sample record saved") ? "sample-editor-success" : "sample-editor-state"}>{status}</p>
          </>}
          {!recordsQuery.isLoading && !recordsQuery.isError && !selectedRecord && <div className="sample-editor-empty-state"><Search size={26} aria-hidden="true" /><h2>Select a sample record</h2><p>Choose page content, product details or an operations record from the list.</p></div>}
        </div>
      </section>
    </main>
  );
}

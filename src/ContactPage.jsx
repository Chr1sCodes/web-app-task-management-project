import { useState } from "react";
import Icon from "./Icon";

const EMPTY = { firstName: "", lastName: "", email: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // No backend yet: the form validates and confirms on the client only.
    setSent(true);
    setForm(EMPTY);
  };

  return (
    <main className="page">
      <h1 className="title">Contact</h1>
      <p className="page-subtitle">Questions, feedback, or ideas? Send us a message.</p>

      {sent ? (
        <div className="card success">
          <Icon name="check" size={28} strokeWidth="2.5" />
          <h2>Thanks for reaching out!</h2>
          <p>Your message has been received.</p>
          <button className="btn btn-ghost" onClick={() => setSent(false)}>Send another message</button>
        </div>
      ) : (
        <form className="card contact-form" onSubmit={submit}>
          <div className="field-row">
            <label className="field">
              <span>First name</span>
              <input type="text" value={form.firstName} onChange={update("firstName")} required maxLength={50} autoComplete="given-name" />
            </label>
            <label className="field">
              <span>Last name</span>
              <input type="text" value={form.lastName} onChange={update("lastName")} required maxLength={50} autoComplete="family-name" />
            </label>
          </div>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={update("email")} required maxLength={200} autoComplete="email" />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea value={form.message} onChange={update("message")} required rows={6} maxLength={2000} />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Icon name="mail" size={16} /> Send message
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

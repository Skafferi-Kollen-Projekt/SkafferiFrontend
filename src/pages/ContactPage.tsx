import { createSupportMessage } from "../api/support.api";
import "./ContactPage.css";
import { useState } from "react";

type Status = "idle" | "success" | "error";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setLoading(true);

    try {
      await createSupportMessage(message);

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact">
      <div className="contact-container">
        {/*Intro */}
        <header className="contact-header">
          <h1>Kontakta oss</h1>
          <p>
            Har du frågor, feedback eller förslag? Skicka ett meddelande så
            återkommer vi.
          </p>
        </header>

        {/*Form */}
        <form className="contact-form" onSubmit={submit}>
          <label>
            Namn
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Meddelande
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <p contact-info>
            🔒 Du behöver vara inloggad för att använda tjänsten.
          </p>

          <button type="submit" className="contact-submit" disabled={loading}>
            {loading ? "Skickar..." : "Skicka meddelande"}
          </button>

          {/*Feedback */}

          {status === "success" && (
            <p className="contact-feedback success">
              ✅ Tack! Ditt meddelande har skickats.
            </p>
          )}

          {status === "error" && (
            <p className="contact-feedback error">
              ❌ Något gick fel. Försök igen senare.
            </p>
          )}
        </form>

        <section className="contact-faq">
          <h2>Vanliga frågor</h2>
          <details>
            <summary>Måste jag ha ett konto för att använda appen?</summary>
            <p>
              Ja, du behöver skapa ett konto för att kunna spara och hantera
              dina varor i skafferiet.
            </p>
          </details>

          <details>
            <summary>Är Skafferi-Kollen gratis?</summary>
            <p>Ja, Skafferi-Kollen är gratis att använda för privatpersoner</p>
          </details>

          <details>
            <summary>Kan jag använda appen på mobilen?</summary>
            <p>
              Absolut! Appen är fullt responsiv och fungerar på mobil,
              surfplatta och dator.
            </p>
          </details>

          <details>
            <summary>Hur kan jag ge feedback eller rapportera buggar?</summary>
            <p>
              Du kan använda kontaktformuläret ovan för att skicka dina
              synpunkter eller rapportera eventuella problem du stöter på.
            </p>
          </details>

          <details>
            <summary>Hur skyddas mina uppgifter?</summary>
            <p>
              Vi tar din intregitet på allvar och skyddar dina uppgifter med
              moderna säkerhetsåtgärder.
            </p>
          </details>
        </section>
      </div>
    </section>
  );
}

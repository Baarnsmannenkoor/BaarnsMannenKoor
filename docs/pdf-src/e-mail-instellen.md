# E-mail instellen Baarns Mannenkoor

*Voor bestuursleden · bijgewerkt november 2026*

Het koor heeft vijf adressen: `voorzitter@`, `bestuur@`, `info@`, `secretaris@` en `penningmeester@baarnsmannenkoor.nl`.

## Hoe werkt het?

| | Hoe | Wat moet je doen? |
|---|---|---|
| **Ontvangen** | Cloudflare stuurt mail naar jouw koor-adres automatisch door naar je persoonlijke inbox. | Niets. Geen IMAP-server nodig. |
| **Verzenden** | Gmail verstuurt namens je koor-adres via de Brevo-mailserver. | Eenmalig "Verzenden als" instellen (hieronder). |

> **Wachtwoord:** je hebt de **Brevo SMTP-sleutel** nodig. Die krijg je van de beheerder (staat in KeePass onder *E-mail / Brevo SMTP*). Het is een lange code die begint met `xsmtpsib-`.

## Gmail: "Verzenden als" instellen

1. Gmail → tandwiel rechtsboven → **Alle instellingen bekijken**
2. Tabblad **Accounts en importeren**
3. Bij "E-mail verzenden als" → **Nog een e-mailadres toevoegen**
4. Vul in:
   - Naam: bijvoorbeeld `Secretaris Baarns Mannenkoor`
   - E-mailadres: je koor-adres, bijvoorbeeld `secretaris@baarnsmannenkoor.nl`
   - Vinkje **"Behandelen als alias" uitvinken**
5. **Volgende stap** → kies **Via SMTP-servers verzenden** en vul in:

| Instelling | Waarde |
|---|---|
| SMTP-server | `smtp-relay.brevo.com` |
| Poort | `587` |
| Gebruikersnaam | `b1c4b5001@smtp-brevo.com` |
| Wachtwoord | de Brevo SMTP-sleutel (van de beheerder) |
| Beveiliging | TLS |

6. Klik **Account toevoegen**
7. Gmail stuurt een verificatiecode naar je koor-adres. Die wordt doorgestuurd naar je eigen inbox.
8. Vul de code in → **Verifiëren**

Klaar. Bij een nieuwe e-mail kies je nu bovenaan bij "Van" je koor-adres.

## Outlook

Outlook kan niet goed verzenden namens een doorstuuradres zonder eigen mailbox. Gebruik Gmail voor je koor-adres, of vraag de beheerder om hulp.

## Werkt het niet?

| Melding | Oplossing |
|---|---|
| "Unauthorized server" of "verification failed" bij verzenden | Brevo heeft de IP-blokkering weer aangezet (gebeurt ongeveer elke 30 dagen). De beheerder zet die uit: app.brevo.com → Settings → Security → Authorized IPs → **Deactivate blocking**. |
| Verzenden bleef mislukken, ook na de fix | Verwijder het koor-adres bij "E-mail verzenden als" in Gmail en voeg het opnieuw toe. |
| Geen mail meer ontvangen, of je wilt het naar een ander adres | Geef je persoonlijke e-mailadres door aan de beheerder. Die past de doorstuurregel aan in Cloudflare. |

# SahakarSetu

SahakarSetu is Team **Synxis**'s prototype for **Smart India Hackathon 2026**, problem statement **SIH26088**: *Multilingual Cooperative Governance & Legal Assistance Chatbot*. It is designed to help farmers and cooperative members understand official information in a language they can use.

- [Web prototype](https://sahakarsetu1.vercel.app/)
- [SIH presentation (PowerPoint)](docs/Synxis_SIH2026_Presentation.pptx)
- [SIH presentation (PDF)](docs/Synxis_SIH2026_Presentation.pdf)

## What the prototype covers

- Guided topics and chat for cooperative membership and by-laws, PACS services, government schemes, PMFBY crop insurance, and grievance redressal.
- Multilingual text and voice controls, with source references displayed alongside chat answers when provided by the backend.
- A document and knowledge base administration interface.

The presentation also describes a proposed Raspberry Pi kiosk for rural access. The repository contains the web prototype.

## Run locally

The app uses React, TypeScript, Vite, and an Express server. Use a current Node.js LTS release with npm.

```sh
npm ci
cp .env.example .env
npm run dev
```

Set `GEMINI_API_KEY` in `.env` to configure Gemini for the AI features. Open the local URL printed by the dev server.

Run `npm run lint` for the TypeScript check and `npm run build` to build for production.

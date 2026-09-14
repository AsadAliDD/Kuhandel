# Kuhhandel

A responsive, accessible local pass-and-play implementation of the classic German livestock auction and bluffing game. The React UI is deliberately separated from deterministic TypeScript game rules.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev       # Vite development server
npm run build     # type-check and production build
npm test          # Vitest rules and component tests
```

## Controls and game flow

1. Enter two to five names and start the game. Only the active player's hand should be visible; pass the device when turns change.
2. On a turn, open an **auction** or start a **Kuhhandel** when two players own the same animal. Auction bid shortcuts increase the current bid; **Zuschlag erteilen** resolves payment.
3. Money cards are selectable in the trade dialog. Cards marked **Bluff** have value zero, but remain valid hidden offers.
4. Select **Zug beenden** to pass play. The event rail records resolved actions. **Regeln** opens the in-game summary.
5. The active game is stored locally after every transition. **Letzte Partie fortsetzen** restores validated version-1 saves; malformed or incompatible data is ignored. **Neu starten** clears the save.

## Implemented rules variant

The animal deck contains eight quartets. Each player begins with two zero-value bluff cards plus 10, 10, 20, 50, 100, 200, and 500. In an auction, everyone except the auctioneer may bid; the winner pays with available cards (overpayment is allowed) and receives the animal. With no bid, the auctioneer keeps it. Direct Kuhhandel is available when initiator and opponent both own at least one of the same animal. Both sides submit concealed money cards, potentially including bluffs; the selected winning side pays and takes all matching animals held by the other side.

The game ends after the last deck card's auction resolves. A player's score is:

> sum of completed quartet values × number of completed quartets

Ties are retained in the domain result.

## Architecture

- `src/game/types.ts` defines the serializable model and action protocol.
- `src/game/rules.ts` contains pure queries, deck construction, card accounting, legal targets, and scoring.
- `src/game/reducer.ts` is the deterministic state machine; seeded shuffling makes tests repeatable.
- `src/game/adapter.ts` is the player-action boundary. The local adapter dispatches actions today; a future server adapter can send the same intents to an authoritative host.
- `src/game/storage.ts` provides guarded, versioned browser persistence.
- `src/components/` contains focused presentation and dialog components.

## Accessibility

The interface uses semantic landmarks, native controls, visible focus behavior, labelled fields, `aria-pressed` selection, and modal dialog semantics. Layout reflows for phones and tablets. Meaning is never conveyed by color alone. Animations are brief and state-linked (card reveal, quartet completion, dialog entry); the `prefers-reduced-motion: reduce` media query effectively disables all animation and transition durations. Actions never wait for animation completion.

## Tests

The rule suite covers increasing/illegal bids, auction payment exchange, card selection, zero-value bluff offers, quartet ownership, score calculation, illegal trade validation, deck exhaustion, and direct-trade resolution. The component flow covers setup → auction reveal → bid → resolution.

## Multiplayer limitations

This release is intentionally local-only. It has no accounts, lobby, networking, hidden-hand protection from someone looking at the shared screen, reconnection protocol, or server-side cheating protection. The adapter boundary avoids coupling UI controls to local reducer dispatch, but online play still needs an authoritative service, authenticated player views, event sequencing, conflict recovery, and transport-specific tests.

## Three.js models and motion

The setup market includes three lightweight, procedural Three.js animal silhouettes—a cow, horse, and sheep—rendered on interactive cards through React Three Fiber. Players can drag to rotate the display and click or tap each card to trigger its spin-and-bounce celebration. Because the animals use geometry primitives rather than remote model files, the scene works offline after dependencies are installed and adds no binary asset download. Framer Motion provides page entrance, form-row, card-reveal, and live-bid transitions. Global `MotionConfig` and the Three.js scene both follow the operating system's reduced-motion preference.

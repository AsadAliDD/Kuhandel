import type { Dispatch } from 'react'; import type { GameAction } from './types';
export interface GameActions { send(action:GameAction):void }
export class LocalGameAdapter implements GameActions { constructor(private dispatch:Dispatch<GameAction>){} send(action:GameAction){this.dispatch(action);} }
// A later server adapter implements this boundary and forwards intents to an authoritative host.

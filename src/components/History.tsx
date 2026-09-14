import { Clock3 } from 'lucide-react'; import type { HistoryEntry } from '../game/types';
export function History({items}:{items:HistoryEntry[]}){return <aside className="history card"><header><h2><Clock3 size={18}/> History</h2><span>LIVE</span></header><ol>{items.map((e,i)=><li key={e.id}><i className={e.tone}/><div><time>{i ? 'earlier' : 'now'}</time><p>{e.text}</p></div></li>)}</ol></aside>}

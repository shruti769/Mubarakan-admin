import useAdmin from '../../hooks/useAdmin'
import Dialog, { DialogButtons } from './Dialog'

// Asks before anything risky. When `confirm.type` is set, that text must be typed to enable the button.
export default function ConfirmDialog() {
  const { state, setState } = useAdmin()
  const c = state.confirm
  if (!c) return null
  const needsType = !!c.type
  const ready = !needsType || state.ctext === c.type
  const cancel = () => setState({ confirm: null })
  const ok = () => {
    if (!ready) return
    setState({ confirm: null })
    c.then && c.then()
  }
  return (
    <Dialog width={440} zIndex={80} onClose={cancel}>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{c.title}</div>
      <div style={{ fontSize: 13.5, color: '#6F6A78', lineHeight: 1.55, marginTop: 6 }}>{c.body}</div>
      {needsType && (
        <>
          <div style={{ fontSize: 13, marginTop: 14 }}>
            Type <b style={{ fontFamily: "'JetBrains Mono',monospace", color: '#A6192E', fontWeight: 600 }}>{c.type}</b> to confirm
          </div>
          <input
            value={state.ctext}
            onChange={(e) => setState({ ctext: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && ok()}
            style={{ marginTop: 6, width: '100%', height: 36, border: '1px solid #E4E0DA', borderRadius: 8, padding: '0 10px', fontFamily: "'JetBrains Mono',monospace" }}
          />
        </>
      )}
      <DialogButtons onCancel={cancel} onOk={ok} okLabel={c.label} okBg={ready ? '#A6192E' : '#E3B9BF'} />
    </Dialog>
  )
}

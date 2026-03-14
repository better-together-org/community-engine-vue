import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Ensure VITE_ELECTRIC_URL is unset by default for no-op tests
vi.stubEnv('VITE_ELECTRIC_URL', '')

// Mock the sync store
vi.mock('@/stores/sync', () => ({
  useSyncStore: vi.fn(() => ({
    setConnected: vi.fn(),
    electricConnected: { value: false },
  })),
}))

// Import after env stub so the module-level constant picks up the stub
const { startSync, stopSync, applyShapeMessages } = await import('@/db/sync')

// --- helpers ---

function makeDb() {
  return {
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec:  vi.fn().mockResolvedValue(undefined),
  }
}

describe('startSync', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    stopSync()
    vi.restoreAllMocks()
  })

  it('is a no-op when VITE_ELECTRIC_URL is not set', () => {
    // ELECTRIC_URL is '' due to vi.stubEnv above — module-level constant is falsy
    const db = makeDb()
    // Should not throw, should not fetch
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    startSync(db)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('applyShapeMessages', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('executes INSERT … ON CONFLICT for insert operations', async () => {
    const db = makeDb()
    const messages = [
      {
        headers: { operation: 'insert' },
        value: { id: 'abc', name: 'Test Community' },
        offset: '1',
      },
    ]
    await applyShapeMessages(db, 'communities', messages)
    expect(db.query).toHaveBeenCalledOnce()
    const [sql, params] = db.query.mock.calls[0]
    expect(sql).toContain('INSERT INTO communities')
    expect(sql).toContain('ON CONFLICT (id) DO UPDATE SET')
    expect(params).toContain('abc')
    expect(params).toContain('Test Community')
  })

  it('executes INSERT … ON CONFLICT for update operations', async () => {
    const db = makeDb()
    const messages = [
      {
        headers: { operation: 'update' },
        value: { id: 'xyz', name: 'Updated' },
        offset: '2',
      },
    ]
    await applyShapeMessages(db, 'communities', messages)
    expect(db.query).toHaveBeenCalledOnce()
    const [sql] = db.query.mock.calls[0]
    expect(sql).toContain('INSERT INTO communities')
  })

  it('executes DELETE for delete operations', async () => {
    const db = makeDb()
    const messages = [
      {
        headers: { operation: 'delete' },
        value: { id: 'del1' },
        offset: '3',
      },
    ]
    await applyShapeMessages(db, 'communities', messages)
    expect(db.query).toHaveBeenCalledOnce()
    const [sql, params] = db.query.mock.calls[0]
    expect(sql).toContain('DELETE FROM communities WHERE id = $1')
    expect(params).toEqual(['del1'])
  })

  it('skips control messages (no operation)', async () => {
    const db = makeDb()
    const messages = [
      { headers: { control: 'up-to-date' }, offset: '10' },
    ]
    await applyShapeMessages(db, 'communities', messages)
    expect(db.query).not.toHaveBeenCalled()
  })

  it('skips messages without a value', async () => {
    const db = makeDb()
    await applyShapeMessages(db, 'communities', [{ headers: { operation: 'insert' } }])
    expect(db.query).not.toHaveBeenCalled()
  })

  it('does not overwrite _sync_status or _server_at columns via params', async () => {
    const db = makeDb()
    const messages = [
      {
        headers: { operation: 'insert' },
        value: { id: 'u1', name: 'Alice', _sync_status: 'local', _server_at: 'old' },
        offset: '5',
      },
    ]
    await applyShapeMessages(db, 'people', messages)
    // _sync_status and _server_at are excluded from col list — they appear only in SET clause
    const [, params] = db.query.mock.calls[0]
    expect(params).not.toContain('local')
    expect(params).not.toContain('old')
  })

  it('processes multiple messages in order', async () => {
    const db = makeDb()
    const messages = [
      { headers: { operation: 'insert' }, value: { id: 'a', name: 'A' }, offset: '1' },
      { headers: { operation: 'insert' }, value: { id: 'b', name: 'B' }, offset: '2' },
      { headers: { operation: 'delete' }, value: { id: 'a' }, offset: '3' },
    ]
    await applyShapeMessages(db, 'communities', messages)
    expect(db.query).toHaveBeenCalledTimes(3)
  })
})

describe('offset persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('localStorage is initially empty', () => {
    expect(localStorage.getItem('cev_sync_offsets')).toBeNull()
  })

  it("applyShapeMessages does not save offsets (that is subscribeToShape's job)", async () => {
    const db = makeDb()
    await applyShapeMessages(db, 'communities', [
      { headers: { operation: 'insert' }, value: { id: '1', name: 'x' }, offset: '42' },
    ])
    // applyShapeMessages itself doesn't write offsets — the stream loop does
    expect(localStorage.getItem('cev_sync_offsets')).toBeNull()
  })
})

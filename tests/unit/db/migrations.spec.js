import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getDb, resetDb } from '@/db/client'

// Mock PGlite to avoid WASM/IndexedDB in test env
vi.mock('@electric-sql/pglite', () => ({
  PGlite: vi.fn().mockImplementation(() => ({
    exec: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockImplementation((sql) => {
      if (sql.includes('MAX(version)')) return Promise.resolve({ rows: [{ v: 0 }] })
      return Promise.resolve({ rows: [] })
    }),
  })),
}))

describe('PGlite migrations', () => {
  beforeEach(() => resetDb())

  it('getDb() returns a db instance', async () => {
    const db = await getDb()
    expect(db).toBeDefined()
  })

  it('getDb() is a singleton', async () => {
    const db1 = await getDb()
    const db2 = await getDb()
    expect(db1).toBe(db2)
  })

  it('resetDb() clears the singleton', async () => {
    const db1 = await getDb()
    resetDb()
    const db2 = await getDb()
    expect(db1).not.toBe(db2)
  })
})

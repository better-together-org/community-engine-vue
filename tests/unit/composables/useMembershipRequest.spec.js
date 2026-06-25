import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { useMembershipRequest } from '@/composables/useMembershipRequest'

vi.mock('axios')

describe('useMembershipRequest', () => {
  const COMMUNITY_ID = 'test-community-uuid'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initialises with empty form and idle state', () => {
    const { form, loading, error, submitted } = useMembershipRequest(COMMUNITY_ID)
    expect(form.requestorName).toBe('')
    expect(form.requestorEmail).toBe('')
    expect(form.referralSource).toBe('')
    expect(form.description).toBe('')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(submitted.value).toBe(false)
  })

  describe('submit()', () => {
    it('posts a JSONAPI membership_requests payload to the API', async () => {
      axios.post = vi.fn().mockResolvedValue({ data: { data: { id: 'new-mr-id' } } })

      const { form, submit } = useMembershipRequest(COMMUNITY_ID)
      form.requestorName = 'Alice'
      form.requestorEmail = 'alice@example.test'
      form.referralSource = 'a friend'
      form.description = 'I would love to join.'

      await submit()

      expect(axios.post).toHaveBeenCalledOnce()
      const [url, payload, config] = axios.post.mock.calls[0]
      expect(url).toContain('/api/v1/membership_requests')
      expect(payload.data.type).toBe('membership_requests')
      expect(payload.data.attributes.requestor_name).toBe('Alice')
      expect(payload.data.attributes.requestor_email).toBe('alice@example.test')
      expect(payload.data.attributes.referral_source).toBe('a friend')
      expect(payload.data.attributes.target_type).toBe('BetterTogether::Community')
      expect(payload.data.attributes.target_id).toBe(COMMUNITY_ID)
      expect(config.headers['Content-Type']).toBe('application/vnd.api+json')
    })

    it('sets submitted to true on success', async () => {
      axios.post = vi.fn().mockResolvedValue({ data: {} })
      const { form, submitted, submit } = useMembershipRequest(COMMUNITY_ID)
      form.requestorName = 'Bob'
      form.requestorEmail = 'bob@example.test'
      form.description = 'test'

      await submit()

      expect(submitted.value).toBe(true)
    })

    it('sets loading to false after successful submission', async () => {
      axios.post = vi.fn().mockResolvedValue({ data: {} })
      const { form, loading, submit } = useMembershipRequest(COMMUNITY_ID)
      form.requestorName = 'Carol'
      form.requestorEmail = 'carol@example.test'
      form.description = 'test'

      await submit()

      expect(loading.value).toBe(false)
    })

    it('extracts JSONAPI error details on 422', async () => {
      axios.post = vi.fn().mockRejectedValue({
        response: {
          data: {
            errors: [
              { detail: 'requestor_email - can\'t be blank' },
              { detail: 'requestor_email - is invalid' },
            ],
          },
        },
      })

      const { error, submit } = useMembershipRequest(COMMUNITY_ID)
      await submit()

      expect(error.value).toContain('can\'t be blank')
      expect(error.value).toContain('is invalid')
    })

    it('falls back to message string for non-JSONAPI errors', async () => {
      axios.post = vi.fn().mockRejectedValue(new Error('Network Error'))
      const { error, submit } = useMembershipRequest(COMMUNITY_ID)
      await submit()
      expect(error.value).toBe('Network Error')
    })

    it('does not set submitted on error', async () => {
      axios.post = vi.fn().mockRejectedValue({ response: { data: { errors: [{ detail: 'bad' }] } } })
      const { submitted, submit } = useMembershipRequest(COMMUNITY_ID)
      await submit()
      expect(submitted.value).toBe(false)
    })
  })

  describe('reset()', () => {
    it('clears form fields', async () => {
      axios.post = vi.fn().mockResolvedValue({ data: {} })
      const { form, submitted, submit, reset } = useMembershipRequest(COMMUNITY_ID)
      form.requestorName = 'Dave'
      form.requestorEmail = 'dave@example.test'
      form.description = 'test'
      await submit()
      expect(submitted.value).toBe(true)

      reset()

      expect(form.requestorName).toBe('')
      expect(form.requestorEmail).toBe('')
      expect(form.description).toBe('')
      expect(submitted.value).toBe(false)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

// Mock composable before importing component
vi.mock('@/composables/useMembershipRequest', () => ({
  useMembershipRequest: vi.fn(() => ({
    form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
    loading: ref(false),
    error: ref(null),
    submitted: ref(false),
    submit: vi.fn(),
    reset: vi.fn(),
  })),
}))

vi.mock('bootstrap-vue-next', () => ({
  BAlert: {
    template: '<div class="b-alert" role="alert"><slot/></div>',
    props: ['variant', 'modelValue'],
  },
  BButton: {
    template: '<button type="button" @click="$emit(\'click\')"><slot/></button>',
    props: ['variant', 'disabled', 'type'],
    emits: ['click'],
  },
  BForm: {
    template: '<form @submit="onSubmit"><slot/></form>',
    emits: ['submit'],
    methods: {
      onSubmit(e) {
        e.preventDefault()
        this.$emit('submit', e)
      },
    },
  },
  BFormGroup: {
    template: '<div class="b-form-group"><label>{{ label }}</label><slot/></div>',
    props: ['label', 'labelFor'],
  },
  BFormInput: {
    template: '<input :type="type" :placeholder="placeholder" :disabled="disabled" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['type', 'placeholder', 'disabled', 'modelValue', 'required'],
    emits: ['update:modelValue'],
  },
  BFormTextarea: {
    template: '<textarea :placeholder="placeholder" :disabled="disabled" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['placeholder', 'disabled', 'modelValue', 'required', 'rows'],
    emits: ['update:modelValue'],
  },
}))

import BtMembershipRequestForm from '@/components/membership_request/BtMembershipRequestForm.vue'
import { useMembershipRequest } from '@/composables/useMembershipRequest'

describe('BtMembershipRequestForm', () => {
  const COMMUNITY_ID = 'test-community-uuid'

  beforeEach(() => {
    vi.clearAllMocks()
    useMembershipRequest.mockReturnValue({
      form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
      loading: ref(false),
      error: ref(null),
      submitted: ref(false),
      submit: vi.fn(),
      reset: vi.fn(),
    })
  })

  it('passes communityId to the composable', () => {
    mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    expect(useMembershipRequest).toHaveBeenCalledWith(COMMUNITY_ID)
  })

  it('renders the form by default', () => {
    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('.bt-membership-request-form__success').exists()).toBe(false)
  })

  it('shows success message when submitted is true', () => {
    useMembershipRequest.mockReturnValue({
      form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
      loading: ref(false),
      error: ref(null),
      submitted: ref(true),
      submit: vi.fn(),
      reset: vi.fn(),
    })

    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    expect(wrapper.find('.bt-membership-request-form__success').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows error alert when error is set', () => {
    useMembershipRequest.mockReturnValue({
      form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
      loading: ref(false),
      error: ref("requestor_email - can't be blank"),
      submitted: ref(false),
      submit: vi.fn(),
      reset: vi.fn(),
    })

    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    expect(wrapper.find('.b-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain("can't be blank")
  })

  it('does not show error alert when error is null', () => {
    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    expect(wrapper.find('.b-alert').exists()).toBe(false)
  })

  it('calls submit when form is submitted', async () => {
    const submitFn = vi.fn()
    useMembershipRequest.mockReturnValue({
      form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
      loading: ref(false),
      error: ref(null),
      submitted: ref(false),
      submit: submitFn,
      reset: vi.fn(),
    })

    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    await wrapper.find('form').trigger('submit')
    expect(submitFn).toHaveBeenCalledOnce()
  })

  it('disables inputs while loading', () => {
    useMembershipRequest.mockReturnValue({
      form: { requestorName: '', requestorEmail: '', referralSource: '', description: '' },
      loading: ref(true),
      error: ref(null),
      submitted: ref(false),
      submit: vi.fn(),
      reset: vi.fn(),
    })

    const wrapper = mount(BtMembershipRequestForm, { props: { communityId: COMMUNITY_ID } })
    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined()
    })
  })
})

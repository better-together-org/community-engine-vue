<template>
  <div class="bt-page-community-joatu">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2>Time Banking</h2>
      <p class="text-muted mb-0">1 time credit = 1 hour. All labor equally valued.</p>
    </div>

    <BTabs>
      <BTab title="Offers">
        <div class="pt-3">
          <div class="d-flex justify-content-end mb-3">
            <BButton variant="success" size="sm" @click="showOfferForm = !showOfferForm">
              {{ showOfferForm ? 'Cancel' : '+ Add Offer' }}
            </BButton>
          </div>
          <OfferForm v-if="showOfferForm" class="mb-4" @submit="handleCreateOffer" @cancel="showOfferForm = false" />
          <OfferList :offers="offers" :loading="offersLoading" @view="viewOffer" />
        </div>
      </BTab>
      <BTab title="Requests">
        <div class="pt-3">
          <div class="d-flex justify-content-end mb-3">
            <BButton variant="warning" size="sm" @click="showRequestForm = !showRequestForm">
              {{ showRequestForm ? 'Cancel' : '+ Add Request' }}
            </BButton>
          </div>
          <RequestForm v-if="showRequestForm" class="mb-4" @submit="handleCreateRequest" @cancel="showRequestForm = false" />
          <RequestList :requests="requests" :loading="requestsLoading" @view="viewRequest" />
        </div>
      </BTab>
      <BTab title="Agreements">
        <div class="pt-3">
          <AgreementList :agreements="agreements" :loading="agreementsLoading" @view="viewAgreement" />
        </div>
      </BTab>
    </BTabs>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BTabs, BTab, BButton } from 'bootstrap-vue-next'
import OfferList from '../../components/joatu/OfferList.vue'
import OfferForm from '../../components/joatu/OfferForm.vue'
import RequestList from '../../components/joatu/RequestList.vue'
import RequestForm from '../../components/joatu/RequestForm.vue'
import AgreementList from '../../components/joatu/AgreementList.vue'
import { useJoaTuOffers } from '../../composables/useJoaTuOffers'
import { useJoaTuRequests } from '../../composables/useJoaTuRequests'
import { useJoaTuAgreements } from '../../composables/useJoaTuAgreements'

const route = useRoute()
const router = useRouter()
const communitySlug = route.params.communitySlug

const { items: offers, loading: offersLoading, list: listOffers, create: createOffer } = useJoaTuOffers(communitySlug)
const { items: requests, loading: requestsLoading, list: listRequests, create: createRequest } = useJoaTuRequests(communitySlug)
const { items: agreements, loading: agreementsLoading, list: listAgreements } = useJoaTuAgreements(communitySlug)

const showOfferForm = ref(false)
const showRequestForm = ref(false)

onMounted(async () => {
  await Promise.all([listOffers(), listRequests(), listAgreements()])
})

async function handleCreateOffer(formData) {
  await createOffer(formData)
  showOfferForm.value = false
}

async function handleCreateRequest(formData) {
  await createRequest(formData)
  showRequestForm.value = false
}

function viewOffer(offer) { router.push({ name: 'CommunityOffer', params: { id: offer.id } }) }
function viewRequest(req) { router.push({ name: 'CommunityRequest', params: { id: req.id } }) }
function viewAgreement() {}
</script>

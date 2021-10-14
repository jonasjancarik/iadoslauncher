<template>
  <nuxt-link :to="`games/${game.identifier}`" style="color: initial; text-decoration: initial;">
    <div class="card game-card bouncing shadow-sm">
      <img :src="'https://archive.org/services/img/' + game.identifier" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">{{ game.title }}</h5>
        <h6 class="card-subtitle mb-2 small text-muted">{{ game.year }} | <stars :rating="game.avg_rating" :ratings-count="game.num_reviews" hide-rating /></h6>
        <p class="card-text">
          <small class="game-info small text-muted d-flex align-items-center">
            <span class="material-icons-outlined">visibility</span>&nbsp;{{ game.downloads.toLocaleString('en') }}×
          </small>
        </p>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      default: null
    }
  }
}
</script>

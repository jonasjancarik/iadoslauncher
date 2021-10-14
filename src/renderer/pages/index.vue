<template>
  <h1>Index</h1>
</template>

<script>
export default {
  middleware ({ store, redirect }) {
    if (store.state.showWelcome) {
      return redirect('/welcome')
    } else {
      return redirect('/library?page=1')
    }
  }
}
</script>

<template>
    <div>
      <ul>
        <li><router-link to="/">top</router-link></li>
        <!--
        <li><a href="/stats">stats</a></li>
        <li><a href="/account">account</a></li>
        -->
        <li><router-link to="/wallet">wallet</router-link></li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "HeadMenu"
    }
</script>

<style scoped>

</style>

<template>
  <div id="app">
   <input type="file" @change="onFileSelected">
   <button @click="onUpload"></button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      selectedFile: null
    }
  },
  methods: {
    onFileSelected (event) {
      //console.log(event)
      this.selectedFile = event.target.files[0]
    },
    onUpload () {
      
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

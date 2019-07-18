<template>
  <div>
    <button @click="playWith">play with</button>
    {{user.toId}}
    <div>
       <textarea v-model="message"/>
       <button :disabled="user.toId === -1" @click="send">send</button>
    </div>
    <div v-html="text"></div>
  </div>
</template>

<script>
    import Vue from 'vue'
    //https://github.com/MetinSeylan/Vue-Socket.io
    import VueSocketIO from 'vue-socket.io'

    Vue.use(new VueSocketIO({
        // debug: true,
        connection: 'http://localhost:3000',
    }))


    export default {
      data(){
        return {
          message:'',
          user:{
            userId:-1,
            toUserId:-1
          },
          text:''
        }
      },
      sockets: {
        connect: function () {
          console.log('socket connected')
        },
        message: function ({userId,message}) {
          this.text += userId+ ' say: ' + message +'<br/>';
        },
        from({userId}){
          this.user.toId = userId;
        }
      },
      mounted(){
        this.user.userId =  "u:" + Date.now()
        this.$socket.emit('registry',this.user)
      },
      methods:{
        send(){
          this.$socket.emit('message',{
            message:this.message,
            toId:this.user.toId,
            userId:this.user.userId
          })
          this.message = ''
        },
        playWith(){
          this.$socket.emit('playWith',this.user)
        }
      }
    };
</script>


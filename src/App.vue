<template>
  <div id="app">
    <h1>Отправка сообщения в Nats</h1>
    <el-input
      v-model="message"
      style="width: 240px"
      placeholder="Введите свое сообщение..."
    />
    <el-button type="primary" @click="sendMessage">Отправить</el-button>
    <div v-if="receivedMessage">
      <h2>Received Message:</h2>
      <p>{{ receivedMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "App",
  setup() {
    const message = ref("");
    const receivedMessage = ref("");
    let ws: WebSocket | null = null;

    const sendMessage = async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          // http://localhost:3000 for server node js
          await axios.post("http://localhost:8000/send", {
            message: message.value,
          });
          message.value = "";
        } catch (error) {
          console.error("Error sending message:", error);
        }
      } else {
        console.error("WebSocket connection is not open");
      }
    };

    onMounted(() => {
      // ws://localhost:3000 for server node js
      ws = new WebSocket("ws://localhost:8000/ws");

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        console.log(`Received message: ${event.data}`);
        receivedMessage.value = event.data;
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    });

    return {
      message,
      receivedMessage,
      sendMessage,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

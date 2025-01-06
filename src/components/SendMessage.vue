<template>
  <div>
    <h1>Отправка сообщения в Nats</h1>
    <el-input
      v-model="message"
      style="width: 240px"
      placeholder="Введите свое сообщение..."
    />
    <el-button type="primary" @click="sendMessage">Отправить</el-button>
    <el-button type="primary" @click="getMessageCount"
      >Получить количество сообщений</el-button
    >
    <div v-if="receivedMessage">
      <h2>Received Message:</h2>
      <p>{{ receivedMessage }}</p>
    </div>
    <div v-if="messageCount !== null">
      <h2>Количество сообщений:</h2>
      <p>{{ messageCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "SendMessage",
  setup() {
    const message = ref("");
    const receivedMessage = ref("");
    const messageCount = ref<number | null>(null);
    let ws: WebSocket | null = null;

    const sendMessage = async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
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

    const getMessageCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/message_count");
        messageCount.value = response.data.count;
      } catch (error) {
        console.error("Error getting message count:", error);
      }
    };

    onMounted(() => {
      ws = new WebSocket("ws://localhost:8000/ws");

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        console.log(`Received message: ${parsedMessage.message}`);
        receivedMessage.value = parsedMessage.message;
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
      messageCount,
      sendMessage,
      getMessageCount,
    };
  },
});
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>

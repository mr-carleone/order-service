<template>
  <div>
    <h1>Заявки</h1>
    <el-table
      :data="requests"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="ID" min-width="100"></el-table-column>
      <el-table-column
        prop="number"
        label="Номер"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="tons"
        label="Тонны"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="buyer"
        label="Покупатель"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="driver"
        label="Водитель"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="license"
        label="удостоверение"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="car"
        label="Марка машины"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="carNumber"
        label="номер машины"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="trailer"
        label="номер прицепа"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="loadDate"
        label="Дата загрузки"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="emptyWeight"
        label="Вес пор авто"
        width="180"
      ></el-table-column>
      <el-table-column label="Действия" width="150">
        <template #default="scope">
          <el-button type="primary" @click="editRequest(scope.row)"
            >Редактировать</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="Создать отгрузку">
      <el-form :model="editingRequest">
        <el-form-item label="Дата загрузки">
          <el-input v-model="editingRequest.loadDate"></el-input>
        </el-form-item>
        <el-form-item label="Вес порожнего авто">
          <el-input v-model="editingRequest.emptyWeight"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Отмена</el-button>
          <el-button type="primary" @click="saveRequest">Сохранить</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="sendDialogVisible" title="Отправить отгрузку">
      <el-form :model="editingRequest">
        <el-form-item label="ID">
          <el-input v-model="editingRequest.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Номер">
          <el-input v-model="editingRequest.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="Тонны">
          <el-input v-model="editingRequest.tons" disabled></el-input>
        </el-form-item>
        <el-form-item label="Покупатель">
          <el-input v-model="editingRequest.buyer" disabled></el-input>
        </el-form-item>
        <el-form-item label="Водитель">
          <el-input v-model="editingRequest.driver" disabled></el-input>
        </el-form-item>
        <el-form-item label="Удостоверение">
          <el-input v-model="editingRequest.license" disabled></el-input>
        </el-form-item>
        <el-form-item label="Марка машины">
          <el-input v-model="editingRequest.car" disabled></el-input>
        </el-form-item>
        <el-form-item label="Номер машины">
          <el-input v-model="editingRequest.carNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="Номер прицепа">
          <el-input v-model="editingRequest.trailer" disabled></el-input>
        </el-form-item>
        <el-form-item label="Дата загрузки">
          <el-input v-model="editingRequest.loadDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="Вес порожнего авто">
          <el-input v-model="editingRequest.emptyWeight" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendDialogVisible = false">Отмена</el-button>
          <el-button type="success" @click="sendMessage">Отправить</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRequestStore } from "../store";
import axios from "axios";

interface Request {
  id: number | null;
  number: string;
  tons: number | null;
  buyer: string;
  driver: string;
  license: string | null;
  car: string;
  carNumber: string;
  trailer: string | null;
  loadDate?: string;
  emptyWeight?: string;
  sent?: boolean;
}

export default defineComponent({
  name: "RequestTable",
  setup() {
    const requestStore = useRequestStore();
    const requests = requestStore.getRequests;
    const editingRequest = ref<Request>({
      id: null,
      number: "",
      tons: null,
      buyer: "",
      driver: "",
      license: null,
      car: "",
      carNumber: "",
      trailer: null,
      loadDate: "",
      emptyWeight: "",
      sent: false, // Инициализация поля sent
    } as Request);
    const dialogVisible = ref(false);
    const sendDialogVisible = ref(false);
    let ws: WebSocket | null = null;

    const editRequest = (request: Request) => {
      editingRequest.value = { ...request };
      dialogVisible.value = true;
    };

    const saveRequest = async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          requestStore.updateRequest(editingRequest.value);
          dialogVisible.value = false;
          sendDialogVisible.value = true;
        } catch (error) {
          console.error("Error saving request:", error);
        }
      } else {
        console.error("WebSocket connection is not open");
      }
    };

    const sendMessage = async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          await axios.post("http://localhost:8000/send", editingRequest.value);
          editingRequest.value.sent = true; // Установите поле sent в true после отправки
          sendDialogVisible.value = false;
        } catch (error) {
          console.error("Error sending message:", error);
        }
      } else {
        console.error("WebSocket connection is not open");
      }
    };

    const tableRowClassName = ({ row }: { row: Request }) => {
      if (row.sent) {
        return "success-row";
      } else {
        return "warning-row";
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
        // Обновите таблицу заявок, если необходимо
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    });

    return {
      requests,
      editingRequest,
      dialogVisible,
      sendDialogVisible,
      editRequest,
      saveRequest,
      sendMessage,
      tableRowClassName,
    };
  },
});
</script>

<style scoped>
/* Добавьте стили по необходимости */
.el-table {
  width: 100%;
  min-width: 1200px;
  overflow-x: auto;
  margin: 0 auto; /* Центрирование таблицы */
}

.el-table th,
.el-table td {
  white-space: nowrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px; /* Добавьте отступы для улучшения отображения */
}

.el-dialog {
  max-width: 800px;
  overflow-y: auto;
  margin: 0 auto; /* Центрирование диалогового окна */
}

.el-dialog__body {
  padding: 20px; /* Добавьте отступы для улучшения отображения */
}

.el-form-item {
  margin-bottom: 15px; /* Добавьте отступы между элементами формы */
}

.el-table-column {
  min-width: 100px; /* Минимальная ширина столбцов */
}

.el-table-column--actions {
  min-width: 150px; /* Минимальная ширина столбца с кнопками действий */
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>

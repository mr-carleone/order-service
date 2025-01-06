import { defineStore } from "pinia";

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
  sent?: boolean; // Добавлено поле для отслеживания отправленных заявок
}

interface State {
  requests: Request[];
}

export const useRequestStore = defineStore("requestStore", {
  state: (): State => ({
    requests: [
      {
        id: 1,
        number: "001",
        tons: 10,
        buyer: "Иванов",
        driver: "Сидоров",
        license: "1234567890",
        car: "Ural",
        carNumber: "A000AA196",
        trailer: "EE012550",
        sent: false,
      },
      {
        id: 2,
        number: "002",
        tons: 15,
        buyer: "Петров",
        driver: "Шадрин",
        license: "0987654321",
        car: "Зил",
        carNumber: "B000BB199",
        trailer: "НН213445",
        sent: false,
      },
      // Добавьте другие заявки по необходимости
    ],
  }),
  actions: {
    updateRequest(updatedRequest: Request) {
      const index = this.requests.findIndex(
        (request) => request.id === updatedRequest.id
      );
      if (index !== -1) {
        this.requests.splice(index, 1, updatedRequest);
      }
    },
  },
  getters: {
    getRequests: (state) => state.requests,
  },
});

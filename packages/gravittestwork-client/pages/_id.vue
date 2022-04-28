<template>
  <div class="text-center">
    <div class="" v-if="payment">
      <h2 class="mb-3">Подтверждение платежа</h2>
      <v-card class="mx-auto text-left" max-width="400" tile>
        <v-card-title>Информация</v-card-title>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>ID платежа</v-list-item-title>
            <v-list-item-subtitle>#{{ payment.id }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Статус</v-list-item-title>
            <v-list-item-subtitle v-if="payment.status == 0">Зачислен</v-list-item-subtitle>
            <v-list-item-subtitle v-else>Ожидает подтверждения...</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Ник получателя</v-list-item-title>
            <v-list-item-subtitle>{{ payment.username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Сумма</v-list-item-title>
            <v-list-item-subtitle v-if="payment.status == 0">{{ payment.amount }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else>{{ payment.amount * 0.7 }} - {{ payment.amount * 1.7 }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <div class="mt-8" v-if="payment.status == 1">
        <v-btn color="success" :loading="loading" class="mr-3" @click="confirm()"> Подтвердить </v-btn>
        <v-btn color="error" :loading="loading" class="mr-3" @click="cancel()"> Отмена </v-btn>
      </div>
      <div class="mt-8" v-else>
        <nuxt-link to="/">На главную</nuxt-link>
      </div>
    </div>
    <v-progress-circular
      v-else
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payment: null,
      loading: false
    };
  },

  async fetch() {
    try {
      this.payment = await this.$axios
        .get("/payments/" + this.$route.params.id)
        .then((res) => res.data);
    } catch {
      this.$nuxt.error({ statusCode: 404 });
    }
  },

  methods: {
    async confirm() {
      this.loading = true
      try {
        this.payment = await this.$axios.get("/payments/action/confirm/" + this.payment.id).then(res => res.data)
        this.loading = false
      } catch {
        this.$nuxt.error({ statusCode: 404 });
      } 
    },
    async cancel() {
      this.loading = true
      try {
        await this.$axios.get("/payments/action/cancel/" + this.payment.id)
      } catch {} 
      this.$router.push("/");
    }
  }
};
</script>
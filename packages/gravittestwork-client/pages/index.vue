<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="form.username"
      :counter="10"
      :rules="usernameRules"
      label="Ник"
      required
    ></v-text-field>

    <v-text-field
      v-model="form.amount"
      :rules="amountRules"
      label="Сумма"
      type="number"
      required
    ></v-text-field>

    <v-btn :disabled="!valid" :loading="loading" color="success" class="mt-3" @click="validate">
      Далее
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    loading: false,
    usernameRules: [(v) => !!v || "Ник обязателен для заполнения"],
    amountRules: [
      (v) => !!v || "Сумма обязательна для заполнения",
      (v) =>
        !(Number.isInteger(v) || v < 15 || v > 500) ||
        "Сумма должна быть между 15 и 500",
    ],
    form: {
      username: "",
      amount: "",
    },
  }),

  methods: {
    async validate() {
      const valid = this.$refs.form.validate();

      if (valid) {
        this.loading = true
        const payment = await this.$axios
          .post("/payments", {
            ...this.form,
            amount: Number(this.form.amount),
          })
          .then((res) => res.data);
        this.$router.push("/" + payment.id);
      }
    },
  },
};
</script>
<template>
  <div>
    <a-form-model ref="cards" :model="cards" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <div v-for="(name, index) in cards.names" :key="`name-${index}`" >
        <a-form-model-item
          :label="name.nameLG"
          :prop="'names.' + index + '.content'"
          :rules="{
            required: name.isRequired ? true : false,
            message: $t('messValidate.requiredCardName'),
            trigger: 'change',
          }"
        >
          <a-input
            @change="handleChangeInput(`name-${name.locale}`)"
            v-model="name.content"
            type="textarea"
            :autoSize ="true"
          >
          </a-input>
          <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${name.locale}`, false)">{{ getError(errors, `names-${name.locale}`, false) }}</div>
        </a-form-model-item>
      </div>
      <!-- Select Card -->
      <a-form-model-item
        :label="$t('cards.lableCardType')"
        prop="cardTypeId"
        :rules="{
          required: true,
          message: $t('messValidate.requiredSelectCardType'),
          trigger: 'change',
        }"
      >
        <a-select
          v-model="cards.cardTypeId"
          :placeholder="$t('messValidate.requiredSelectCardType')"
          :disabled="!cards.canEdit"
        >
          <a-select-option v-for="(cardType, index) in cardTypes" :key="cardType.cardTypeId">
            {{ cardType.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- Caption -->
      <p class="font-18px font-weight-bold">{{ $t('cards.titleCaption') }}</p>
      <div v-for="(note, index) in cards.notes" :key="`note-${index}`">
        <a-form-model-item :label="note.nameLG"
          :prop="'notes.' + index + '.content'"
          :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }"
          >
            <a-input
              type="textarea"
              :auto-size="{ minRows: 5, maxRows: 10 }"
              v-model="note.content"
              @change="handleChangeInput(`names-${note.locale}`)"
            ></a-input>
            <div class="ant-form-explain txt-danger" v-if="getError(errors, `names-${note.locale}`, false)">{{ getError(errors, `names-${note.locale}`, false) }}</div>
        </a-form-model-item>
      </div>
      <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
        <a-button type="primary" html-type="submit" :disabled="isSubmit || cards.publishVersion ? true : false" @click="handleSubmit">{{ isEdit ? $t('commonText.btnSave') : $t('commonText.btnContinue') }}</a-button>
      </a-form-item>
    </a-form-model>
  </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  export default {
    props: ['isEdit', 'initData'],
    data() {
      return {
        errors: {},
        isSubmit: false,
        cards: this.initData,
      };
    },
    computed: {
      ...mapState({
        listLanguage: state => state.languages.listLanguage,
        cardTypes: state => state.cardTypes.cardTypes
      })
    },
    methods: {
      ...mapActions({
        addCards: 'cards/addCards',
        editCards: 'cards/editCards'
      }),
      handleSubmit() {
        this.isSubmit = true;
        this.$refs.cards.validate(async valid => {
          if (valid) {
            this.cards = {
              ...this.cards,
              savedBy: this.getUserName(this.$keycloak.token)
            }
            if(!this.isEdit) {
              const resAdd = await this.addCards(this.cards);
              if (resAdd.status == 200) {
                this.$router.push(`/cards/${resAdd.data.cardId}`);
              } else {
                this.errors = resAdd;
                this.isSubmit = false;
              }
            } else {
              const resEdit = await this.editCards(this.cards);
              if (resEdit.status == 200) {
                this.$router.push(`/cards/${this.cards.cardId}`);
              } else {
                this.errors = resEdit;
              }
            }
          }
          this.isSubmit = false;
        });
      },
      handleChangeInput(nameField) {
        this.getError(this.errors, nameField, true);
      },
    },
  };
</script>

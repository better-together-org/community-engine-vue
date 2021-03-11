export default {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'Name',
      model: 'name',
      placeholder: 'Your name..',
      validator: ['string', 'required'],
    },
    {
      type: 'textArea',
      label: 'Description',
      model: 'description',
      placeholder: 'Your bio..',
      validator: ['string', 'required'],
    },
  ],
}

<template>
  <v-flex>
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="items"
      item-key="id"
      no-data-text="No Accounts found"
      class="elevation-1"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.email }}</td>
        <td class="justify-center layout px-0">
          <v-btn
            title="edit"
            icon
            class="mx-0"
            @click="editItem(props.item)"
          >
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn
            title="delete"
            icon
            class="mx-0"
            @click="deleteItem(props.item)"
          >
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      width="60%"
    >
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          {{ current.id ? 'Editing Account ' + current.id : 'Create Account'}}
        </v-card-title>
        <v-container
          grid-list-sm
          class="pa-4"
        >
          <v-layout
            row
            wrap
          >
            <v-flex
              xs12
              v-if="current.id"
            >
              <v-text-field
                prepend-icon="person"
                v-model="current.id"
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
                v-model="current.email"
                :rules="[hasErrors]"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="primary"
            @click="resetForm"
          >Cancel</v-btn>
          <v-btn
            flat
            @click="submit"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      title="create account"
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click.stop="dialog = !dialog"
    >
      <v-icon>add</v-icon>
    </v-btn>

  </v-flex>
</template>

<script>
export default {
  name: 'Accounts',
  props: ['userToken'],
	data: () => ({
		dialog: false,
		totalItems: 0,
		items: [],
		pagination: {
      descending: true,
      page: 1,
      rowsPerPage: 5,
      sortBy: 'email'
    },
		headers: [
			{ text: 'ID', value: 'id' },
			{ text: 'Email', value: 'email' },
		],
		loading: true,
		current: {},
    error: null,
    currentIndex: -1,
    apiPath: '/accounts'
	}),
	created() {
		this.default = {
			email: ''
		}

    this.current = Object.assign({}, this.default)
    this.tokenHeaders =  { 'X-Access-Token': this.userToken }            
	},
  computed: {
    hasErrors() {
      return this.error === null ? true : this.error
    }
  },
  mounted() {
    this.getItems()
  },
	methods: {
		cancelForm() {
    },  

		resetForm() {
			this.current = Object.assign({}, this.default)
			this.dialog = false
		},

		submit() {
      if (this.current.id) {
				this.$http
					.put(`${this.apiPath}/${this.current.id}`, this.current, { headers: this.tokenHeaders })
					.then(({ data }) => {
						Object.assign(this.items[this.currentIndex], data)
						this.resetForm()
					})
			} else {
				this.$http
					.post(this.apiPath, this.current, { headers: this.tokenHeaders })
					.then(({ data }) => {
						this.resetForm()
						this.getItems()
					})
					.catch(e => {
            this.error = e.request.responseText
						console.error('Error posting data.', e)
					})
			}
		},

		editItem(item) {
			this.currentIndex = this.items.indexOf(item)
			this.current = Object.assign({}, item)
			this.dialog = true
		},

		deleteItem(item) {
			this.$http
				.delete(`${this.apiPath}/${item.id}`, { headers: this.tokenHeaders })
				.then(() => {
					const index = this.items.indexOf(item)
					this.items.splice(index, 1)
				})
				.catch(e => {
					console.error('Error deleting item.', e)
				})
		},

		getItems() {
			this.loading = true
			const { sortBy, descending, page, rowsPerPage } = this.pagination
			const sort = {
        field: sortBy,
				direction: descending ? 'desc' : 'asc'
			}
			this.$http
				.get(
					`${this.apiPath}`, { headers: this.tokenHeaders }
				)
				.then(({ data }) => {
          this.items = data
					this.loading = false
        })
        .catch(e => {
          this.loading = false
          console.error(e.message)
        })
		}
	}
}
</script>


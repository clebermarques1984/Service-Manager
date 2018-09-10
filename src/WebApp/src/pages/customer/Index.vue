<template>
  <v-card>
    <v-card-title>
        <v-toolbar flat color="white">
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" color="pink" fab small dark class="mb-2">
                <v-icon>add</v-icon>
              </v-btn>
              <v-card>
              <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                  <v-container grid-list-md>
                  <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                      </v-flex>
                  </v-layout>
                  </v-container>
              </v-card-text>

              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
              </v-card-actions>
              </v-card>
          </v-dialog>
          <v-dialog v-model="delDialog" max-width="500px">
              <v-card>
                <v-card-title>
                    <span class="headline">Delete item</span>
                </v-card-title>

              <v-card-text>
                  Are you sure you want to delete {{ editedItem.name }} ?
              </v-card-text>

              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">NO</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save">YES</v-btn>
              </v-card-actions>
              </v-card>
          </v-dialog>
          
        </v-toolbar>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-1"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2 clickable"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2 clickable"
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Customer extends Vue {
  private search: string = '';
  private dialog: boolean = false;
  private delDialog: boolean = false;
  private deletedIndex: number = -1;
  private headers: any = [
    {
      text: 'Dessert (100g serving)',
      align: 'left',
      sortable: false,
      value: 'name',
    },
    { text: 'Calories', value: 'calories' },
    { text: 'Fat (g)', value: 'fat' },
    { text: 'Carbs (g)', value: 'carbs' },
    { text: 'Protein (g)', value: 'protein' },
    { text: 'Actions', value: 'name', sortable: false },
  ];
  private desserts: any = [];
  private editedIndex: number = -1;
  private editedItem: any = {
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  };
  private defaultItem: any = {
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  };

  get formTitle(): string {
    return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
  }

  private created() {
    this.initialize();
  }

  private initialize() {
    this.desserts = [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
      },
    ];
  }

  private editItem(item: any) {
    this.editedIndex = this.desserts.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  private deleteItem(item: any) {
    this.deletedIndex = this.desserts.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.delDialog = true;
  }

  private close() {
    this.dialog = false;
    this.delDialog = false;
    setTimeout(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.deletedIndex = -1;
    }, 300);
  }

  private save() {
    if (this.editedIndex > -1) {
      Object.assign(this.desserts[this.editedIndex], this.editedItem);
    } else if (this.deletedIndex > -1) {
      this.desserts.splice(this.deletedIndex, 1);
    } else {
      this.desserts.push(this.editedItem);
    }
    this.close();
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>

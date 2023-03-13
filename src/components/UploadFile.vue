<template>
  <div>
    <div class="row" v-if="store.state.testChangeState">
      <div class="col-6">
        <div class="input-group">
          <input
            type="file"
            accept=".xls, .xlsx"
            class="form-control"
            id="excelFile"
            aria-describedby="inputGroupFileAddon04"
            aria-label="Upload"
            :disabled="uploadingFile"
            @change="readFile"
          />
        </div>
      </div>
      <div class="col-6 text-end">
        <button
          type="button"
          class="btn btn-light"
          id="inputGroupFileAddon04"
          v-if="!uploadingFile && !onEdit"
          @click="uploadFile"
          :disabled="items.length <= 0"
        >Save File</button>
        <button type="button" class="btn btn-warning" v-if="onEdit" @click="cancelEdit">
          Cancel
          <i class="bi bi-x-circle-fill"></i>
        </button>
        <button class="btn btn-light" type="button" v-if="uploadingFile">
          Saving file
          <span
            class="spinner-border spinner-border-sm text-warning"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>

    <div
      class="mt-4 mb-4 table-wrapper-scroll-y my-custom-scrollbar"
      v-if="items.length > 0 && store.state.testChangeState"
    >
      <table class="table table-bordered table-striped mb-0">
        <thead class="table-light">
          <tr>
            <th scope="col">UserID</th>
            <th scope="col">UserName</th>
            <th scope="col">Date</th>
            <th scope="col">Punch In</th>
            <th scope="col">Punch Out</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody v-if="!onEdit">
          <tr v-for="(item, index) in items" :key="item">
            <td class="table-light">{{ item[0] }}</td>
            <td class="table-light">{{ item[1] }}</td>
            <td class="table-light">{{ item[2] }}</td>
            <td class="table-light">{{ item[3] }}</td>
            <td class="table-light">{{ item[4] }}</td>
            <td class="table-light">
              <button
                type="button"
                class="btn btn-dark btn-sm"
                @click="editItem(item, index)"
              >Edit info</button>
            </td>
          </tr>
        </tbody>
        <tbody v-if="onEdit">
          <tr>
            <th v-for="(item, index) in itemsOfEdit" :key="item" class="table-light">
              <input
                type="text"
                class="form-control"
                :placeholder="item"
                v-model="temporalItem[index]"
              />
            </th>
            <th class="table-light">
              <button type="button" class="btn btn-dark btn-sm" @click="saveNewItem">Update item</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { useStore } from "vuex";


import { ref } from "vue";
import readXlsFile from "read-excel-file";

const store = useStore();
const api = "https://keyence-api.herokuapp.com";
const uploadingFile = ref(false);
const items = ref([]);

// Variables for edition
const onEdit = ref(false);
const itemsOfEdit = ref([]);
const indexToDelete = ref(-1);
const temporalItem = ref([]);

const readFile = () => {
  const input = document.getElementById("excelFile");
  readXlsFile(input.files[0]).then(rows => {
    items.value = rows;
  });
};

const editItem = (item, index) => {
  onEdit.value = true;
  itemsOfEdit.value = item;
  indexToDelete.value = index;
};

const cancelEdit = () => {
  onEdit.value = false;
  temporalItem.value = [];
};

//Update one specific element
const saveNewItem = () => {
  let validateArray = temporalItem.value.filter(Boolean);
  if (validateArray.length < 5) {
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: "Llena todos los campos",
      showConfirmButton: false,
      timer: 1500
    });
  }
  items.value[indexToDelete.value] = temporalItem.value;
  onEdit.value = false;
  temporalItem.value = [];
};

const uploadFile = async () => {
  let varToken = localStorage.getItem("token");
  const res = ref([]);
  for (let a = 0; a <= items.value.length - 1; a++) {
    try {
      uploadingFile.value = true;
      res.value = await axios({
        method: "POST",
        url: api + "/api/newUser",
        headers: { "x-access-token": varToken },
        data: {
          userID: items.value[a][0],
          userName: items.value[a][1],
          date: items.value[a][2],
          punchIn: items.value[a][3],
          punchOut: items.value[a][4]
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred check the data"
      });
    }
  }
  if (res.value.status == 200) {
    Swal.fire({
      icon: "success",
      title: "Save in Data Base",
      text: items.value.length + " " + "Items registered"
    });
    uploadingFile.value = false;
    items.value = [];
    document.getElementById("excelFile").value = "";
  }
};
</script>

<style lang="scss" scoped>
.my-custom-scrollbar {
  position: relative;
  height: 715px;
  overflow: auto;
}
.table-wrapper-scroll-y {
  display: block;
}
</style>
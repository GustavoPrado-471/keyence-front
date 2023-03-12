<template>
  <div>
    <div class="row">
      <h4
        style="color:white"
        
      >{{ 'Table with ' + counter + ' records' }}</h4>
      <div class="mt-4 mb-4 table-wrapper-scroll-y my-custom-scrollbar" v-if="items.length > 0 ">
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
          <!-- <tbody > -->
          <tbody v-if="!onEdit">
            <tr v-for="item in items" :key="item">
              <td class="table-light">{{ item.userID }}</td>
              <td class="table-light">{{ item.userName}}</td>
              <td class="table-light">{{ item.date }}</td>
              <td class="table-light">{{ item.punchIn }}</td>
              <td class="table-light">{{ item.punchOut }}</td>
              <td class="table-light">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-dark" @click="upDateItem(item)">Update</button>
                  <button type="button" class="btn btn-danger" @click="deleteItem(item)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-if="onEdit">
            <tr>
              <td class="table-light">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="itemsOfEdit.userID "
                  v-model="temporalItem[0].userID"
                />
              </td>
              <td class="table-light">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="itemsOfEdit.userName "
                  v-model="temporalItem[0].userName"
                />
              </td>
              <td class="table-light">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="itemsOfEdit.date "
                  v-model="temporalItem[0].date"
                />
              </td>
              <td class="table-light">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="itemsOfEdit.punchIn "
                  v-model="temporalItem[0].punchIn"
                />
              </td>
              <td class="table-light">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="itemsOfEdit.punchOut "
                  v-model="temporalItem[0].punchOut"
                />
              </td>
              <td class="table-light">
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-dark btn-sm"
                    @click="saveNewItem"
                    :disabled="temporalItem[0].userID.length <= 0 || 
                             temporalItem[0].userName.length <= 0 || 
                             temporalItem[0].date.length <= 0  ||
                             temporalItem[0].punchIn.length <= 0  ||
                             temporalItem[0].punchOut.length <= 0 
                             "
                  >Update</button>
                  <button type="button" class="btn btn-danger" @click="cancelUpdate">Cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";

const counter = ref(-1);
const api = "http://localhost:3000/api";

// // Variables for Table
const items = ref([]);
const onEdit = ref(false);
const itemsOfEdit = ref([]);
const temporalItem = ref([
  {
    userID: "",
    userName: "",
    date: "",
    punchIn: "",
    punchOut: ""
  }
]);


onMounted(() => {
  getAllData();
});

//   Ejecuta peticion para traer todos los datos
const getAllData = async () => {
  let varToken = localStorage.getItem("token");
  const res = ref([]);
  try {
    res.value = await axios({
      method: "GET",
      url: api + "/allUsers",
      headers: { "x-access-token": varToken },
      data: {}
    });
    if (res.value.status == 200) {
      items.value = res.value.data;
      counter.value = items.value.length;
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred check the data"
    });
  }
};

//Cancel Update
const cancelUpdate = () => {
  onEdit.value = false;
  temporalItem.value = [
    { userID: "", userName: "", date: "", punchIn: "", punchOut: "" }
  ];
};

//Update Item
const upDateItem = item => {
  onEdit.value = true;
  itemsOfEdit.value = item;
};

const saveNewItem = async () => {
  // Validamos que no vengan campos vacios
  itemsOfEdit.value.userID = temporalItem.value[0].userID;
  itemsOfEdit.value.userName = temporalItem.value[0].userName;
  itemsOfEdit.value.date = temporalItem.value[0].date;
  itemsOfEdit.value.punchIn = temporalItem.value[0].punchIn;
  itemsOfEdit.value.punchOut = temporalItem.value[0].punchOut;
  // Hacemos la peticion con los nuevos datos
  let varToken = localStorage.getItem("token");
  const res = ref([]);
  try {
    res.value = await axios({
      method: "PUT",
      url: api + "/user/" + itemsOfEdit.value._id,
      headers: { "x-access-token": varToken },
      data: {
        userID: itemsOfEdit.value.userID,
        userName: itemsOfEdit.value.userName,
        date: itemsOfEdit.value.date,
        punchIn: itemsOfEdit.value.punchIn,
        punchOut: itemsOfEdit.value.punchOut
      }
    });
    if (res.value.status == 200) {
      onEdit.value = false;

      Swal.fire("Updated!", "The item was successfully updated.", "success");
      ///Limpiamos todos los campos
      temporalItem.value = [
        { userID: "", userName: "", date: "", punchIn: "", punchOut: "" }
      ];
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred check the data"
    });
  }
};

//Doble confirmation
const deleteItem = item => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.isConfirmed) {
      test(item);
    }
  });
};

const test = async item => {
  //Primero lo borramos de la base
  let varToken = localStorage.getItem("token");
  const res = ref([]);
  try {
    res.value = await axios({
      method: "DELETE",
      url: api + "/user/" + item._id,
      headers: { "x-access-token": varToken },
      data: {}
    });
    if (res.value.status == 200) {
      items.value = items.value.filter(ele => ele._id != item._id);
      Swal.fire("Deleted!", "The item was successfully deleted.", "success");
      counter.value = items.value.length;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred check the data"
    });
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
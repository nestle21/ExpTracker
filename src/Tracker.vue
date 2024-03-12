<script setup>
import { ref, computed } from 'vue';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import db from './firebase/config'; 

const Tracker = ref([]);
const newTracker = ref({
    item: '',
    category: '',
    amount: 0,
});
const amountInput = ref('');
const editingIndex = ref(null);


const fetchTracker = async () => {
    const q = query(collection(db, 'Tracker'), orderBy('dateTime', 'asc'));


    const unsubscribe = onSnapshot(q, (snapshot) => {
        Tracker.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
};


import { onMounted } from 'vue';
onMounted(fetchTracker);


const addOrUpdateTracker = async () => {
    if (!newTracker.value.item || !newTracker.value.category || !amountInput.value) {
        alert('Please fill up all the fields.');
        return;
    }

    if (isNaN(parseFloat(amountInput.value))) {
        alert('Please enter a valid number for the amount.');
        return;
    }

    if (editingIndex.value === null) {
        await addTracker();
    } else {
        await updateTracker();
    }
};


const addTracker = async () => {
    const dateTime = new Date().toLocaleString();
    const Tracker = { ...newTracker.value, amount: parseFloat(amountInput.value), dateTime };

    try {
        const docRef = await addDoc(collection(db, 'Tracker'), Tracker);
        console.log('Expense added with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding expense: ', error);
    }

    newTracker.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
};


const updateTracker = async () => {
    const trackerId = Tracker.value[editingIndex.value].id;
    const updatedTracker = { ...newTracker.value, amount: parseFloat(amountInput.value) };

    try {
        await updateDoc(doc(db, 'Tracker', trackerId), updatedTracker);
        console.log('Expense updated with ID: ', trackerId);
    } catch (error) {
        console.error('Error updating expense: ', error);
    }

    newTracker.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
    editingIndex.value = null;
};


const deleteTracker = async (id) => {
    try {
        await deleteDoc(doc(db, 'Tracker', id));
        console.log('Expense deleted with ID: ', id);
    } catch (error) {
        console.error('Error deleting expense: ', error);
    }
};


const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
        deleteTracker(id);
    }
};


const editTracker = (index) => {
    const tracker = Tracker.value[index];
    newTracker.value = {
        item: tracker.item,
        category: tracker.category,
        amount: tracker.amount,
    };
    amountInput.value = tracker.amount;
    editingIndex.value = index;
};

const totalTracker = computed(() => {
    return Tracker.value.reduce((total, tracker) => total + parseFloat(tracker.amount), 0);
});
</script>


<template>
  <div class="flex justify-center items-center min-h-screen bg-black">
    <div class="container mx-auto p-8 bg-white rounded-lg shadow-lg border border-black-300 bg-blue-200">
      <h1 class="text-5xl text-center text-gray-800 mb-10">Expenses Tracker</h1>
      <div class="flex flex-col">
        <div class="flex flex-row mb-4">
          <input type="text" v-model="newTracker.item" placeholder="Item" class="flex-1 input-field mr-2 rounded-md px-4 py-2 border border-gray-300"> 
          <select v-model="newTracker.category" class="flex-1 input-field ml-2 rounded-md px-4 py-2 border border-gray-300"> 
            <option value="" disabled selected>Select Category of Expense</option>
            <option value="food">Food</option>
            <option value="clothes">Clothes</option>
            <option value="transportation">Transportation</option>
          </select>
          <input type="text" v-model="amountInput" placeholder="Amount" class="flex-1 input-field ml-2 rounded-md px-4 py-2 border border-gray-300"> 
          <button @click="addOrUpdateTracker" class="btn-primary ml-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-green-600">
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="border border-gray-300 px-4 py-2">Date & Time</th>
                <th class="border border-gray-300 px-4 py-2">Item</th>
                <th class="border border-gray-300 px-4 py-2">Category</th>
                <th class="border border-gray-300 px-4 py-2">Amount</th>
                <th class="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tracker, index) in Tracker" :key="index">
                <td class="border border-gray-300 px-4 py-2">{{ tracker.dateTime }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tracker.item }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tracker.category }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tracker.amount }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center ">
                  <button @click="editTracker(index)" class="btn-secondary px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 m-1"> 
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </button>
                  <button @click="confirmDelete(tracker.id)" class="btn-danger px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 m-1">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="total-Tracker border-t border-gray-300 mt-4">Total Tracker: {{ totalTracker }}</div>
      </div>
    </div>
  </div>
</template>


  
  <style scoped>
    .input-field {
      border: 1px solid #000000;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      width: 100%;
      font-size: 16px;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);  
      transition: box-shadow 0.3s ease;
    }
    .input-field:hover {
        box-shadow: 0 0 10px rgba(0,0,1,1);
    }
    .input-field:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(1,1,1,0.3);
    }
    .btn-primary {
      background-color: rgb(2, 181, 2);
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 0 10px rgba(1,1,1,0.3);
    }
  
    .btn-primary:hover {
      background-color: green;
    }
  
    .btn-secondary {
      background-color: blue;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
  
    .btn-secondary:hover {
      background-color: rgb(3, 3, 186);
    }
  
    .btn-danger {
      background-color: red;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
  
    .btn-danger:hover {
      background-color: rgb(176, 16, 16);
    }
  
    .Tracker-table-container {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #ffffff;
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(0,0,5,5);  

    }
  
    .total-Tracker {
      position: sticky;
      bottom: 0;
      background-color: white;
      padding: 10px;
      text-align: right;
      font-size: 18px;
    }

    .Tracker-table-container table button {
    margin-right: 5px; 
  }

  .Tracker-table-container table button:last-child {
    margin-right: 0; 
  }

  .Tracker-table-container table button svg {
    vertical-align: middle; 
    margin-right: 5px;
  }
  </style>
  
  

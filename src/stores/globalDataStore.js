import { defineStore } from 'pinia'

export const useDataStore = defineStore('dataStore', {
    state: () => ({
      nestedData: null, // Initialize with null or an empty object
    }),
    
    actions: {
      setNestedData(nestedJSON) {
        this.nestedData = nestedJSON;
      },
    },
});
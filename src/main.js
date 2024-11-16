import './assets/main.css'
import './assets/tailwind.css';
import './assets/base.css';  // Your custom styles
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useDataStore } from './stores/globalDataStore';
//import App from './App.vue'
import router from './router';
import parseCSV from './parser'

const DispData = {
    JSONTree: Object
}


const AppContent = {
    template: `
        <div>
            <h1> All Employees hahahahahah </h1>
            <pre>{{JSONTree}}</pre>
        </div>
    `,

    data() {
        return {
            JSONTree: null
        };
    },

    async mounted() {
        //Once app mounted then retrieve the data from the JSON
        const dataStore = useDataStore();
        await parseCSV;
        console.log(dataStore.nestedData)
        this.JSONTree = dataStore.nestedData?.["Employee ID"] ||  null;
    }
};

const App = {
    components: { AppContent },
    template: '<AppContent/>'
}


const app = createApp(App)
app.use(createPinia())
app.use(router)

parseCSV().then(() => {
    app.mount('#app'); // mounts the unique identifier associated with app in HTML 
}).catch((err) => {
    console.log("error parsing:", err);
})



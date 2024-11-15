import './assets/main.css'
import './assets/tailwind.css';
import './assets/base.css';  // Your custom styles
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useDataStore } from './stores/globalDataStore';
//import App from './App.vue'
import router from './router';

const DispData = {
    JSONTree: Object
}


const AppContent = {
    template: `
        <div>
            <h1> All Employees </h1>
            <pre>{{JSONTree}}</pre>
        </div>
    `,

    data() {
        return {
            JSONTree: null
        };
    },

    mounted() {
        //Once app mounted then retrieve the data from the JSON
        const dataStore = useDataStore();
        this.JSONTree = dataStore.nestedData["Employee ID"];
    }
};

const App = {
    components: { AppContent },
    template: '<AppContent/>'
}


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app') // mounts the unique identifier associated with app in HTML 


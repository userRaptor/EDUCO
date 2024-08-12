Multi-User-Authentication:
https://www.youtube.com/watch?v=b-qEj11h7as&t=296s&ab_channel=Cairocoders

Install Chakra-UI:
 - npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
 - npm install @chakra-ui/icons

React Router zum Projekt hinzufügen:
 - npm install react-router-dom


Inertia install: (anstelle von axiosClient)
 - npm install @inertiajs/inertia-react

Install Toastify (alert):
 - npm install --save react-toastify


install CSVReader from 'react-csv-reader':
 - npm install react-csv-reader




DEBUGGING:
```
$data = $request->all();
// Debugging: Überprüfen, was in $data enthalten ist
dd($data);
```


Zwei der am häufigsten verwendeten Bibliotheken für HTTP-Anfragen in React sind axios und die eingebaute fetch-API. 
Ich verwende die Bibliothek axios.


Install:   import "react-calendar/dist/Calendar.css";
npm install react-calendar


React-Toastify:
npm install --save react-toastify
imports:
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { jsPDF } from "jspdf"; und import autoTable from "jspdf-autotable";
install:  npm install jspdf jspdf-autotable

FAVICON.ico
Datei in public/favicon
implementiert in app.blade.php


FEHLERMELDUNG alert:
```java
ERROR ALERT:
    axios
        .post("/groceries", payload)
        .then((response) => {
            setRenderKey((prevKey) => prevKey + 1); // to rerender the GetGroceries component
            successAlert("The product was added successfully!");
        })
        .catch((error) => {
            errorAlert(error.response.data.message);
            console.log(error.response?.data || error.message);
        });
```




ZUM LAUFEN BRINGEN:

 * node.js installieren: https://nodejs.org/en
 * Installiere PHP und Composer: https://windows.php.net/download/ 
 * Nun im Projektordenr folgende befehle ausführen:
 * $ npm install
 * $ composer install
 * 

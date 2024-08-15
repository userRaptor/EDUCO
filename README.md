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

## MySQL:
Database settings for **MariaDB** or **MySQL** on Linux:

- To use a GUI we can use **'MySQL Workbench'** under Linux
1. Terminal Login: **$ sudo mysql -u root**
2. Create new user: **$ CREATE USER 'newUser'@'localhost' IDENTIFIED BY 'password';**
3. Assignment of rights: **$ GRANT ALL PRIVILEGES ON dataBaseEduco.\* TO 'newUser'@'localhost';**

- Other input:
  - $ SHOW DATABASES;
  - $ USE database_name
  - $ SHOW TABLES;
  - $ DROP TABLE table_name;
  - $ DESCRIBE table_name; OR SHOW COLUMNS FROM table_name;


ZUM LAUFEN BRINGEN:

 * node.js installieren: https://nodejs.org/en
 * Installiere PHP und Composer: https://windows.php.net/download/ 
 * Nun im Projektordenr folgende befehle ausführen:
 * $ npm install
 * $ composer install
 * MySQL Datenbank herunterladen 
   * Nutzer mit passwort erstellen. Ihm die rechte für die daetnbank geben
   * php artisan migrate ausführen 


 * Docker installieren
  

## Docker
DockerFile ->erstellt-> DockerImage ->erstellt-> DockerContainer

Dockerbefehle:
 * $ docker images
 * $ docker build -t name . 
 * $ socker run -d -p 80:80


Stoppt alle Container, entfernt sie und löscht die Netzwerke, die docker-compose erstellt wurden. 
``docker-compose down``

Der Befehl docker-compose build baut die Docker-Images:
``docker-compose build ``

Der Befehl docker-compose up -d startet die Container im Hintergrund:
``docker-compose up -d``

Status der Container prüfen:
``docker-compose ps``
Anwendung sollte nun unter http://localhost:8000 erreichbar sein.

Logs überprüfen bei Fehlern:
``docker-compose logs -f app``


## Testing in Laravel:
### tests ausführen:
``$ ./vendor/bin/phpunit``
``$ php artisan test``

### Feature-Tests:
 * Feature-Tests überprüfen, ob eine Funktionalität oder ein "Feature" der Anwendung aus der Perspektive des Benutzers funktioniert. Sie testen, wie verschiedene Teile der Anwendung zusammenarbeiten, um eine vollständige Funktionalität zu bieten.

### Unit-Tests
  * Unit-Tests überprüfen die kleinsten Teile einer Anwendung isoliert von anderen Teilen. Das Ziel ist es, sicherzustellen, dass jede einzelne Komponente oder Funktion wie erwartet funktioniert.
  * In der Regel umfassen Unit-Tests in Laravel:
    * Controller-Methoden
    * Middleware
    * Modelle
    * Factories (indirekt, durch getestete Modelle)
    * Migrations (strukturbezogen)
    * Seeders (indirekt, durch getestete Daten)
  * In React umfassen Unit-Tests:
    * Einzelne Komponenten (Pages, Buttons, Forms, etc.)
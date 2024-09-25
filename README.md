# EDUCO - Lebensmittelbestellungsprogram

## Installations:
 * node.js installieren: https://nodejs.org/en
 * Installiere PHP und Composer: https://windows.php.net/download/ 
 * Nun im Projektordenr folgende befehle ausführen:
 * $ npm install
 * $ composer install
 * MySQL Datenbank herunterladen 
   * Nutzer mit passwort erstellen. Ihm die rechte für die daetnbank geben
   * php artisan migrate ausführen 

 * Docker installieren
  
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

**Multi-User-Authentication:**
https://www.youtube.com/watch?v=b-qEj11h7as&t=296s&ab_channel=Cairocoders


### Code Snippets:
#### Alert Fehlermeldung:
```java
ERROR ALERT:
    axios
        .post("/groceries", payload)
        .then((response) => {

        })
        .catch((error) => {
            errorAlert(error.response.data.message);
            console.log(error.response?.data || error.message);
        });
```

#### Controller überprüfung, ob ein angemeldeter Nutzer auf die methode zugreift:
```java
public function bspControllerFunction($userId)
{
    $user = auth()->user();

    if ($user->id != $userId) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }
    
    return response()->json(...);
}
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
  

## Docker
DockerFile ->erstellt-> DockerImage ->erstellt-> DockerContainer

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

## HTTP response status codes:
 * Informational responses (100 – 199)
 * Successful responses (200 – 299)
 * Redirection messages (300 – 399)
 * Client error responses (400 – 499)
 * Server error responses (500 – 599)

## Testen:
### Siehe auch [README_Testen](README_Testen.md)!

### Tests ausführen:
``$ ./vendor/bin/phpunit`` oder ``$ php artisan test``

Gezielte Ausführung: `php artisan test tests/Unit/PostModelFunctionalityTest.php`

`php artisan test tests/Feature/Controller/OrderControllerTest.php`


#### Tests erstellen:
```
php artisan make:test UserTest --pest
php artisan make:test UserTest --unit --pest
```

Wenn Tests fehlschlagen, obwohl sie vorher funktionierten, muss der cache geleert werden:
```bash
# Cache leeren
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Datenbank korrekt zurücksetzen
php artisan migrate:fresh --seed
```

## Verwenden der Factory in Tests oder Seedern:
 * Eine Instanz erstellen (aber nicht speichern):
   * // Verwendung von make() anstelle von create(), um das Model ohne Speicherung zu erstellen
   * `$model = ModelName::factory()->make();`
 * Eine Instanz erstellen und in der Datenbank speichern:
   * `$model = ModelName::factory()->create();`
 * Mehrere Instanzen erstellen und speichern:
   * `$models = ModelName::factory()->count(5)->create();`
 * Feldwerte überschreiben:
   * `$model = ModelName::factory()->create(['field1' => 'Custom Value']);`


## Seeder:
 * Seeder erstellen: `php artisan make:seeder SuperadminSeeder` 
 * Seeder konfigurieren:
```java
use Illuminate\Database\Seeder;
use App\Models\ModelName;

class ModelNameSeeder extends Seeder
{
    public function run()
    {
        ModelName::factory()->count(50)->create();
    }
}
```
 * Seeder in DatabaseSeeder.php hinzufügen.
 * Seeders ausführen:
  * Alle Seeders in der DatabaseSeeder-Klasse ausführen:
    * `php artisan db:seed`
  * Spezifischen Seeder ausführen:
    * `php artisan db:seed --class=UserSeeder`
  * Datenbank zurücksetzen und mit einem Seed neu erstellen:
    * `php artisan migrate:fresh --seed` 



## Logging
### Event Listeners für das protokollieren von ein und ausloggen von Benutzern:
Listeners erstellen -> Diese Listener werden im folgenden Verzeichnis erstellt: `app/Listeners/`
```bash
php artisan make:listener LogSuccessfulLogin
php artisan make:listener LogSuccessfulLogout
```


### 1. **Fehler (Errors)**
   - **Unbehandelte Ausnahmen (Exceptions):** Jeder Fehler, der in deiner Anwendung auftritt und nicht explizit behandelt wird, sollte geloggt werden. Laravel tut dies standardmäßig.
   - **Anwendungsfehler:** Wenn bestimmte Logik in deiner Anwendung fehlschlägt, z.B. fehlgeschlagene API-Anfragen, Datenbankfehler oder Probleme bei der Datenvalidierung.
   - **Frontend-Fehler:** JavaScript-Fehler oder UI-Fehler in React sollten ebenfalls geloggt und, wenn möglich, an das Backend gemeldet werden.


### Best Practices für Logging
   - **Vertraulichkeit beachten:** Logge keine sensiblen Informationen wie Passwörter oder Kreditkartennummern im Klartext.
   - **Strukturierte Logs:** Verwende strukturierte Logformate (z.B. JSON), um eine bessere Verarbeitung und Analyse der Logs zu ermöglichen.
   - **Log-Level:** Verwende verschiedene Log-Level (z.B. `info`, `warning`, `error`) für unterschiedliche Arten von Informationen, um die Logs übersichtlich zu halten.
   - **Log-Rotation:** Stelle sicher, dass die Logs regelmäßig archiviert oder gelöscht werden, um Speicherplatz zu sparen.






## Visual Studio Code
Shortcuts:
 * Search global: `Strg + Shift + F`
 * Format Document: `Strg + Shift + P` -> `Format Document`

## Abhängigkeiten im Projekt aktualisieren
`npm update` (package.json)
`composer update` (composer.json) -> Laravel und seine Abhängigkeiten aktualisieren.
# EDUCO - Lebensmittelbestellungsprogram

## Installations:

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
            setRenderKey((prevKey) => prevKey + 1); // to rerender the GetGroceries component
            successAlert("The product was added successfully!");
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

## HTTP response status codes:
 * Informational responses (100 – 199)
 * Successful responses (200 – 299)
 * Redirection messages (300 – 399)
 * Client error responses (400 – 499)
 * Server error responses (500 – 599)

### Fehlermeldungen ASSERTS:
#### Assert: Check if the response status code is 403, Forbidden
```java
$response->assertStatus(403);
```
#### Assert: Check if the response status code is 302, Redirect 
```java
$response->assertStatus(302);
$response->assertRedirect('/login');  // Assert: Check if the redirect is to the login page
```   
#### Assert: Check if the response status code is 200, OK
```java
$response->assertStatus(200);
```
#### Assert: Check if the response status code is 201, OK, Created
```java
$response->assertStatus(201);
$this->assertDatabaseHas('orders', $orderData);     // Assert that the database has the new order record
$this->assertDatabaseMissing('orders', $orderData); // Assert that the order is not in the database
```
  

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


### Feature-Tests:
 * Feature-Tests überprüfen, ob eine Funktionalität oder ein "Feature" der Anwendung aus der Perspektive des Benutzers funktioniert. Sie testen, wie verschiedene Teile der Anwendung zusammenarbeiten, um eine vollständige Funktionalität zu bieten.
 * Benutzer für einen Test anlegen und authentifizieren:
```java
// Arrange: Erstelle einen Benutzer mit der Rolle 'admin'
$user = User::factory()->create([
  'role' => 'admin',
  ]);

  // Authentifiziere den Benutzer
  $this->actingAs($user);
```



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


# Factory Modelle:
Um realistische Daten für Tests oder Seeder bereitzustellen.
Neue Factory erstellen: `php artisan make:factory ModelNameFactory --model=ModelName`

1. Factory Datei bearbeiten:
   1. Factory nach dem passenden Modell konfigurieren:
      ```java
      public function definition()
      {
        return [
          'field1' => $this->faker->word,
          'field2' => $this->faker->numberBetween(1, 100),
          'related_model_id' => RelatedModel::factory(),  // Für n:m Beziehungen in Modellen. Erstellt eine neue RelatedModel-Instanz oder referenziert eine vorhandene.

          // Weitere Felder des Modells
        ];
      }
      ```
2. Im entsprechenden Modell muss ganz zu beginn in der Klasse: `use HasFactory;` eingebunden werden.

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
 * Seeder erstellen: `php artisan make:seeder ModelNameSeeder` 
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
 * Seeder ausführen: `php artisan db:seed --class=ModelNameSeeder`


## Tests mit Factorys:
In Tests kannst du Factorys verwenden, um schnell Testdaten zu generieren.
```java
public function test_example()
{
    $model = ModelName::factory()->create();

    $this->assertDatabaseHas('model_table', [
        'id' => $model->id,
        // weitere Assertions
    ]);
}
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


## Seeder
Seeder erstellen: `php artisan make:seeder SuperadminSeeder` 
Seeder in DatabaseSeeder.php hinzufügen.

#### Seeders ausführen:
* Alle Seeders in der DatabaseSeeder-Klasse ausführen:
  * `php artisan db:seed`
* Spezifischen Seeder ausführen:
  * `php artisan db:seed --class=UserSeeder`
* Datenbank zurücksetzen und mit einem Seed neu erstellen:
  * `php artisan migrate:fresh --seed` 

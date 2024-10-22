# Serververbindung Ubuntu

## Serververbung mit ssh herstellen:
```bash
ssh -i "SchluesselEC2Windows.pem" ubuntu@ec2-54-161-95-106.compute-1.amazonaws.com
```


### System-Updates durchführen:
```bash
sudo apt update && sudo apt upgrade -y
```

### Webserver installieren (Apache):
```bash
sudo apt install apache2 -y
sudo systemctl start apache2
sudo systemctl enable apache2
```


### PHP installieren:
```bash
sudo apt install php8.3-cli
sudo apt install php8.3-xml php8.3-dom

# sudo apt install -y php php-cli php-fpm php-mbstring php-xml php-bcmath php-json php-mysql php-zip
```


### MySQL installieren:
```bash
sudo apt install mysql-server 
sudo mysql_secure_installation
```

### Erstelle eine Datenbank und einen Benutzer: (siehe Readme)
Passwort: `7W#pQ2e!Xb@9UvL3`

### Node.js und npm installieren:
```bash
sudo apt install nodejs npm
```
`$ node -v` `$ npm -v`

### Composer installieren
```bash
sudo apt install composer
```

### Laravel Projekt auf den Server übertragen:
```bash
git clone https://github.com/userRaptor/EDUCO.git
```


### Abhängigkeiten installieren:
```bash
composer install
npm install
npm run build
```

### Umgebungsdatei konfigurieren:
.env Datei bearbeiten


### Anwendungsschlüssel generieren:
Der Befehl `php artisan key:generate` generiert einen zufälligen Anwendungsschlüssel (Application Key) und fügt ihn der .env-Datei als APP_KEY hinzu. 
```bash
php artisan key:generate
```

### Chat-GPT: Seite online stellen:
ich verwende aws ec2 ubuntu um meine webappliaktion online zu stellen.
Ich habe auf dem server bereits mein projekt und alle abhängigkeiten installiert.
Ich verwende laravel im backend und react im frontend.

Wie kann ich nun aber mein projekt anzeigen bzw. starten?
Lokal verwende ich folgende befehle um die webappliaktion zu starten:
$ php artisan serve
$ npm run dev



### Dateiberechtigungen setzen:
Setze die Berechtigungen für das storage- und bootstrap/cache-Verzeichnis:
```bash
sudo chown -R www-data:www-data storage
sudo chown -R www-data:www-data bootstrap/cache
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
```


### Webserver konfigurieren:

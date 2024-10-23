# Serververbindung Ubuntu

## Serververbung mit ssh herstellen:
```bash
ssh -i "EC2schlussel02.pem" ubuntu@ec2-44-220-81-43.compute-1.amazonaws.com

scp -i EC2schlussel02.pem setup.sh ubuntu@ec2-100-25-44-209.compute-1.amazonaws.com:/home/ubuntu
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
Das `index.php`-file von Apache befindet sich in: `/var/www/html/index.html`


### PHP installieren:
```bash
sudo apt install -y php php-cli php-fpm php-mbstring php-xml php-bcmath php-json php-mysql php-zip
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
composer install # composer update
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
Ich möchte Apache verwenden



### Konfiguriere Apache für Laravel:
Erstelle eine neue Apache-Konfigurationsdatei für deine Laravel-Anwendung. 
```bash
sudo nano /etc/apache2/sites-available/educo.conf
```

Apache-Konfigurationsdatei:
https://adeyomoladev.medium.com/how-to-deploy-a-laravel-app-using-apache-and-mysql-4910a07f9a0c

```bash
<VirtualHost *:80>
    ServerName 100.25.44.209  # Deine IP-Adresse
    DocumentRoot /home/ubuntu/EDUCO/public

    <Directory /home/ubuntu/EDUCO/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/educo_error.log
    CustomLog ${APACHE_LOG_DIR}/educo_access.log combined
</VirtualHost>

```
#### Aktiviere die Konfiguration:
Aktiviere die neue Site und das Rewrite-Modul:
```bash
sudo a2ensite educo.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Berechtigungen für das Laravel-Projekt setzen:
Stelle sicher, dass der Apache-Server die richtigen Berechtigungen für dein Laravel-Projekt hat:
```bash
sudo chown -R www-data:www-data /home/ubuntu/EDUCO
sudo chmod -R 755 /home/ubuntu/EDUCO/storage
sudo chmod -R 755 /home/ubuntu/EDUCO/bootstrap/cache
```

#### Starte Apache neu
Starte den Apache-Server neu, um die Änderungen zu übernehmen:
```bash
sudo systemctl restart apache2
```




### Dateiberechtigungen setzen:
Setze die Berechtigungen für das storage- und bootstrap/cache-Verzeichnis:
```bash
sudo chown -R www-data:www-data storage
sudo chown -R www-data:www-data bootstrap/cache
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
```


### Webserver konfigurieren:

### Deploying Laravel App to AWS EC2 with Apache:
https://medium.com/@abdullah.khan10032/deploying-laravel-app-to-aws-ec2-with-apache-0270136e979a

#### SSL-Zertifikat für HTTPS:
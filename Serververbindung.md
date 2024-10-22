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
git clone https://github.com/your-repo.git
```


### Abhängigkeiten installieren:
```bash
composer install --optimize-autoloader --no-dev
npm install
npm run build
```

### Umgebungsdatei konfigurieren:
.env Datei bearbeiten


### Anwendungsschlüssel generieren:
```bash
php artisan key:generate
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

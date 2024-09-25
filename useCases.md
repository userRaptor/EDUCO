# Use Cases

## Lehrperson/User:
 * [ ] Log-in
   * **Vorbedingung:** Der Nutzer befindet sich auf der Login Seite.
   * **Ablauf:** Der Nutzer gibt seine E-Mail und sein Passwort ein und klickt dann auf "Login". 
   * **Erfolg:** Der Nutzer wird auf die Dashboardseite der Webappliaktion weitergeleitet
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:** 
 * [ ] Log-out
   * **Vorbedingung:** Der Nutzer ist angemeldet.
   * **Ablauf:** Der Nutzer klickt rechts oben auf seinen Benutzernamen und anschließend auf Log Out.
   * **Erfolg:** Der Nutzer wird abgemeldet und wird zur Dashboadseite für nicht angemeldete Nutzer weitergeleitet.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Benutzernamen ändern
   * **Vorbedingung:** Der Nutzer ist angemeldet.
   * **Ablauf:** Der Nutzer klickt rechts oben auf seinen Benutzernamen und anschließend auf Profile. Dort kann unter dem Abschnitt 'Profile Information' der Benutzername und die E-Mail geändert werden und durch klicken auf den Button Save werden die Änderungen gespeichert.
   * **Erfolg:** Der Benutzername wird erfolgreich geändert. Rechts oben wird der aktualisierte Namen angezeigt.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] E-Mail ändern
   * **Vorbedingung:** Der Nutzer ist angemeldet.
   * **Ablauf:** Der Nutzer klickt rechts oben auf seinen Benutzernamen und anschließend auf Profile. Dort kann unter dem Abschnitt 'Profile Information' der Benutzername und die E-Mail geändert werden und durch klicken auf den Button Save werden die Änderungen gespeichert.
   * **Erfolg:** Die E-Mail wurde erfolgreich geändert
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Passwork aktualisieren
   * **Vorbedingung:** Der Nutzer ist angemeldet.
   * **Ablauf:** Der Nutzer klickt rechts oben auf seinen Benutzernamen und anschließend auf Profile. Dort kann unter dem Abschnitt 'Update Password' das Passwort geändert werden. Durch klicken auf den Button Save werden die Änderungen gespeichert.
   * **Erfolg:** Das Passwort wurde erfolgreich geändert.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Account löschen 
   * **Vorbedingung:** Der Nutzer ist angemeldet.
   * **Ablauf:** Der Nutzer klickt rechts oben auf seinen Benutzernamen und anschließend auf Profile. Dort kann unter dem Abschnitt 'Delete Account', nach eingabe des Passworts der eigene Account gelöscht werden. 
   * **Erfolg:** Der Account wurde erfolgreich gelöscht.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
  
 * [ ] Neue Bestellung aufgeben
   * **Vorbedingung:** Der Nutzer ist angemeldet. Er befindet sich im 'NewOrder' Tab.
   * **Ablauf:** Der Nutzer gibt den Zeitpunnkt (Datum und Uhrzeit) an, wann die Bestellung benötigt wird, die Klasse, den Ort un den Verwendungszweck. Anschließend klickt der Nutzer auf 'Add groceries' Nun können beliebige Produkte gefiltert und nach Eingabe einer Anzahl zur Bestellung hinzugefügt werden.
   * **Erfolg:** Eine neue Bestellung wurde samt Produkten gespeichert.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**

  
 * [ ] Eigene Bestellungen einsehen inkl. Detailansicht
   * **Vorbedingung:** Der Nutzer ist angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer klickt auf den Button(Pfeil) in der info Spalte seiner Bestellung. 
   * **Erfolg:** Es öffnet sich ein Fenster mit allen Produkten, die sich in der Bestellung befinden.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Bereits vorhandene Bestellung Wiederverwenden
   * **Vorbedingung:** Der Nutzer ist angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer klickt auf den Button(Reuse) in der reuse Spalte seiner Bestellung. 
   * **Erfolg:** Der Nutzer wird zum 'NewOrder' Tab weitergeleitet, wo er eine neue Bestllung samt den bestehenden Produkten erstellen kann.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Bestellung als PDF exportieren
   * **Vorbedingung:** Der Nutzer ist angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer klickt auf den Button(Download) in der download Spalte seiner Bestellung. 
   * **Erfolg:** Es wird eine Zusammenfassung  der Bestellung als PDF exportiert
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Bestellung löschen
   * **Vorbedingung:** Der Nutzer ist angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer klickt auf den Button(Delete) in der delete Spalte seiner Bestellung. 
   * **Erfolg:** Die Bestellung wird erfolgreich gelöscht.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**


## Ökonomat/Admin:
 * [ ] UseCases der Lehrperson/User
  
 * [ ] Einsehen aller Bestellungen aller Nutzer
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'AllOrders' Tab.
   * **Ablauf:** - 
   * **Erfolg:** Er sieht alle vorghandenen Bestellungen aller Nutzer.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Einzelne Bestellungen für den Export ausschließen/einschließen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer drückt den Button(Exclude/Include)
   * **Erfolg:** Die Bestellung wird für den nächsten Export ausgeschlossen/eingeschlossen.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Bestellungen eines bestimmten Zeitraums nach Lieferant sortieren und als PDF exportieren
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer gibt einen beliebigen zeitraum an. Der Nutzer klickt auf den Button 'Export by supplier'.
   * **Erfolg:** Es wird ein PDF exportiert, das alle Bestellungen innerhalb des ausgewählten Zeitraums, sortiert nach Lieferant zusammenfasst.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Bestellungen eines bestimmten Zeitraums nach Lehrperson sortieren und als PDF exportieren
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'MyOrders' Tab.
   * **Ablauf:** Der Nutzer gibt einen beliebigen zeitraum an. Der Nutzer klickt auf den Button 'Export by person'.
   * **Erfolg:** Es wird ein PDF exportiert, das alle Bestellungen innerhalb des ausgewählten Zeitraums, sortiert nach Lehrern zusammenfasst.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
  
 * [ ] Neue Produkte/Lebensmittel einzeln hinzufügen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'Groceries' Tab.
   * **Ablauf:** Unter dem Punkt 'Add new Groceries' gibt der Nutzer dem Produkt/Lebensmittel einen Namen, wählt eine Einheit und eine Kategorie aus und gibt dem Produkt noch einen Lieferanten.
   * **Erfolg:** Das Produkt wird erfolgreich hinzugefügt und in der Liste der Produkte angezeigt.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Neue Produkte/Lebensmittel über ein CSV-File hinzufügen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'Groceries' Tab.
   * **Ablauf:** Der Nutzer klickt auf den Button 'Datei auswählen' und wählt dort das passende csv file aus. Dann klickt der Nutzer auf den Button Import.
   * **Erfolg:** Die gesamten Produkt wurden erfolgreich hinzugefügt und in der Liste der Produkte angezeigt.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Produkte/Lebensmittel löschen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'Groceries' Tab.
   * **Ablauf:** Der Nutzer klickt bei der Liste der gesamten Produkte neben dem gewählten Produkt auf den Button 'Delete'.
   * **Erfolg:** Das Produkt wurde erfolgreich gelöscht und aus der Liste entfernt.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
  
 * [ ] Neue Nutzer hinzufügen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'UserManagement' Tab.
   * **Ablauf:** Unter dem Feld 'Register new user' kann der Nutzer nach Eingabe des Namens, der E-Mail, der Rolle, dem Passwort und der Passwort bestätigung auf den Button 'Register' klicken
   * **Erfolg:** Der neue Nutzer wurde erfolgreich erstellt.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Die Rolle von Nutzern ändern
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'UserManagement' Tab. 
   * **Ablauf:** Der Nutzer klickt bei der Liste der gesamten Nutzer neben dem gewählten Nutzer auf das DropDown Menü und klickt auf die neue gewünschte Rolle.
   * **Erfolg:** Die Rolle des Nutzers wird erfolgreich geändert.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Das Passwort von Nutzern zurücksetzten
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'UserManagement' Tab.
   * **Ablauf:** Der Nutzer klickt bei der Liste der gesamten Nutzer neben dem gewählten Nutzer auf den Button 'Reset Password'. Es öffnet sich ein Fenster, wo ein neues Passwort eingegeben werden muss.
   * **Erfolg:** Das Passwort wird erfolgreich geändert.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**
 * [ ] Nutzer löschen
   * **Vorbedingung:** Der Nutzer ist als Admin angemeldet. Er befindet sich im 'UserManagement' Tab.
   * **Ablauf:** Der Nutzer klickt bei der Liste der gesamten Nutzer neben dem gewählten Nutzer auf den Button 'Delete'.
   * **Erfolg:** Der Nutzer und seine gesamten Bestellungen werden gelöscht.
   * **Kein Erfolg:** Der Nutzer erhält eine Fehlermeldung.
   * **Involvierte Klassen:**

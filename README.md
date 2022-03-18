 # Guida d'utilizzo
 ### Progetto Software Cybersecurity a.a 2021/2022
 #### Ali Waqar - Angelini - Di Silvestre - Scuriatti
 
 > Nota - La seguente procedura è da intendersi per ambiente macOS o Linux
 
 ## Installazione Quorum Wizard
 Seguire le istruzioni del seguente link per ottenere una blockchain privata con 3 nodi: https://github.com/ConsenSys/quorum-wizard
 
 ## Installazioni pacchetti npm
 Scaricare **Node.js** dalla pagina ufficiale: https://nodejs.org/it/download/
 Clonare la repository "CyberSecurity-project" e, al suo inerno, eseguire il comando
 ```zsh 
 $ npm install
 ```
 che installerà i pacchetti necessari al funzionamento del software: 
 - web3
 - solc
 - quorum-js
 - inquirer
 - console-table-printer
 - @openzeppelin/contracts
 
 ## Avvio del progetto
 Entrare da terminale nella directory creata da Quorum Wizard e lanciare lo script di avvio:
 ```zsh 
 $ cd network/3-nodes-quickstart
 $ ./start.sh
 ```
 Se l'operazione ha esito positivo, entrare nella directory clonata in precedenza e, solo al primo avvio, eseguire il comando:
 ```zsh 
 $ cd CyberSecurity-project
 $ node ./Initialize.js
 ```
 Se l'operazione ha esito positivo, per avviare l'interfaccia eseguire il comando:
 ```zsh
 $ node ./Interface.js
 ```
 ## Funzionamento dell'interfaccia
 Selezionare il wallet al quale si desidera accedere tenendo conto del fatto che ad ognuno di essi è associato un ruolo diverso, rispettivamente:
 - Fornitore
 - Trasformatore
 - Cliente
 
 <img src = "/Assets/ImageREADME/SelectWallet.png" height = 100>
 
 ### Fornitore
 Selezionando il wallet associato al Fornitore sarà possibile scegliere tra le seguenti operazioni: \
 \
 <img src = "/Assets/ImageREADME/MenuFornitore.png" height = 135>
 
 ### Trasformatore 
 Selezionando il wallet associato al Trasforatore sarà possibile scegliere tra le seguenti operazioni: \
 \
 <img src = "/Assets/ImageREADME/MenuTrasformatore.png" height = 135>
 
 ### Cliente  
 Selezionando il wallet associato al Cliente sarà possibile scegliere tra le seguenti operazioni: \
 \
 <img src = "/Assets/ImageREADME/MenuCliente.png" height = 110>
 
 ## Chiusura del progetto
 Per mettere in stop la blockchain basta eseguire il comando
 ```zsh 
 $ cd network/3-nodes-quickstart
 $ ./stop.sh
 ```
 che terminerà i processi relativi ai 3 nodi

 
  
 

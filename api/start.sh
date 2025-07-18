#!/bin/bash

# Lancer le serveur WebSocket PHP en arrière-plan
php websocket-server.php &

# Lancer Apache (mode foreground)
apache2-foreground

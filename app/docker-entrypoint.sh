#!/bin/bash

# START APACHE
apachectl start

# LINK KUBERNETES MANIFESTS
ln -s /out /app/php/out

# RUN LINODE SCRAPER
php /app/php/linodes.php

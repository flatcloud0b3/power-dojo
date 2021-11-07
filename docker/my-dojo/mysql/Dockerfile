<<<<<<< HEAD
FROM    mariadb:10.6
=======
FROM    mariadb:10.5

>>>>>>> a9a75511f5f0f884271d6d866ecf86a517cbc084
# Copy mysql config
COPY    ./docker/my-dojo/mysql/mysql-dojo.cnf /etc/mysql/conf.d/mysql-dojo.cnf

# Copy update-db script
COPY    ./docker/my-dojo/mysql/update-db.sh /update-db.sh

RUN     chmod u+x /update-db.sh && \
        chmod g+x /update-db.sh

# Copy content of mysql scripts into /docker-entrypoint-initdb.d
COPY    ./db-scripts/ /docker-entrypoint-initdb.d

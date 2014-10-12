# Install postgres rpm
yum localinstall -y http://yum.postgresql.org/9.3/redhat/rhel-7-x86_64/pgdg-centos93-9.3-1.noarch.rpm

# Install EPEL rpm for newer Node.js and npm versions
yum install -y epel-release

# Install needed packages
yum install -y git make nodejs npm postgresql93-server

# Install knex globally
npm install knex -g

# Set up postgres
/usr/pgsql-9.3/bin/postgresql93-setup initdb || true

# Replace pg_hba.conf file and restore permissions and ownership
cp /vagrant/provision/pg_hba.conf /var/lib/pgsql/9.3/data/pg_hba.conf

chown postgres:postgres /var/lib/pgsql/9.3/data/pg_hba.conf
chmod 600 /var/lib/pgsql/9.3/data/pg_hba.conf

# Configure postgres to start on boot
systemctl enable postgresql-9.3

# Start postgres server
systemctl start postgresql-9.3

# Create databases
su postgres -c 'createdb pill-dispenser' || true
su postgres -c 'createdb pill-dispenser-testing' || true

# Run migrations
cd /vagrant
NODE_ENV=development knex migrate:latest
NODE_ENV=testing knex migrate:latest

cp /vagrant/provision/env-vars.sh /etc/profile.d/env-vars.sh

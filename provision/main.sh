# Install postgres rpm
yum localinstall -y http://yum.postgresql.org/9.3/redhat/rhel-7-x86_64/pgdg-centos93-9.3-1.noarch.rpm

# Install EPEL rpm for newer Node.js and npm versions
yum install -y epel-release

# Install needed packages
yum install -y git make nodejs npm postgresql93-server

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

# Insert structure
su postgres -c 'psql pill-dispenser < /vagrant/docs/database/schema.sql'
su postgres -c 'psql pill-dispenser-testing < /vagrant/docs/database/schema.sql'

cp /vagrant/provision/env-vars.sh /etc/profile.d/env-vars.sh

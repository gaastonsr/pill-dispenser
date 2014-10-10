Vagrant.configure('2') do |config|

    config.vm.box = 'chef/centos-7.0'
    config.vm.hostname = 'server'

    config.vm.network 'forwarded_port', guest: 8080, host: 8080
    config.vm.provision 'shell', path: "provision/main.sh"

end

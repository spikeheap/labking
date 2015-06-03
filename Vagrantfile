# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
#Check if you have the good Vagrant version to use docker provider...
Vagrant.require_version ">= 1.6.0"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'


  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "docker" do |d|
    d.image = "spikeheap/labkey-standalone"
    d.has_ssh = true
    d.volumes = ["./dist/:/labkey/labkey/externalModules"]
  end
  config.ssh.port = 22

  #config.vm.synced_folder "./dist/", "/labkey/labkey/externalModules"
end

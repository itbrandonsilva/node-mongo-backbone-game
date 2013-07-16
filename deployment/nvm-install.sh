# Install nvm

function evlvar () {
    eval $(echo "$1" | grep -m 1 "$2");
    return 0;
}

NVM_INSTALL_SCRIPT=`wget -qO - https://raw.github.com/creationix/nvm/master/install.sh`;
evlvar "$NVM_INSTALL_SCRIPT" NVM_DIR;
evlvar "$NVM_INSTALL_SCRIPT" SOURCE_STR;

if [ -e ~/.bashrc ]; then
    if grep -q "$SOURCE_STR" ~/.bashrc; then
        echo ".bashrc has already been configured.";
    else 
        echo ".bashrc has been configured.";
        echo -e "\n$SOURCE_STR" >> ~/.bashrc;
    fi
fi

source ~/.profile;
nvm install 0.10
nvm alias default 0.10

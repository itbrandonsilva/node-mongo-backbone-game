# When using nvm, this script must be run using "sudo -E"

if [[ -n "$NVM_BIN" ]]; then 
    PATH_PREFIX=$NVM_BIN/;
fi

NPM_ALIAS="$PATH_PREFIX"npm;
$NPM_ALIAS install -g bowery;
# Probably not needed; needed to be used once
# $NPM_ALIAS install -g express;

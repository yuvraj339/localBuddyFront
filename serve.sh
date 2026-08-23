#!/bin/bash
cd ../localBuddyFront
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use 24
npm run dev -- --host 
#!/usr/bin/env bash

rm -rf _artifacts

DOCKER_BUILDKIT=1 docker build --target staging -o _artifacts .

scp _artifacts/catpics.jar "$USER"@"$SSH_HOST":/home/protected

ssh "$USER"@"$SSH_HOST" -t 'nfsn signal-daemon App term'
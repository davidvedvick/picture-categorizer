#!/usr/bin/env bash

rm -rf _artifacts

DOCKER_BUILDKIT=1 docker build --target staging -o _artifacts .

scp _artifacts/catpics.jar "$USER"@ssh.phx.nearlyfreespeech.net:/home/protected

ssh "$USER"@ssh.phx.nearlyfreespeech.net -t 'nfsn signal-daemon App term'
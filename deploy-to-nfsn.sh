#!/usr/bin/env bash

rm -rf _artifacts

DOCKER_BUILDKIT=1 docker build --target staging -o _artifacts .

EXIT_CODE=${PIPESTATUS[0]}

if [ "$EXIT_CODE" -ne 0 ]; then
  exit "${EXIT_CODE}"
fi

chmod 755 _artifacts

rsync -avzh --delete --log-file=rsync-log --exclude app-config.json --exclude '*specs/*' \
  ./_artifacts/ "$SSH_USER"@"$SSH_HOST":/home/protected

if grep -q -E '<f[\.\+stp]+[[:blank:]]package.*\.json' rsync-log; then
  ssh "$SSH_USER"@"$SSH_HOST" -t 'cd /home/protected && npm install --production && (npm cache clean & nfsn signal-daemon App term)'
fi

EXIT_CODE=${PIPESTATUS[0]}

exit "${EXIT_CODE}"

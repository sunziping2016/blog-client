#!/usr/bin/env sh
rsync -avh --delete "$(dirname "$0")/../dist/" szp.io:/srv/http/blog

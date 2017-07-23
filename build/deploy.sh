#!/usr/bin/env sh
rsync -avh "$(dirname "$0")/../dist/" szp.io:/srv/http/blog

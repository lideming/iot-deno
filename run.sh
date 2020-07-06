#!/bin/sh

exec deno run --allow-net --allow-write=data/ --allow-read=data/ --unstable main.ts

#!/bin/bash

./package.sh

if [$? -ne 0]
  then
    echo "Fail"
    exit 1
  else
  exit 0
fi


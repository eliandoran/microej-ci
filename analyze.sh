#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    echo "Consult the README for information."
    exit 1
fi

# Execute the given command, preserving its output but also logging to a file
# for later analysis.
$@ 2>&1 | tee input.log
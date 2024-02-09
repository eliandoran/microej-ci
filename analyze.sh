#!/usr/bin/env bash
script_dir=$(realpath $(dirname $0))

if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    echo "Consult the README for information."
    exit 1
fi

log_file="$script_dir/input.log"

# Execute the given command, preserving its output but also logging to a file
# for later analysis.
"$@" 2>&1 | tee "$log_file"

exit_code=${PIPESTATUS[0]}

# Run the analysis
cd "$script_dir"
cat "$log_file" | node index.js
exit $exit_code
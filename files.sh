#!/bin/bash

# --- Configuration ---
START_DIR="."                 # Directory to start searching from
MAX_DEPTH=6                   # Max depth for file traversal
OUTPUT_FILE="code.txt"        # Output Markdown file with code contents
TREE_FILE="o.txt"             # Output file for directory tree
IGNORE_DIRS=("node_modules" "assets" "backup_assets" ".git" ".vscode" "dist" "build" "bootstrap-5.3*") # Directories to ignore
INCLUDE_EXTENSIONS=("py" "js" "jsx" "ts" "tsx" "css" "scss" "html" "txt" "env") # File extensions to include

# --- Validate start directory ---
if [ ! -d "$START_DIR" ]; then
  echo "Error: Start directory '$START_DIR' not found." >&2
  exit 1
fi

# --- Build find ignore options ---
ignore_opts=()
if [ ${#IGNORE_DIRS[@]} -gt 0 ]; then
  ignore_opts+=("(")
  for i in "${!IGNORE_DIRS[@]}"; do
    [ "$i" -ne 0 ] && ignore_opts+=("-o")
    ignore_opts+=("-name" "${IGNORE_DIRS[$i]}" "-type" "d")
  done
  ignore_opts+=(")" "-prune")
else
  ignore_opts+=("(" "-false" ")" "-prune")
fi

# --- Build file extension match options ---
include_opts=()
if [ ${#INCLUDE_EXTENSIONS[@]} -gt 0 ]; then
  include_opts+=("(")
  for i in "${!INCLUDE_EXTENSIONS[@]}"; do
    [ "$i" -ne 0 ] && include_opts+=("-o")
    include_opts+=("-name" "*.${INCLUDE_EXTENSIONS[$i]}")
  done
  include_opts+=(")")
fi

# --- Clear or create output file ---
> "$OUTPUT_FILE"
echo "Generating $OUTPUT_FILE..."

# --- Main loop: Find and format files ---
find "$START_DIR" -maxdepth "$MAX_DEPTH" \
  "${ignore_opts[@]}" -o \( -type f "${include_opts[@]}" \) -print0 |
while IFS= read -r -d '' file; do
  clean_file="${file#./}"
  extension="${clean_file##*.}"
  extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')

  # Determine language hint for Markdown
  case "$extension_lower" in
    py) lang="python" ;;
    js|jsx) lang="javascript" ;;
    ts|tsx) lang="typescript" ;;
    css) lang="css" ;;
    scss) lang="scss" ;;
    html) lang="html" ;;
    sh) lang="bash" ;;
    json) lang="json" ;;
    yaml|yml) lang="yaml" ;;
    txt|env) lang="" ;;
    *) lang="" ;;
  esac

  {
    echo "\`$clean_file\`"
    echo
    echo "\`\`\`$lang"
    cat "$file"
    echo "\`\`\`"
    echo
  } >> "$OUTPUT_FILE"

  echo "Added: $clean_file"
done

echo "Finished writing $OUTPUT_FILE."

# --- Generate directory tree excluding ignored folders ---
ignore_pattern=$(IFS="|"; echo "${IGNORE_DIRS[*]}")
tree -a -I "$ignore_pattern" "$START_DIR" > "$TREE_FILE"
echo "Directory tree saved to $TREE_FILE."

exit 0
